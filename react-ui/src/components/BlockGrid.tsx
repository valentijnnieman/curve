import * as React from "react";
import { BlockData } from "src/types/blockData";
import OscBlock from "../components/block/OscBlock";
import GainBlock from "../components/block/GainBlock";
import BiquadBlock from "../components/block/BiquadBlock";
import EnvelopeBlock from "../components/block/EnvelopeBlock";
import DestinationBlock from "../components/block/DestinationBlock";
import { InternalData } from "src/types/internalData";

interface BlockGridProps {
  blocks: Array<BlockData>;
  tryToConnect: (block: BlockData, internal: InternalData, el: DOMRect) => void;
  tryToConnectTo: (block: BlockData, outputType: string, el: DOMRect) => void;
  wantsToConnect: boolean;
  updateBlock: (block: BlockData) => void;
  deleteAndDisconnect: (id: string) => void;
  audioCtx: AudioContext;
  dragging: boolean;
  startDragging: () => void;
  stopDragging: () => void;
}

export class BlockGrid extends React.Component<BlockGridProps> {
  constructor(props: BlockGridProps) {
    super(props);
  }
  shouldComponentUpdate(nextProps: BlockGridProps) {
    if (nextProps.dragging) {
      // Only update if something besides the x-y coords have changed
      const nextBlocksWithoutCoords = nextProps.blocks.map(block => {
        return {
          ...block,
          x: null,
          y: null,
          outputDOMRect: null,
          freqInputDOMRect: null,
          gainInputDOMRect: null,
          triggerInputDOMRect: null
        };
      });
      const blocksWithoutCoords = this.props.blocks.map(block => {
        return {
          ...block,
          x: null,
          y: null,
          outputDOMRect: null,
          freqInputDOMRect: null,
          gainInputDOMRect: null,
          triggerInputDOMRect: null
        };
      });
      if (
        JSON.stringify(blocksWithoutCoords) !==
        JSON.stringify(nextBlocksWithoutCoords)
      ) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }
  render() {
    return this.props.blocks.map((block: BlockData, index: number) => {
      if (block.internal) {
        if (block.blockType === "OSC") {
          return (
            <OscBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              tryToConnect={this.props.tryToConnect}
              tryToConnectTo={this.props.tryToConnectTo}
              canConnect={this.props.wantsToConnect}
              updateBlock={this.props.updateBlock}
              deleteBlock={this.props.deleteAndDisconnect}
              audioCtx={this.props.audioCtx}
              startDragging={this.props.startDragging}
              stopDragging={this.props.stopDragging}
            />
          );
        } else if (block.blockType === "GAIN") {
          return (
            <GainBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              tryToConnect={this.props.tryToConnect}
              tryToConnectTo={this.props.tryToConnectTo}
              canConnect={this.props.wantsToConnect}
              updateBlock={this.props.updateBlock}
              deleteBlock={this.props.deleteAndDisconnect}
              audioCtx={this.props.audioCtx}
              startDragging={this.props.startDragging}
              stopDragging={this.props.stopDragging}
            />
          );
        } else if (block.blockType === "BIQUAD") {
          return (
            <BiquadBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              tryToConnect={this.props.tryToConnect}
              tryToConnectTo={this.props.tryToConnectTo}
              canConnect={this.props.wantsToConnect}
              updateBlock={this.props.updateBlock}
              deleteBlock={this.props.deleteAndDisconnect}
              audioCtx={this.props.audioCtx}
              startDragging={this.props.startDragging}
              stopDragging={this.props.stopDragging}
            />
          );
        } else if (block.blockType === "ENVELOPE") {
          return (
            <EnvelopeBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              tryToConnect={this.props.tryToConnect}
              tryToConnectTo={this.props.tryToConnectTo}
              canConnect={this.props.wantsToConnect}
              updateBlock={this.props.updateBlock}
              deleteBlock={this.props.deleteAndDisconnect}
              audioCtx={this.props.audioCtx}
              startDragging={this.props.startDragging}
              stopDragging={this.props.stopDragging}
            />
          );
        } else if (block.blockType === "DESTINATION") {
          return (
            <DestinationBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              tryToConnect={this.props.tryToConnect}
              tryToConnectTo={this.props.tryToConnectTo}
              canConnect={this.props.wantsToConnect}
              updateBlock={this.props.updateBlock}
              deleteBlock={this.props.deleteAndDisconnect}
              audioCtx={this.props.audioCtx}
              startDragging={this.props.startDragging}
              stopDragging={this.props.stopDragging}
            />
          );
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  }
}
