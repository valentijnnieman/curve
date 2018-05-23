import * as React from "react";

import "./Editor.css";
import OscBlock from "../components/block/OscBlock";
import GainBlock from "../components/block/GainBlock";
import BiquadBlock from "../components/block/BiquadBlock";
import EnvelopeBlock from "../components/block/EnvelopeBlock";
import { Code } from "../components/ui/Code";
// import OutputNode from "../components/block/OutputNode";
import {
  InternalOscData,
  InternalData,
  InternalBiquadData
} from "../types/internalData";
import { BlockData, OutputData } from "../types/blockData";
import { Line } from "../types/lineData";
import { StoreState } from "../types/storeState";

import { connect } from "react-redux";

import { updateBlock, deleteBlock } from "../actions/block";

// helpers
import { drawConnectionLines, genWACode } from "../lib/helpers/Editor";
import { IconButton, Dialog, RaisedButton } from "material-ui";
import { RouteComponentProps } from "react-router";
import { fetchState } from "../actions/state";

const SpeakerSVG = require("../speakers.svg");

interface EditorProps extends RouteComponentProps<any> {
  blocks: Array<BlockData>;
  audioCtx: AudioContext;
  updateBlock: (block: BlockData) => void;
  deleteBlock: (id: number) => void;
  fetchState: (name: string) => void;
}

interface EditorState {
  wantsToConnect: boolean;
  blockToConnect?: BlockData;
  blockToConnectTo?: BlockData;
  internalToConnect?: InternalOscData | InternalData | InternalBiquadData;
  outputType?: string;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  speakersAreConnected: boolean;
  mouseX?: number;
  mouseY?: number;
  accessModalOpen: boolean;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  output: InternalData;
  code: string;
  lines: Array<Line> = [];
  speakersDOMRect: HTMLDivElement;
  constructor(props: EditorProps) {
    super(props);

    const { name } = this.props.match.params;
    if (name && name !== undefined) {
      window.console.log("Let's load: ", name);
      this.props.fetchState(name);
    }

    let isRunning = false;
    if (this.props.audioCtx.state !== "running") {
      isRunning = true;
    }

    this.state = {
      wantsToConnect: false,
      speakersAreConnected: false,
      accessModalOpen: isRunning
    };
    // Build internal objects from blocks used with web audio
    this.code = genWACode(this.props.blocks);
  }
  testConnect = () => {
    // checks if connection can be made & updates blocks info
    const { blockToConnect, blockToConnectTo, outputType } = this.state;
    if (blockToConnect && blockToConnectTo) {
      // update node info in store
      const updatedBlock: BlockData = {
        ...blockToConnect,
        connected: true,
        outputs: [
          ...blockToConnect.outputs,
          {
            id: blockToConnect.outputs.length, // TO-DO: find a better solution
            connectedToType: outputType,
            isConnectedTo: blockToConnectTo.id
          } as OutputData
        ]
      };
      this.props.updateBlock(updatedBlock);

      // update the block we're connecting to
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
      lineFrom: undefined,
      lineTo: undefined
    });
  };
  disconnect = (fromBlock: number, toBlock: number, outputId: number) => {
    // update block info in store
    const blockWithOutput = this.props.blocks.find(
      b => b.id === fromBlock
    ) as BlockData;
    const blockWithInput = this.props.blocks.find(
      b => b.id === toBlock
    ) as BlockData;
    const internal = blockWithOutput.internal;
    const updatedBlockWithOutput: BlockData = {
      ...blockWithOutput,
      connected: blockWithOutput.outputs.length > 1 ? true : false,
      isConnectedToOutput: false,
      outputs: blockWithOutput.outputs.filter(output => output.id !== outputId)
    };
    this.props.updateBlock(updatedBlockWithOutput);

    if (!blockWithOutput.isConnectedToOutput) {
      const indexOfInput = blockWithInput.hasInputFrom.indexOf(fromBlock);

      blockWithInput.hasInputFrom.splice(indexOfInput, 1);
      const updatedBlockWithInput: BlockData = {
        ...blockWithInput
      };
      this.props.updateBlock(updatedBlockWithInput);

      if (internal) {
        internal.gain.disconnect();
      }
    } else {
      this.setState({
        speakersAreConnected: false
      });
    }
  };
  tryToConnect = (block: BlockData, internal: InternalData, el: DOMRect) => {
    // called from block that wants to connect it's output
    this.setState({
      wantsToConnect: true,
      blockToConnect: block,
      internalToConnect: internal,
      lineFrom: el,
      mouseX: el.x,
      mouseY: el.y
    });
  };
  tryToConnectTo = (block: BlockData, outputType: string, el: DOMRect) => {
    // called from block that wants to be connected to (ie block which input is clicked)
    if (this.state.wantsToConnect) {
      this.setState(
        {
          blockToConnectTo: block,
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
            connectedToType: "GAIN",
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
    window.console.log("NEW PROPS", this.props);
    this.lines = drawConnectionLines(
      this.props.blocks,
      this.speakersDOMRect.getBoundingClientRect() as DOMRect
    );
    this.code = genWACode(this.props.blocks);
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
  toggleCtx = () => {
    this.props.audioCtx.resume();
    this.setState({ accessModalOpen: false });
  };
  handleAccessModalClose = () => {
    this.setState({ accessModalOpen: false });
  };
  deleteAndDisconnect = (id: number) => {
    // stop internal WA objects from making sound
    const blockToDelete = this.props.blocks.find(b => b.id === id) as BlockData;
    if ("oscillator" in blockToDelete.internal) {
      if (blockToDelete.running) {
        blockToDelete.internal.oscillator.stop();
      }
    }
    if ("gain" in blockToDelete.internal) {
      blockToDelete.internal.gain.gain.value = 0;
    }
    // update redux store -> delete blockData object
    this.props.deleteBlock(id);
  };

  render() {
    window.console.log("rendering!", this.props.blocks);
    const synthElements = this.props.blocks.map(
      (block: BlockData, index: number) => {
        if (block.internal) {
          if (block.blockType === "OSC") {
            window.console.log("creaing osckblock: ", block);
            return (
              <OscBlock
                key={index}
                block={block}
                allBlocks={this.props.blocks}
                tryToConnect={this.tryToConnect}
                tryToConnectTo={this.tryToConnectTo}
                canConnect={this.state.wantsToConnect}
                updateBlock={this.props.updateBlock}
                deleteBlock={this.deleteAndDisconnect}
                audioCtx={this.props.audioCtx}
              />
            );
          } else if (block.blockType === "GAIN") {
            return (
              <GainBlock
                key={index}
                block={block}
                allBlocks={this.props.blocks}
                tryToConnect={this.tryToConnect}
                tryToConnectTo={this.tryToConnectTo}
                canConnect={this.state.wantsToConnect}
                updateBlock={this.props.updateBlock}
                deleteBlock={this.deleteAndDisconnect}
                audioCtx={this.props.audioCtx}
              />
            );
          } else if (block.blockType === "BIQUAD") {
            return (
              <BiquadBlock
                key={index}
                block={block}
                allBlocks={this.props.blocks}
                tryToConnect={this.tryToConnect}
                tryToConnectTo={this.tryToConnectTo}
                canConnect={this.state.wantsToConnect}
                updateBlock={this.props.updateBlock}
                deleteBlock={this.deleteAndDisconnect}
                audioCtx={this.props.audioCtx}
              />
            );
          } else if (block.blockType === "ENVELOPE") {
            return (
              <EnvelopeBlock
                key={index}
                block={block}
                allBlocks={this.props.blocks}
                tryToConnect={this.tryToConnect}
                tryToConnectTo={this.tryToConnectTo}
                canConnect={this.state.wantsToConnect}
                updateBlock={this.props.updateBlock}
                deleteBlock={this.deleteAndDisconnect}
                audioCtx={this.props.audioCtx}
              />
            );
          } else {
            return null;
          }
        } else {
          return null;
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
        <Dialog
          title="Allow Web Audio access"
          modal={true}
          open={this.state.accessModalOpen}
          onRequestClose={this.handleAccessModalClose}
          autoScrollBodyContent={true}
          className="code-dialog"
        >
          <p>
            Web Audio needs to be turned on - some browsers prevent autoplaying
            audio.
          </p>
          <RaisedButton label="Turn on Web Audio" onClick={this.toggleCtx} />
        </Dialog>
        <div className="card speakers">
          <div className="card-content speakers-content">
            <h6>Speakers</h6>
            <img className="speakers-svg" src={SpeakerSVG} width={100} />
          </div>
          <IconButton
            tooltip="Speakers input"
            tooltipPosition="bottom-left"
            className="io-button"
            tooltipStyles={{ marginTop: "-40px" }}
          >
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
          </IconButton>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ blocks, audioCtx }: StoreState) => {
  return {
    blocks,
    audioCtx
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateBlock: (block: BlockData) => dispatch(updateBlock(block)),
    deleteBlock: (id: number) => {
      // we need to handle internals here as well as updating the redux store.
      dispatch(deleteBlock(id));
    },
    fetchState: (name: string) => {
      dispatch(fetchState(name));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
