import * as React from "react";

import "./Editor.css";
// import OutputNode from "../components/block/OutputNode";
import {
  InternalOscData,
  InternalData,
  InternalBiquadData
} from "../types/internalData";
import { BlockData, OutputData } from "../types/blockData";
import { Line } from "../types/lineData";
import { StoreState } from "../types/storeState";
import Dialog from "../components/ui/Menu/Dialog";
import RaisedButton from "../components/ui/Buttons/RaisedButton";

import { connect } from "react-redux";

import { updateBlock, deleteBlock } from "../actions/block";
import { startDragging, stopDragging } from "../actions/block";

// helpers
import { drawConnectionLines } from "../lib/helpers/Editor";
import { RouteComponentProps } from "react-router";
import { fetchState } from "../actions/state";
import { LineGrid } from "../components/LineGrid";
import { fetchUser } from "../actions/user";
import { BlockGrid } from "../components/BlockGrid";
import Topbar from "../components/ui/Topbar";

interface EditorProps extends RouteComponentProps<any> {
  blocks: Array<BlockData>;
  audioCtx: AudioContext;
  updateBlock: (block: BlockData) => void;
  deleteBlock: (id: string) => void;
  fetchState: (name: string) => void;
  fetchUser: () => void;
  dragging: boolean;
  startDragging: () => void;
  stopDragging: () => void;
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
  zoomLevel: number;
  scrollX: number;
  scrollY: number;
  mouseDown: boolean;
  ctrlKeyDown: boolean;
  spacebarDown: boolean;
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
      zoomLevel: 10,
      scrollX: 0,
      scrollY: 0,
      accessModalOpen: !isRunning,
      mouseDown: false,
      ctrlKeyDown: false,
      spacebarDown: false
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
  disconnect = (fromBlock: string, toBlock: string, outputId: number) => {
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
        (_, index) => index !== outputIndex
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
      internal.gain.connect(internal.analyser);
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
  deleteAndDisconnect = (id: string) => {
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
  componentWillReceiveProps(nextProps: EditorProps) {
    this.lines = drawConnectionLines(nextProps.blocks);
  }
  componentDidMount() {
    window.addEventListener("wheel", event => {
      const deltaY = Math.sign(event.deltaY);
      const deltaX = Math.sign(event.deltaX);
      if (this.state.ctrlKeyDown || event.ctrlKey) {
        // zoom
        event.preventDefault();
        if (deltaY < 0) {
          this.setState({
            zoomLevel: Math.min(Math.max(this.state.zoomLevel + 1, 1), 30)
          });
        } else {
          this.setState({
            zoomLevel: Math.min(Math.max(this.state.zoomLevel - 1, 1), 30)
          });
        }
      } else {
        // move around grid
        this.setState({
          scrollX: this.state.scrollX + deltaX,
          scrollY: this.state.scrollY + deltaY
        });
      }
    });
    window.addEventListener("mousedown", () => {
      this.setState({ mouseDown: true });
    });
    window.addEventListener("mouseup", () => {
      this.setState({ mouseDown: false });
    });
    window.addEventListener("mousemove", event => {
      if (this.state.spacebarDown && this.state.mouseDown) {
        this.setState({
          scrollX: this.state.scrollX + event.movementX,
          scrollY: this.state.scrollY + event.movementY
        });
      }
    });
    window.addEventListener("keydown", event => {
      if (event.ctrlKey) {
        this.setState({ ctrlKeyDown: true });
      }
      if (event.keyCode === 32) {
        // spacebar
        this.setState({ spacebarDown: true });
      }
    });
    window.addEventListener("keyup", () => {
      this.setState({ ctrlKeyDown: false, spacebarDown: false });
    });
  }
  render() {
    return (
      <div
        className={`editor-container ${
          this.state.spacebarDown ? "editor-container--grab" : ""
        }`}
        onMouseMove={e => this.onMouseMove(e)}
      >
        <Topbar zoom={this.state.zoomLevel * 10} />
        <LineGrid
          stopMouseLine={this.stopMouseLine}
          disconnect={this.disconnect}
          lines={this.lines}
          wantsToConnect={this.state.wantsToConnect}
          lineFrom={this.state.lineFrom}
          mouseX={this.state.mouseX}
          mouseY={this.state.mouseY}
        />
        <div
          className="editor-blockgrid"
          style={{
            transform: `scale(${this.state.zoomLevel / 10})`,
            left: this.state.scrollX,
            top: this.state.scrollY
          }}
          onClick={e => e.preventDefault}
        >
          <BlockGrid
            blocks={this.props.blocks}
            tryToConnect={this.tryToConnect}
            tryToConnectTo={this.tryToConnectTo}
            wantsToConnect={this.state.wantsToConnect}
            updateBlock={this.props.updateBlock}
            deleteAndDisconnect={this.deleteAndDisconnect}
            audioCtx={this.props.audioCtx}
            dragging={this.props.dragging}
            startDragging={this.props.startDragging}
            stopDragging={this.props.stopDragging}
          />
        </div>
        <Dialog
          title="Allow Web Audio access"
          modal={true}
          open={this.state.accessModalOpen}
          onRequestClose={this.handleAccessModalClose}
          autoScrollBodyContent={true}
          className="code-dialog"
        >
          <p style={{ marginBottom: "28px" }}>
            Web Audio needs to be turned on - some browsers prevent autoplaying
            audio.
          </p>
          <RaisedButton label="Turn on Web Audio" onClick={this.toggleCtx} />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ blocks, audioCtx, dragging }: StoreState) => {
  return {
    blocks,
    audioCtx,
    dragging
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateBlock: (block: BlockData) => dispatch(updateBlock(block)),
    deleteBlock: (id: string) => {
      // we need to handle internals here as well as updating the redux store.
      dispatch(deleteBlock(id));
    },
    fetchState: (name: string) => {
      dispatch(fetchState(name));
    },
    fetchUser: () => {
      dispatch(fetchUser());
    },
    startDragging: () => {
      dispatch(startDragging());
    },
    stopDragging: () => {
      dispatch(stopDragging());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
