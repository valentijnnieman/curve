import * as React from "react";

import { BlockData } from "../../types/blockData";
import { ComposedBlockProps, BlockProps } from "../../types/blockProps";
import { InternalOscData, InternalBiquadData } from "../../types/internalData";
import { DraggableData } from "react-draggable";

export const composedBlock = (
  BlockToCompose: React.ComponentClass<BlockProps>
) => {
  return class extends React.PureComponent<ComposedBlockProps> {
    position: HTMLDivElement;

    connectToAnalyser = () => {
      this.props.block.internal.gain.connect(
        this.props.block.internal.analyser
      );
    };
    connectInternal = () => {
      const { block } = this.props;
      block.internal.gain.disconnect();
      this.connectToAnalyser();
      block.outputs.forEach(output => {
        if (output !== undefined) {
          // check which block it's connected to & to witch input type
          const blockToConnectTo = this.props.allBlocks.find(
            b => b.id === output.isConnectedTo
          ) as BlockData;
          let destination;
          switch (output.connectedToType) {
            case "GAIN":
              switch (blockToConnectTo.blockType) {
                case "BIQUAD":
                  destination = (blockToConnectTo.internal as InternalBiquadData)
                    .filter;
                  break;
                default:
                  destination = blockToConnectTo.internal.gain;
                  break;
              }
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
            case "DESTINATION":
              destination = blockToConnectTo.internal.gain;
              // connect internal gain to destination (speakers)
              blockToConnectTo.internal.gain.connect(
                this.props.audioCtx.destination
              );
              // connect internal gain to analyser
              blockToConnectTo.internal.gain.connect(
                blockToConnectTo.internal.analyser
              );
              break;
            case "TRIGGER":
              // connecting to analyser allows us to read stream
              destination = blockToConnectTo.internal.analyser;
              break;
            default:
              destination = blockToConnectTo.internal.gain;
              break;
          }
          block.internal.gain.connect(destination as AudioParam);
        }
      });
    };
    onDragHandler = (
      data: DraggableData,
      gainInputElement: DOMRect,
      outputElement: DOMRect,
      freqInputElement?: DOMRect,
      triggerInputElement?: DOMRect
    ) => {
      if (freqInputElement) {
        const updatedBlock: BlockData = {
          ...this.props.block,
          x: data.x,
          y: data.y,
          gainInputDOMRect: gainInputElement,
          freqInputDOMRect: freqInputElement as DOMRect,
          outputDOMRect: outputElement
        };
        this.props.updateBlock(updatedBlock);
      }
      if (triggerInputElement) {
        const updatedBlock: BlockData = {
          ...this.props.block,
          x: data.x,
          y: data.y,
          gainInputDOMRect: gainInputElement,
          triggerInputDOMRect: triggerInputElement as DOMRect,
          outputDOMRect: outputElement
        };
        this.props.updateBlock(updatedBlock);
      } else {
        const updatedBlock: BlockData = {
          ...this.props.block,
          x: data.x,
          y: data.y,
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
      this.props.block.hasInputFrom.forEach(input => {
        const inputFromBlock = this.props.allBlocks.find(
          b => b.id === input
        ) as BlockData;
        if (inputFromBlock) {
          inputFromBlock.outputs
            .filter(output => output.connectedToType === outputType)
            .forEach(output => {
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
    render() {
      this.connectInternal();
      return (
        <BlockToCompose
          {...(this.props as ComposedBlockProps)}
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
