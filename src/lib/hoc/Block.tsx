import * as React from "react";

import { OscDataObject, GainDataObject } from "../../types/nodeObject";
import {
  BlockProps,
  OscBlockProps,
  GainBlockProps
} from "../../types/blockProps";

export const composedBlock = (
  BlockToCompose: React.ComponentClass<OscBlockProps | GainBlockProps>
) => {
  return class extends React.Component<BlockProps> {
    constructor(props: BlockProps) {
      super(props);
    }
    connectToAnalyser = () => {
      this.props.internal.gain.connect(this.props.internal.analyser);
    };
    connectInternal = () => {
      const { node, internal } = this.props;
      internal.gain.disconnect();
      window.console.log("connectINternal");
      this.connectToAnalyser();
      node.outputs.map(output => {
        if (output !== undefined) {
          internal.gain.connect(output.destination as AudioParam);
        }
      });
      if (node.isConnectedToOutput) {
        window.console.log("go to output");
        internal.gain.connect(this.props.audioCtx.destination);
      }
    };
    onDragHandler = (
      gainInputElement: DOMRect,
      outputElement: DOMRect,
      freqInputElement?: DOMRect
    ) => {
      if (freqInputElement) {
        const updatedNode: OscDataObject = {
          ...this.props.node,
          gainInputDOMRect: gainInputElement,
          freqInputDOMRect: freqInputElement as DOMRect,
          outputDOMRect: outputElement
        } as OscDataObject;
        this.props.updateNode(updatedNode);
      } else {
        const updatedNode: GainDataObject = {
          ...this.props.node,
          gainInputDOMRect: gainInputElement,
          outputDOMRect: outputElement
        } as GainDataObject;
        this.props.updateNode(updatedNode);
      }
    };
    tryToConnect = (outputElement: DOMRect) => {
      this.props.tryToConnect(
        this.props.node,
        this.props.internal,
        outputElement
      );
    };
    checkInputs = (outputType: string) => {
      let allInputTypes: Array<string> = [];
      this.props.node.hasInputFrom.map(input => {
        const inputFromBlock = this.props.allNodes[input];
        inputFromBlock.outputs
          .filter(output => output.connectedToType === outputType)
          .map(output => {
            allInputTypes.push(output.connectedToType as string);
          });
      });
      if (allInputTypes.includes(outputType)) {
        return "io-element io-element--active";
      } else {
        return "io-element";
      }
    };
    componentWillReceiveProps(nextProps: BlockProps) {
      if (this.props.node.outputs !== nextProps.node.outputs) {
        this.props = nextProps;
        this.connectInternal();
      } else {
        this.props = nextProps;
      }
    }
    render() {
      return (
        <BlockToCompose
          {...this.props as OscBlockProps | GainBlockProps}
          connectToAnalyser={this.connectToAnalyser}
          connectInternal={this.connectInternal}
          tryToConnect={this.tryToConnect}
          onDragHandler={this.onDragHandler}
          checkInputs={this.checkInputs}
        />
      );
    }
  };
};
