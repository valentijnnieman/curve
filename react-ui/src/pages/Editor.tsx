import * as React from "react";

import "./Editor.css";
import OscBlock from "../components/block/OscBlock";
import GainBlock from "../components/block/GainBlock";
import BiquadBlock from "../components/block/BiquadBlock";
import EnvelopeBlock from "../components/block/EnvelopeBlock";
import DestinationBlock from "../components/block/DestinationBlock";
// import OutputNode from "../components/block/OutputNode";
import {
  InternalOscData,
  InternalData,
  InternalBiquadData
} from "../types/internalData";
import { BlockData, OutputData } from "../types/blockData";
import { Line } from "../types/lineData";
import { StoreState } from "../types/storeState";
import { Dialog, RaisedButton } from "material-ui";

import { connect } from "react-redux";

import { updateBlock, deleteBlock } from "../actions/block";

// helpers
import { drawConnectionLines } from "../lib/helpers/Editor";
import { RouteComponentProps } from "react-router";
import { fetchState } from "../actions/state";
import { LineGrid } from "../components/LineGrid";
import { fetchUser } from "../actions/user";

interface EditorProps extends RouteComponentProps<any> {
  blocks: Array<BlockData>;
  audioCtx: AudioContext;
  updateBlock: (block: BlockData) => void;
  deleteBlock: (id: number) => void;
  fetchState: (name: string) => void;
  fetchUser: () => void;
}

interface EditorState {
  wantsToConnect: boolean;
  blockToConnect?: BlockData;
  blockToConnectTo?: BlockData;
  internalToConnect?: InternalOscData | InternalData | InternalBiquadData;
  outputType?: string;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  mouseX?: number;
  mouseY?: number;
  accessModalOpen: boolean;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  output: InternalData;
  lines: Array<Line> = [];
  speakersDOMRect: HTMLDivElement;
  constructor(props: EditorProps) {
    super(props);

    props.fetchUser();

    if (this.props.match.params) {
      const { name } = this.props.match.params;
      if (name && name !== undefined) {
        this.props.fetchState(name);
      }
    }

    let isRunning = true;
    if (this.props.audioCtx.state !== "running") {
      isRunning = false;
    }

    this.state = {
      wantsToConnect: false,
      accessModalOpen: !isRunning
    };
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
    const blockWithOutput: BlockData = this.props.blocks.find(
      b => b.id === fromBlock
    ) as BlockData;

    const blockWithInput: BlockData = this.props.blocks.find(
      b => b.id === toBlock
    ) as BlockData;

    const internal = blockWithOutput.internal;

    let outputIndex: number = blockWithOutput.outputs.findIndex(
      output => output.id === outputId
    );
    const updatedBlockWithOutput: BlockData = {
      ...blockWithOutput,
      connected: blockWithOutput.outputs.length > 1 ? true : false,
      outputs: blockWithOutput.outputs.filter(
        (output, index) => index !== outputIndex
      )
    };
    this.props.updateBlock(updatedBlockWithOutput);

    let inputIndex: number = blockWithInput.hasInputFrom.findIndex(
      input => input === fromBlock
    );
    const updatedBlockWithInput: BlockData = {
      ...blockWithInput,
      hasInputFrom: blockWithInput.hasInputFrom.filter(
        (input, index) => index !== inputIndex
      )
    };
    this.props.updateBlock(updatedBlockWithInput);

    if (internal) {
      internal.gain.disconnect();
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
  componentWillReceiveProps(nextProps: EditorProps) {
    this.lines = drawConnectionLines(nextProps.blocks);
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

    // disconnect blocks connected to the block we're deleting
    this.props.blocks.map(block => {
      if (block.connected) {
        block.outputs.map(out => {
          if (out.isConnectedTo === blockToDelete.id) {
            this.disconnect(block.id, blockToDelete.id, out.id);
          }
        });
      }
    });
    // update redux store -> delete blockData object
    this.props.deleteBlock(id);
  };

  render() {
    const synthElements = this.props.blocks.map(
      (block: BlockData, index: number) => {
        if (block.internal) {
          if (block.blockType === "OSC") {
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
          } else if (block.blockType === "DESTINATION") {
            return (
              <DestinationBlock
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
    return (
      <div onMouseMove={e => this.onMouseMove(e)}>
        {/* <svg className="grid-svg" onClick={e => this.stopMouseLine(e)}>
          {lineElements}
          {lineToMouse}
        </svg> */}
        <LineGrid
          stopMouseLine={this.stopMouseLine}
          disconnect={this.disconnect}
          lines={this.lines}
          wantsToConnect={this.state.wantsToConnect}
          lineFrom={this.state.lineFrom}
          mouseX={this.state.mouseX}
          mouseY={this.state.mouseY}
        />
        {synthElements}
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
    },
    fetchUser: () => {
      dispatch(fetchUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
