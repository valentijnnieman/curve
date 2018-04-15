import * as React from "react";

import "./Editor.css";
import OscBlock from "../components/block/OscBlock";
import GainBlock from "../components/block/GainBlock";
import { Code } from "../components/ui/Code";
// import OutputNode from "../components/block/OutputNode";
import { InternalOscObject, InternalGainObject } from "../types/internalObject";
import {
  OscDataObject,
  GainDataObject,
  OutputObject
} from "../types/nodeObject";
import { Line } from "../types/lineObject";
import { StoreState } from "../types/storeState";

import { connect } from "react-redux";

import { updateNode } from "../actions/node";

// helpers
import {
  buildInternals,
  drawConnectionLines,
  genWACode
} from "../lib/helpers/Editor";

const SpeakerSVG = require("../speakers.svg");

interface EditorProps {
  nodeData: Array<OscDataObject | GainDataObject>;
  updateNode: (node: OscDataObject | GainDataObject) => void;
}

interface EditorState {
  wantsToConnect: boolean;
  nodeToConnect?: OscDataObject | GainDataObject;
  nodeToConnectTo?: OscDataObject | GainDataObject;
  internalToConnect?: InternalOscObject | InternalGainObject;
  outputToConnectTo?: AudioParam | AudioDestinationNode;
  outputType?: string;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  speakersAreConnected: boolean;
  mouseX?: number;
  mouseY?: number;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  output: InternalGainObject;
  code: string;
  _AUDIOCTX: AudioContext;
  _INTERNALS: Array<InternalOscObject | InternalGainObject> = [];
  lines: Array<Line> = [];
  speakersDOMRect: HTMLDivElement;
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
    this.code = genWACode(this.props.nodeData, this._INTERNALS);
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
      const updatedNode: OscDataObject | GainDataObject = {
        ...nodeToConnect,
        connected: true,
        outputs: [
          ...nodeToConnect.outputs,
          {
            id: nodeToConnect.outputs.length, // TO-DO: find a better solution
            destination: outputToConnectTo,
            connectedToType: outputType,
            isConnectedTo: nodeToConnectTo.id
          } as OutputObject
        ]
      };
      this.props.updateNode(updatedNode);

      // update the node we're connecting to
      // specifying it has an input from updatedNode
      const updatedNodeTo: OscDataObject | GainDataObject = {
        ...nodeToConnectTo,
        hasGainInput: nodeToConnectTo.hasGainInput
          ? true
          : this.checkGain(outputType as string),
        hasFreqInput: nodeToConnectTo.hasGainInput
          ? true
          : this.checkFreq(outputType as string),
        hasInputFrom: [...nodeToConnectTo.hasInputFrom, nodeToConnect.id]
      };
      this.props.updateNode(updatedNodeTo);
    }
    // we're done connecting!
    this.stopTryingToConnect();
  };
  stopTryingToConnect = () => {
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
  disconnect = (fromBlock: number, toBlock: number, outputId: number) => {
    // update node info in store
    const blockWithOutput = this.props.nodeData[fromBlock];
    const blockWithInput = this.props.nodeData[toBlock];
    const internal = this._INTERNALS[fromBlock];
    const updatedBlockWithOutput: OscDataObject | GainDataObject = {
      ...blockWithOutput,
      connected: blockWithOutput.outputs.length > 1 ? true : false,
      isConnectedToOutput: false,
      outputs: blockWithOutput.outputs.filter(output => output.id !== outputId)
    };
    this.props.updateNode(updatedBlockWithOutput);

    const indexOfInput = blockWithInput.hasInputFrom.indexOf(fromBlock);

    blockWithInput.hasInputFrom.splice(indexOfInput, 1);
    const updatedBlockWithInput: OscDataObject | GainDataObject = {
      ...blockWithInput
    };
    this.props.updateNode(updatedBlockWithInput);

    internal.gain.disconnect();
  };
  tryToConnect = (
    node: OscDataObject | GainDataObject,
    internal: InternalOscObject | InternalGainObject,
    el: DOMRect
  ) => {
    // called from node that wants to connect it's output

    // if it's already connected, disconnect it!
    // if (node.connected) {
    //   this.disconnect(node, internal);
    // }
    this.setState({
      wantsToConnect: true,
      nodeToConnect: node,
      internalToConnect: internal,
      lineFrom: el,
      mouseX: el.x,
      mouseY: el.y
    });
  };
  tryToConnectTo = (
    node: OscDataObject | GainDataObject,
    output: AudioParam,
    outputType: string,
    el: DOMRect
  ) => {
    // called form node that wants to be connected to
    if (this.state.wantsToConnect) {
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
            (this.state.nodeToConnect as OscDataObject | GainDataObject).id ===
            (this.state.nodeToConnectTo as OscDataObject | GainDataObject).id
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
    const { nodeToConnect } = this.state;
    if (nodeToConnect) {
      this.setState({
        lineTo: e.target.getBoundingClientRect(),
        outputToConnectTo: this._AUDIOCTX.destination,
        speakersAreConnected: true
      });
      const updatedNode: OscDataObject | GainDataObject = {
        ...(nodeToConnect as OscDataObject | GainDataObject),
        connected: true,
        isConnectedToOutput: true,
        outputs: [
          ...nodeToConnect.outputs,
          {
            id: nodeToConnect.outputs.length, // TO-DO: maybe find a better solution
            destination: this._AUDIOCTX.destination,
            connectedToType: "gain",
            isConnectedTo: -1 // speakers are -1
          } as OutputObject
        ]
      };
      this.props.updateNode(updatedNode);
      this.testConnect();
    }
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
    this.lines = drawConnectionLines(
      this.props.nodeData,
      this.speakersDOMRect.getBoundingClientRect() as DOMRect
    );
    this.code = genWACode(this.props.nodeData, this._INTERNALS);
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
    const synthElements = this.props.nodeData.map(
      (node: OscDataObject | GainDataObject, index: number) => {
        if ("freq" in node) {
          return (
            <OscBlock
              key={index}
              node={node}
              allNodes={this.props.nodeData}
              internal={this._INTERNALS[index] as InternalOscObject}
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
            <GainBlock
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

const mapStateToProps = ({ nodeData }: StoreState) => {
  return {
    nodeData
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateNode: (node: OscDataObject | GainDataObject) =>
      dispatch(updateNode(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
