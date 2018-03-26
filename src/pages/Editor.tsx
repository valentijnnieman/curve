import * as React from "react";
import "./Editor.css";
import OscNode from "../components/OscNode";
import GainNode from "../components/GainNode";
// import OutputNode from "../components/OutputNode";
import { Grid } from "react-bootstrap";
import { InternalObject, InternalGainObject } from "../types/internalObject";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { StoreState } from "../types/storeState";

import { connect } from "react-redux";

import { updateNode } from "../actions/node";

const SpeakerSVG = require("../speakers.svg");

const _AUDIOCTX = new AudioContext(); // define audio context
const _INTERNALS: Array<InternalObject | InternalGainObject> = [];

interface EditorProps {
  nodeData: Array<NodeDataObject | GainDataObject>;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface EditorState {
  wantsToConnect: boolean;
  nodeToConnect?: NodeDataObject | GainDataObject;
  nodeToConnectTo?: NodeDataObject | GainDataObject;
  internalToConnect?: InternalObject | InternalGainObject;
  outputToConnectTo?: AudioParam | AudioDestinationNode;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  lines: Array<Line>;
  speakersAreConnected: boolean;
}

class Editor extends React.Component<EditorProps, EditorState> {
  output: InternalGainObject;
  constructor(props: EditorProps) {
    super(props);
    this.state = {
      wantsToConnect: false,
      lines: [],
      speakersAreConnected: false
    };
    this.buildInternals();
  }
  buildInternals = () => {
    // builds internal objects used with web audio api
    this.props.nodeData.map((node, index) => {
      if (node.hasInternal) {
        // node already has an internal - no need to create new internals
      } else {
        let gain = _AUDIOCTX.createGain();
        gain.gain.value = 1;
        let analyser = _AUDIOCTX.createAnalyser();
        analyser.fftSize = 2048;
        if ("freq" in node) {
          let oscillator;
          oscillator = _AUDIOCTX.createOscillator();
          oscillator.type = node.type;
          oscillator.frequency.setValueAtTime(node.freq, _AUDIOCTX.currentTime);
          const newOscInternal = {
            id: index,
            oscillator,
            gain,
            analyser
          };
          _INTERNALS.push(newOscInternal);
        } else if ("gain" in node) {
          const newGainInternal = {
            id: index,
            gain,
            analyser
          };
          _INTERNALS.push(newGainInternal);
        }
        // update the nodeData object now that we build an internal
        this.props.updateNode({
          ...node,
          hasInternal: true
        });
      }
    });
  };
  drawConnectionLine = () => {
    // draws lines between connected nodes
    let newLineCoords;
    let allNewLines: Array<Line> = [];
    this.props.nodeData.map(node => {
      if (node.connected && node.connectedFromEl && node.connectedToEl) {
        newLineCoords = {
          x1: node.connectedFromEl.x + node.connectedFromEl.width / 2,
          y1: node.connectedFromEl.y + node.connectedFromEl.height / 2,
          x2: node.connectedToEl.x,
          y2: node.connectedToEl.y + 12 // .height not picked up here for some reason
        };
        allNewLines.push(newLineCoords);
      }
    });
    this.setState({
      lines: allNewLines
    });
  };
  testConnect = () => {
    const { nodeToConnect, nodeToConnectTo, outputToConnectTo } = this.state;
    if (nodeToConnect && nodeToConnectTo && outputToConnectTo) {
      // update node info in store
      const updatedNode: NodeDataObject | GainDataObject = {
        ...nodeToConnect,
        output: outputToConnectTo,
        connected: true,
        isConnectedTo: nodeToConnectTo.id,
        connectedToEl: this.state.lineTo,
        connectedFromEl: this.state.lineFrom
      };
      this.props.updateNode(updatedNode);

      // update the node we're connecting to
      // specifying it has an input from updatedNode
      const updatedNodeTo: NodeDataObject | GainDataObject = {
        ...nodeToConnectTo,
        hasInput: true,
        hasInputFrom: [...nodeToConnectTo.hasInputFrom, nodeToConnect.id]
      };
      this.props.updateNode(updatedNodeTo);
    }
    // we're done connecting!
    this.setState({
      wantsToConnect: false,
      nodeToConnect: undefined,
      internalToConnect: undefined,
      lineFrom: undefined,
      lineTo: undefined
    });
  };
  disconnect = (
    node: NodeDataObject | GainDataObject,
    internal: InternalObject
  ) => {
    // update node info in store
    const updatedNode: NodeDataObject | GainDataObject = {
      ...node,
      connected: false,
      isConnectedTo: undefined,
      connectedToEl: undefined,
      connectedFromEl: undefined
    };
    this.props.updateNode(updatedNode);

    // if node is connected to output, there's no node to update (output is not a node)
    if (!node.isConnectedToOutput) {
      // update node that recieves input
      const nodeToUpdate = this.props.nodeData[node.isConnectedTo as number];
      const updatedInputNode: NodeDataObject | GainDataObject = {
        ...nodeToUpdate,
        hasInput: false,
        hasInputFrom: [
          ...nodeToUpdate.hasInputFrom.filter(input => input !== updatedNode.id)
        ]
      };
      this.props.updateNode(updatedInputNode);
    }

    // disconnect internal
    internal.gain.disconnect();
  };
  tryToConnect = (
    node: NodeDataObject | GainDataObject,
    internal: InternalObject,
    el: DOMRect
  ) => {
    // called from node that wants to connect it's output

    // if it's already connected, disconnect it!
    if (node.connected) {
      this.disconnect(node, internal);
    }
    this.setState({
      wantsToConnect: true,
      nodeToConnect: node,
      internalToConnect: internal,
      lineFrom: el
    });
  };
  tryToConnectTo = (
    node: NodeDataObject | GainDataObject,
    output: AudioParam,
    el: DOMRect
  ) => {
    // called form node that wants to be connected to (only gain for now)
    this.setState(
      {
        nodeToConnectTo: node,
        outputToConnectTo: output,
        lineTo: el
      },
      () => {
        // when done setting state
        this.testConnect();
      }
    );
  };
  connectToSpeakers = (e: any) => {
    const { nodeToConnect } = this.state;
    this.setState({
      lineTo: e.target.getBoundingClientRect(),
      outputToConnectTo: _AUDIOCTX.destination,
      speakersAreConnected: true
    });
    const updatedNode: NodeDataObject | GainDataObject = {
      ...(nodeToConnect as NodeDataObject | GainDataObject),
      output: _AUDIOCTX.destination,
      connected: true,
      isConnectedToOutput: true,
      connectedToEl: e.target.getBoundingClientRect(),
      connectedFromEl: this.state.lineFrom
    };
    this.props.updateNode(updatedNode);
  };
  componentWillReceiveProps(nextProps: EditorProps) {
    this.props = nextProps;
    this.buildInternals();
    this.drawConnectionLine();
  }
  render() {
    const synthElements = this.props.nodeData.map(
      (node: NodeDataObject | GainDataObject, index: number) => {
        if ("freq" in node) {
          return (
            <OscNode
              key={index}
              node={node}
              allNodes={this.props.nodeData}
              internal={_INTERNALS[index] as InternalObject}
              allInternals={_INTERNALS}
              tryToConnect={this.tryToConnect}
              tryToConnectTo={this.tryToConnectTo}
              canConnect={this.state.wantsToConnect}
              updateNode={this.props.updateNode}
              audioCtx={_AUDIOCTX}
            />
          );
        } else {
          return (
            <GainNode
              key={index}
              node={node}
              allNodes={this.props.nodeData}
              internal={_INTERNALS[index] as InternalGainObject}
              allInternals={_INTERNALS}
              tryToConnect={this.tryToConnect}
              tryToConnectTo={this.tryToConnectTo}
              canConnect={this.state.wantsToConnect}
              updateNode={this.props.updateNode}
              audioCtx={_AUDIOCTX}
            />
          );
        }
      }
    );
    const lineElements = this.state.lines.map((line, index) => {
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
          />
        </g>
      );
    });
    return (
      <Grid>
        <svg className="grid-svg">{lineElements}</svg>
        {synthElements}
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
          />
        </div>
      </Grid>
    );
  }
}

const mapStateToProps = ({ nodeData }: StoreState) => {
  return {
    nodeData
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateNode: (node: NodeDataObject | GainDataObject) =>
      dispatch(updateNode(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
