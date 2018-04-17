import * as React from "react";

import "./Editor.css";
import OscBlock from "../components/block/OscBlock";
import GainBlock from "../components/block/GainBlock";
import { Code } from "../components/ui/Code";
// import OutputNode from "../components/block/OutputNode";
import { InternalOscData, InternalGainData } from "../types/internalData";
import { BlockData, OutputData } from "../types/blockData";
import { Line } from "../types/lineData";
import { StoreState } from "../types/storeState";

import { connect } from "react-redux";

import { updateBlock } from "../actions/block";

// helpers
import {
  buildInternals,
  drawConnectionLines,
  genWACode
} from "../lib/helpers/Editor";

const SpeakerSVG = require("../speakers.svg");

interface EditorProps {
  blocks: Array<BlockData>;
  updateBlock: (block: BlockData) => void;
}

interface EditorState {
  wantsToConnect: boolean;
  blockToConnect?: BlockData;
  blockToConnectTo?: BlockData;
  internalToConnect?: InternalOscData | InternalGainData;
  outputToConnectTo?: AudioParam | AudioDestinationNode;
  outputType?: string;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  speakersAreConnected: boolean;
  mouseX?: number;
  mouseY?: number;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  output: InternalGainData;
  code: string;
  _AUDIOCTX: AudioContext;
  _INTERNALS: Array<InternalOscData | InternalGainData> = [];
  lines: Array<Line> = [];
  speakersDOMRect: HTMLDivElement;
  constructor(props: EditorProps) {
    super(props);
    this._AUDIOCTX = new AudioContext(); // define audio context

    this.state = {
      wantsToConnect: false,
      speakersAreConnected: false
    };
    // Build internal objects from blocks used with web audio
    this._INTERNALS = buildInternals(
      this.props.blocks,
      this._AUDIOCTX,
      this.props.updateBlock,
      this._INTERNALS
    );
    this.code = genWACode(this.props.blocks, this._INTERNALS);
  }
  testConnect = () => {
    // checks if connection can be made & updates blocks info
    const {
      blockToConnect,
      blockToConnectTo,
      outputToConnectTo,
      outputType
    } = this.state;
    if (blockToConnect && blockToConnectTo && outputToConnectTo) {
      // update node info in store
      const updatedBlock: BlockData = {
        ...blockToConnect,
        connected: true,
        outputs: [
          ...blockToConnect.outputs,
          {
            id: blockToConnect.outputs.length, // TO-DO: find a better solution
            destination: outputToConnectTo,
            connectedToType: outputType,
            isConnectedTo: blockToConnectTo.id
          } as OutputData
        ]
      };
      this.props.updateBlock(updatedBlock);

      // update the node we're connecting to
      // specifying it has an input from updatedNode
      const updatedBlockTo: BlockData = {
        ...blockToConnectTo,
        hasInputFrom: [...blockToConnectTo.hasInputFrom, blockToConnect.id]
      };
      this.props.updateBlock(updatedBlockTo);
    }
    // we're done connecting!
    this.stopTryingToConnect();
  };
  stopTryingToConnect = () => {
    this.setState({
      wantsToConnect: false,
      blockToConnect: undefined,
      blockToConnectTo: undefined,
      internalToConnect: undefined,
      outputToConnectTo: undefined,
      lineFrom: undefined,
      lineTo: undefined
    });
  };
  disconnect = (fromBlock: number, toBlock: number, outputId: number) => {
    // update node info in store
    const blockWithOutput = this.props.blocks[fromBlock];
    const blockWithInput = this.props.blocks[toBlock];
    const internal = this._INTERNALS[fromBlock];
    const updatedBlockWithOutput: BlockData = {
      ...blockWithOutput,
      connected: blockWithOutput.outputs.length > 1 ? true : false,
      isConnectedToOutput: false,
      outputs: blockWithOutput.outputs.filter(output => output.id !== outputId)
    };
    this.props.updateBlock(updatedBlockWithOutput);

    const indexOfInput = blockWithInput.hasInputFrom.indexOf(fromBlock);

    blockWithInput.hasInputFrom.splice(indexOfInput, 1);
    const updatedBlockWithInput: BlockData = {
      ...blockWithInput
    };
    this.props.updateBlock(updatedBlockWithInput);

    internal.gain.disconnect();
  };
  tryToConnect = (
    node: BlockData,
    internal: InternalOscData | InternalGainData,
    el: DOMRect
  ) => {
    // called from node that wants to connect it's output

    // if it's already connected, disconnect it!
    // if (node.connected) {
    //   this.disconnect(node, internal);
    // }
    this.setState({
      wantsToConnect: true,
      blockToConnect: node,
      internalToConnect: internal,
      lineFrom: el,
      mouseX: el.x,
      mouseY: el.y
    });
  };
  tryToConnectTo = (
    block: BlockData,
    output: AudioParam,
    outputType: string,
    el: DOMRect
  ) => {
    // called form node that wants to be connected to
    if (this.state.wantsToConnect) {
      this.setState(
        {
          blockToConnectTo: block,
          outputToConnectTo: output,
          outputType: outputType,
          lineTo: el
        },
        () => {
          // when done setting state
          if (
            (this.state.blockToConnect as BlockData).id ===
            (this.state.blockToConnectTo as BlockData).id
          ) {
            // let's not connect output to input!
            this.stopTryingToConnect();
          } else {
            this.testConnect();
          }
        }
      );
    }
  };
  connectToSpeakers = (e: any) => {
    const { blockToConnect } = this.state;
    if (blockToConnect) {
      this.setState({
        lineTo: e.target.getBoundingClientRect(),
        outputToConnectTo: this._AUDIOCTX.destination,
        speakersAreConnected: true
      });
      const updatedNode: BlockData = {
        ...(blockToConnect as BlockData),
        connected: true,
        isConnectedToOutput: true,
        outputs: [
          ...blockToConnect.outputs,
          {
            id: blockToConnect.outputs.length, // TO-DO: maybe find a better solution
            destination: this._AUDIOCTX.destination,
            connectedToType: "gain",
            isConnectedTo: -1 // speakers are -1
          } as OutputData
        ]
      };
      this.props.updateBlock(updatedNode);
      this.testConnect();
    }
  };
  componentWillReceiveProps(nextProps: EditorProps) {
    this.props = nextProps;
    // rebuild internals
    this._INTERNALS = buildInternals(
      this.props.blocks,
      this._AUDIOCTX,
      this.props.updateBlock,
      this._INTERNALS
    );
    this.lines = drawConnectionLines(
      this.props.blocks,
      this.speakersDOMRect.getBoundingClientRect() as DOMRect
    );
    this.code = genWACode(this.props.blocks, this._INTERNALS);
  }
  onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.wantsToConnect) {
      this.setState({
        mouseX: e.pageX,
        mouseY: e.pageY
      });
    }
  };
  stopMouseLine = (e: React.MouseEvent<SVGElement>) => {
    if (this.state.wantsToConnect) {
      // if we click anywhere that's not an input, we stop trying to connect
      this.stopTryingToConnect();
    }
  };

  render() {
    const synthElements = this.props.blocks.map(
      (block: BlockData, index: number) => {
        if (block.blockType === "OSC") {
          return (
            <OscBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              internal={this._INTERNALS[index] as InternalOscData}
              allInternals={this._INTERNALS}
              tryToConnect={this.tryToConnect}
              tryToConnectTo={this.tryToConnectTo}
              canConnect={this.state.wantsToConnect}
              updateBlock={this.props.updateBlock}
              audioCtx={this._AUDIOCTX}
            />
          );
        } else {
          return (
            <GainBlock
              key={index}
              block={block}
              allBlocks={this.props.blocks}
              internal={this._INTERNALS[index] as InternalGainData}
              allInternals={this._INTERNALS}
              tryToConnect={this.tryToConnect}
              tryToConnectTo={this.tryToConnectTo}
              canConnect={this.state.wantsToConnect}
              updateBlock={this.props.updateBlock}
              audioCtx={this._AUDIOCTX}
            />
          );
        }
      }
    );
    const lineElements = this.lines.map((line, index) => {
      return (
        <g key={index}>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#f50057"
            strokeWidth={4}
            strokeDasharray="4, 4"
            className="connection-line"
            onClick={e =>
              this.disconnect(line.fromBlock, line.toBlock, line.outputId)
            }
          />
        </g>
      );
    });
    let lineToMouse;
    if (this.state.wantsToConnect && this.state.lineFrom) {
      lineToMouse = (
        <line
          x1={this.state.lineFrom.x}
          y1={this.state.lineFrom.y + 12}
          x2={this.state.mouseX}
          y2={this.state.mouseY}
          strokeDasharray="4, 4"
          stroke="#f50057"
          strokeWidth={4}
        />
      );
    }
    return (
      <div onMouseMove={e => this.onMouseMove(e)}>
        <svg className="grid-svg" onClick={e => this.stopMouseLine(e)}>
          {lineElements}
          {lineToMouse}
        </svg>
        {synthElements}
        <Code code={this.code} />
        <div className="card speakers">
          <div className="card-content speakers-content">
            <h6>Speakers</h6>
            <img className="speakers-svg" src={SpeakerSVG} width={100} />
          </div>
          <div
            className={
              this.state.speakersAreConnected
                ? "io-element io-element--active"
                : "io-element"
            }
            onClick={e => {
              this.connectToSpeakers(e);
            }}
            ref={ref => {
              this.speakersDOMRect = ref as HTMLDivElement;
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ blocks }: StoreState) => {
  return {
    blocks
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateBlock: (block: BlockData) => dispatch(updateBlock(block))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
