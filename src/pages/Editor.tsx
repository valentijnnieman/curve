import * as React from "react";

import "./Editor.css";
import OscBlock from "../components/block/OscBlock";
import GainBlock from "../components/block/GainBlock";
import { Code } from "../components/ui/Code";
// import OutputNode from "../components/block/OutputNode";
import { InternalOscData, InternalGainData } from "../types/internalData";
import { OscData, GainData, OutputData } from "../types/blockData";
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
  blocks: Array<OscData | GainData>;
  updateBlock: (node: OscData | GainData) => void;
}

interface EditorState {
  wantsToConnect: boolean;
  blockToConnect?: OscData | GainData;
  blockToConnectTo?: OscData | GainData;
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
  checkGain = (outputType: string) => {
    if (outputType === "gain") {
      return true;
    }
    return false;
  };
  checkFreq = (outputType: string) => {
    if (outputType === "freq") {
      return true;
    }
    return false;
  };
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
      const updatedNode: OscData | GainData = {
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
      this.props.updateBlock(updatedNode);

      // update the node we're connecting to
      // specifying it has an input from updatedNode
      const updatedNodeTo: OscData | GainData = {
        ...blockToConnectTo,
        hasGainInput: blockToConnectTo.hasGainInput
          ? true
          : this.checkGain(outputType as string),
        hasFreqInput: blockToConnectTo.hasGainInput
          ? true
          : this.checkFreq(outputType as string),
        hasInputFrom: [...blockToConnectTo.hasInputFrom, blockToConnect.id]
      };
      this.props.updateBlock(updatedNodeTo);
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
    const updatedBlockWithOutput: OscData | GainData = {
      ...blockWithOutput,
      connected: blockWithOutput.outputs.length > 1 ? true : false,
      isConnectedToOutput: false,
      outputs: blockWithOutput.outputs.filter(output => output.id !== outputId)
    };
    this.props.updateBlock(updatedBlockWithOutput);

    const indexOfInput = blockWithInput.hasInputFrom.indexOf(fromBlock);

    blockWithInput.hasInputFrom.splice(indexOfInput, 1);
    const updatedBlockWithInput: OscData | GainData = {
      ...blockWithInput
    };
    this.props.updateBlock(updatedBlockWithInput);

    internal.gain.disconnect();
  };
  tryToConnect = (
    node: OscData | GainData,
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
    node: OscData | GainData,
    output: AudioParam,
    outputType: string,
    el: DOMRect
  ) => {
    // called form node that wants to be connected to
    if (this.state.wantsToConnect) {
      this.setState(
        {
          blockToConnectTo: node,
          outputToConnectTo: output,
          outputType: outputType,
          lineTo: el
        },
        () => {
          // when done setting state
          if (
            (this.state.blockToConnect as OscData | GainData).id ===
            (this.state.blockToConnectTo as OscData | GainData).id
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
      const updatedNode: OscData | GainData = {
        ...(blockToConnect as OscData | GainData),
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
      (node: OscData | GainData, index: number) => {
        if ("freq" in node) {
          return (
            <OscBlock
              key={index}
              node={node}
              allNodes={this.props.blocks}
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
              node={node}
              allNodes={this.props.blocks}
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
    updateBlock: (node: OscData | GainData) => dispatch(updateBlock(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
