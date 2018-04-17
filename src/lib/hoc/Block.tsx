import * as React from "react";

import { BlockData } from "../../types/blockData";
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
      this.props.block.internal.gain.connect(
        this.props.block.internal.analyser
      );
    };
    connectInternal = () => {
      const { block } = this.props;
      block.internal.gain.disconnect();
      this.connectToAnalyser();
      block.outputs.map(output => {
        if (output !== undefined) {
          block.internal.gain.connect(output.destination as AudioParam);
        }
      });
      if (block.isConnectedToOutput) {
        block.internal.gain.connect(this.props.audioCtx.destination);
      }
    };
    onDragHandler = (
      gainInputElement: DOMRect,
      outputElement: DOMRect,
      freqInputElement?: DOMRect
    ) => {
      if (freqInputElement) {
        const updatedBlock: BlockData = {
          ...this.props.block,
          gainInputDOMRect: gainInputElement,
          freqInputDOMRect: freqInputElement as DOMRect,
          outputDOMRect: outputElement
        };
        this.props.updateBlock(updatedBlock);
      } else {
        const updatedBlock: BlockData = {
          ...this.props.block,
          gainInputDOMRect: gainInputElement,
          outputDOMRect: outputElement
        };
        this.props.updateBlock(updatedBlock);
      }
    };
    tryToConnect = (outputElement: DOMRect) => {
      this.props.tryToConnect(
        this.props.block,
        this.props.block.internal,
        outputElement
      );
    };
    checkInputs = (outputType: string) => {
      let allInputTypes: Array<string> = [];
      this.props.block.hasInputFrom.map(input => {
        const inputFromBlock = this.props.allBlocks[input];
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
      if (this.props.block.outputs !== nextProps.block.outputs) {
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
