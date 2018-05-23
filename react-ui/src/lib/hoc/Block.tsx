import * as React from "react";

import { BlockData } from "../../types/blockData";
import { ComposedBlockProps, BlockProps } from "../../types/blockProps";
import { InternalOscData, InternalBiquadData } from "../../types/internalData";

export const composedBlock = (
  BlockToCompose: React.ComponentClass<BlockProps>
) => {
  return class extends React.Component<ComposedBlockProps> {
    constructor(props: ComposedBlockProps) {
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
        if (output !== undefined && output.isConnectedTo !== -1) {
          // check which block it's connected to & to witch input type
          const blockToConnectTo = this.props.allBlocks[output.isConnectedTo];
          let destination;
          switch (output.connectedToType) {
            case "GAIN":
              destination = blockToConnectTo.internal.gain;
              break;
            case "GAIN_MOD":
              destination = blockToConnectTo.internal.gain.gain;
              break;
            case "FREQ":
              switch (blockToConnectTo.blockType) {
                case "OSC":
                  destination = (blockToConnectTo.internal as InternalOscData)
                    .oscillator.frequency;
                  break;
                case "BIQUAD":
                  destination = (blockToConnectTo.internal as InternalBiquadData)
                    .filter.frequency;
                  break;
                default:
                  destination = (blockToConnectTo.internal as InternalOscData)
                    .oscillator.frequency;
                  break;
              }
              break;
            default:
              destination = blockToConnectTo.internal.gain;
              break;
          }
          block.internal.gain.connect(destination as AudioParam);
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
        const inputFromBlock = this.props.allBlocks.find(
          b => b.id === input
        ) as BlockData;
        if (inputFromBlock) {
          inputFromBlock.outputs
            .filter(output => output.connectedToType === outputType)
            .map(output => {
              allInputTypes.push(output.connectedToType as string);
            });
        }
      });
      if (allInputTypes.includes(outputType)) {
        return "io-element io-element--active";
      } else {
        return "io-element";
      }
    };
    componentWillReceiveProps(nextProps: ComposedBlockProps) {
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
          {...this.props as ComposedBlockProps}
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
