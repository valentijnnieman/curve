import * as React from "react";

import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { BlockProps, ComposedBlockProps } from "../../types/blockProps";

export const composedBlock = (
  BlockToCompose: React.ComponentClass<ComposedBlockProps>
) => {
  return class extends React.Component<BlockProps> {
    constructor(props: BlockProps) {
      super(props);
    }
    connectToAnalyser = () => {
      window.console.log("connectTOAnalyaser", this.props.internal.analyser);
      this.props.internal.gain.connect(this.props.internal.analyser);
    };
    connectInternal = () => {
      const { node, internal } = this.props;
      window.console.log("connectinternal", internal);
      internal.gain.disconnect();
      this.connectToAnalyser();
      if (node.output !== undefined) {
        internal.gain.connect(node.output as AudioParam);
      }
    };
    onDragHandler = (
      gainInputElement: DOMRect,
      outputElement: DOMRect,
      freqInputElement?: DOMRect
    ) => {
      // determine if output and/or input is connected
      if (this.props.node.hasInputFrom.length > 0) {
        this.props.node.hasInputFrom.map(input => {
          const inputFromNode = this.props.allNodes[input];
          if (inputFromNode.connectedToType === "gain") {
            const updatedNode: GainDataObject | NodeDataObject = {
              ...inputFromNode,
              connectedToEl: gainInputElement
            };
            this.props.updateNode(updatedNode);
          } else if (inputFromNode.connectedToType === "freq") {
            const updatedNode: GainDataObject | NodeDataObject = {
              ...inputFromNode,
              connectedToEl: freqInputElement
            };
            this.props.updateNode(updatedNode);
          }
        });
      }

      if (this.props.node.connected) {
        const updateSelf: NodeDataObject = {
          ...this.props.node,
          connectedFromEl: outputElement
        };
        this.props.updateNode(updateSelf);
      }
    };
    tryToConnect = (outputElement: DOMRect) => {
      this.props.tryToConnect(
        this.props.node,
        this.props.internal,
        outputElement
      );
    };
    componentWillReceiveProps(nextProps: BlockProps) {
      if (this.props.node.output !== nextProps.node.output) {
        this.props = nextProps;
        this.connectInternal();
      } else {
        this.props = nextProps;
      }
    }
    render() {
      return (
        <BlockToCompose
          {...this.props}
          connectToAnalyser={this.connectToAnalyser}
          connectInternal={this.connectInternal}
          tryToConnect={this.tryToConnect}
          onDragHandler={this.onDragHandler}
        />
      );
    }
  };
};
