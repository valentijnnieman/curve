import * as React from "react";

import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { BlockProps, ComposedBlockProps } from "../../types/blockProps";

export const composedBlock = (
  BlockToCompose: React.ComponentClass<ComposedBlockProps>
) => {
  return class extends React.Component<BlockProps> {
    gainInputElement: HTMLDivElement;
    freqInputElement: HTMLDivElement;
    outputElement: HTMLDivElement;

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
          connectedFromEl: this.outputElement.getBoundingClientRect() as DOMRect
        };
        this.props.updateNode(updateSelf);
      }
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
          node={this.props.node}
          allNodes={this.props.allNodes}
          internal={this.props.internal}
          allInternals={this.props.allInternals}
          tryToConnect={this.props.tryToConnect}
          tryToConnectTo={this.props.tryToConnectTo}
          canConnect={this.props.canConnect}
          updateNode={this.props.updateNode}
          audioCtx={this.props.audioCtx}
          connectToAnalyser={this.connectToAnalyser}
          connectInternal={this.connectInternal}
          onDragHandler={this.onDragHandler}
        />
      );
    }
  };
};
