import * as React from "react";

import "./Editor.css";
import OscNode from "../components/OscNode";
import GainNode from "../components/GainNode";
// import OutputNode from "../components/OutputNode";
import { InternalObject, InternalGainObject } from "../types/internalObject";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { Line } from "../types/lineObject";
import { StoreState } from "../types/storeState";

import { connect } from "react-redux";

import { updateNode } from "../actions/node";

// helpers
import { buildInternals } from "../lib/helpers/Editor";
import { drawConnectionLines } from "../lib/helpers/Editor";

const SpeakerSVG = require("../speakers.svg");

interface EditorProps {
  nodeData: Array<NodeDataObject | GainDataObject>;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
}

interface EditorState {
  wantsToConnect: boolean;
  nodeToConnect?: NodeDataObject | GainDataObject;
  nodeToConnectTo?: NodeDataObject | GainDataObject;
  internalToConnect?: InternalObject | InternalGainObject;
  outputToConnectTo?: AudioParam | AudioDestinationNode;
  outputType?: string;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  speakersAreConnected: boolean;
  mouseX?: number;
  mouseY?: number;
}

class Editor extends React.Component<EditorProps, EditorState> {
  output: InternalGainObject;
  _AUDIOCTX: AudioContext;
  _INTERNALS: Array<InternalObject | InternalGainObject> = [];
  lines: Array<Line> = [];
  constructor(props: EditorProps) {
    super(props);
    this._AUDIOCTX = new AudioContext(); // define audio context

    this.state = {
      wantsToConnect: false,
      speakersAreConnected: false
    };
    // Build internal objects from nodeData used with web audio
    this._INTERNALS = buildInternals(
      this.props.nodeData,
      this._AUDIOCTX,
      this.props.updateNode,
      this._INTERNALS
    );
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
    // checks if connection can be made & updates nodeData info
    const {
      nodeToConnect,
      nodeToConnectTo,
      outputToConnectTo,
      outputType
    } = this.state;
    if (nodeToConnect && nodeToConnectTo && outputToConnectTo) {
      // update node info in store
      const updatedNode: NodeDataObject | GainDataObject = {
        ...nodeToConnect,
        output: outputToConnectTo,
        connected: true,
        connectedToType: outputType,
        isConnectedTo: nodeToConnectTo.id,
        connectedToEl: this.state.lineTo,
        connectedFromEl: this.state.lineFrom
      };
      this.props.updateNode(updatedNode);

      // update the node we're connecting to
      // specifying it has an input from updatedNode
      const updatedNodeTo: NodeDataObject | GainDataObject = {
        ...nodeToConnectTo,
        hasGainInput: this.checkGain(outputType as string),
        hasFreqInput: this.checkFreq(outputType as string),
        hasInputFrom: [...nodeToConnectTo.hasInputFrom, nodeToConnect.id]
      };
      this.props.updateNode(updatedNodeTo);
    }
    // we're done connecting!
    this.setState({
      wantsToConnect: false,
      nodeToConnect: undefined,
      nodeToConnectTo: undefined,
      internalToConnect: undefined,
      outputToConnectTo: undefined,
      lineFrom: undefined,
      lineTo: undefined
    });
  };
  disconnect = (
    node: NodeDataObject | GainDataObject,
    internal: InternalObject | InternalGainObject
  ) => {
    // update node info in store
    const updatedNode: NodeDataObject | GainDataObject = {
      ...node,
      connected: false,
      isConnectedTo: undefined,
      connectedToType: undefined,
      connectedToEl: undefined,
      connectedFromEl: undefined,
      isConnectedToOutput: false,
      output: undefined
    };
    this.props.updateNode(updatedNode);

    // if node is connected to output, there's no node to update (output is not a node)
    if (!node.isConnectedToOutput) {
      // update node that recieves input
      const nodeToUpdate = this.props.nodeData[node.isConnectedTo as number];
      if (node.connectedToType === "gain") {
        const updatedInputNode: NodeDataObject | GainDataObject = {
          ...nodeToUpdate,
          hasGainInput: false,
          hasInputFrom: [
            ...nodeToUpdate.hasInputFrom.filter(
              input => input !== updatedNode.id
            )
          ]
        };
        this.props.updateNode(updatedInputNode);
      } else if (node.connectedToType === "freq") {
        const updatedInputNode: NodeDataObject | GainDataObject = {
          ...nodeToUpdate,
          hasFreqInput: false,
          hasInputFrom: [
            ...nodeToUpdate.hasInputFrom.filter(
              input => input !== updatedNode.id
            )
          ]
        };
        this.props.updateNode(updatedInputNode);
      }
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
    outputType: string,
    el: DOMRect
  ) => {
    // called form node that wants to be connected to
    this.setState(
      {
        nodeToConnectTo: node,
        outputToConnectTo: output,
        outputType: outputType,
        lineTo: el
      },
      () => {
        // when done setting state
        if (
          (this.state.nodeToConnect as NodeDataObject | GainDataObject).id ===
          (this.state.nodeToConnectTo as NodeDataObject | GainDataObject).id
        ) {
          // let's not connect output to input!
          this.setState({
            wantsToConnect: false,
            nodeToConnect: undefined,
            nodeToConnectTo: undefined,
            internalToConnect: undefined,
            outputToConnectTo: undefined,
            lineFrom: undefined,
            lineTo: undefined
          });
        } else {
          this.testConnect();
        }
      }
    );
  };
  connectToSpeakers = (e: any) => {
    const { nodeToConnect } = this.state;
    this.setState({
      lineTo: e.target.getBoundingClientRect(),
      outputToConnectTo: this._AUDIOCTX.destination,
      speakersAreConnected: true
    });
    const updatedNode: NodeDataObject | GainDataObject = {
      ...(nodeToConnect as NodeDataObject | GainDataObject),
      output: this._AUDIOCTX.destination,
      connected: true,
      isConnectedToOutput: true,
      connectedToEl: e.target.getBoundingClientRect(),
      connectedFromEl: this.state.lineFrom
    };
    this.props.updateNode(updatedNode);
    this.testConnect();
  };
  componentWillReceiveProps(nextProps: EditorProps) {
    this.props = nextProps;
    // rebuild internals
    this._INTERNALS = buildInternals(
      this.props.nodeData,
      this._AUDIOCTX,
      this.props.updateNode,
      this._INTERNALS
    );
    this.lines = drawConnectionLines(this.props.nodeData);
  }
  onMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    this.setState({
      mouseX: e.screenX,
      mouseY: e.pageY
    });
  };

  render() {
    const synthElements = this.props.nodeData.map(
      (node: NodeDataObject | GainDataObject, index: number) => {
        if ("freq" in node) {
          return (
            <OscNode
              key={index}
              node={node}
              allNodes={this.props.nodeData}
              internal={this._INTERNALS[index] as InternalObject}
              allInternals={this._INTERNALS}
              tryToConnect={this.tryToConnect}
              tryToConnectTo={this.tryToConnectTo}
              canConnect={this.state.wantsToConnect}
              updateNode={this.props.updateNode}
              audioCtx={this._AUDIOCTX}
            />
          );
        } else {
          return (
            <GainNode
              key={index}
              node={node}
              allNodes={this.props.nodeData}
              internal={this._INTERNALS[index] as InternalGainObject}
              allInternals={this._INTERNALS}
              tryToConnect={this.tryToConnect}
              tryToConnectTo={this.tryToConnectTo}
              canConnect={this.state.wantsToConnect}
              updateNode={this.props.updateNode}
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
          stroke="#f50057"
          strokeWidth={4}
          strokeDasharray="4, 4"
        />
      );
    }
    return (
      <div>
        <svg className="grid-svg" onMouseMove={e => this.onMouseMove(e)}>
          {lineElements}
          {lineToMouse}
        </svg>
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
      </div>
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
