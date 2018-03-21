import * as React from "react";
import "./Editor.css";
import CurveNode from "../components/Node";
import { Grid, Row } from "react-bootstrap";
import { InternalObject } from "../models/internalObject";
import { NodeDataObject } from "../models/nodeObject";
import { StoreState } from "../models/storeState";

import { connect } from "react-redux";

import { updateNode } from "../actions/node";

const _AUDIOCTX = new AudioContext(); // define audio context
const _INTERNALS: Array<InternalObject> = [];

interface EditorProps {
  nodeData: Array<NodeDataObject>;
  updateNode: (node: NodeDataObject) => void;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface EditorState {
  wantsToConnect: boolean;
  nodeToConnect?: NodeDataObject;
  nodeToConnectTo?: NodeDataObject;
  synthToConnect?: InternalObject;
  outputToConnectTo?: AudioParam;
  lineFrom?: DOMRect;
  lineTo?: DOMRect;
  lines: Array<Line>;
}

class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);
    this.state = {
      wantsToConnect: false,
      lines: []
    };
    this.buildInternals();
  }
  buildInternals = () => {
    // builds internal objects used with web audio api
    this.props.nodeData.map((node, index) => {
      if (node.running) {
        // node is already running - no need to create new internals
      } else {
        let oscillator = _AUDIOCTX.createOscillator();
        oscillator.type = node.type;
        oscillator.frequency.setValueAtTime(node.freq, _AUDIOCTX.currentTime);
        let gain = _AUDIOCTX.createGain();
        gain.gain.value = 1;
        let analyser = _AUDIOCTX.createAnalyser();
        analyser.fftSize = 2048;

        const newInternal = {
          id: index,
          oscillator,
          gain,
          analyser
        };
        _INTERNALS.push(newInternal);
      }
    });
  };
  reConnectInternals = () => {
    // reconnect the internals after nodeData has been updated through redux store
    this.props.nodeData.map((node, index) => {
      if (node.running) {
        const internal = _INTERNALS[index];
        try {
          internal.oscillator.start();
        } catch (e) {
          window.console.log(e);
        }

        internal.oscillator.connect(internal.gain);

        internal.gain.disconnect();
        if (node.output !== undefined) {
          internal.gain.connect(node.output as AudioParam);
        } else {
          internal.gain.connect(_AUDIOCTX.destination);
        }
        internal.gain.connect(internal.analyser);
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
          x1: node.connectedFromEl.x,
          y1: node.connectedFromEl.y,
          x2: node.connectedToEl.x,
          y2: node.connectedToEl.y
        };
        allNewLines.push(newLineCoords);
      }
    });
    this.setState({
      lines: allNewLines
    });
  };
  testConnect = () => {
    const {
      nodeToConnect,
      nodeToConnectTo,
      synthToConnect,
      outputToConnectTo
    } = this.state;
    if (
      nodeToConnect &&
      nodeToConnectTo &&
      synthToConnect &&
      outputToConnectTo
    ) {
      // update node info in store
      const updatedNode: NodeDataObject = {
        ...nodeToConnect,
        output: outputToConnectTo,
        connected: true,
        connectedToEl: this.state.lineTo,
        connectedFromEl: this.state.lineFrom
      };
      this.props.updateNode(updatedNode);

      // update the node we're connecting to
      // specifying it has an input from updatedNode
      const updatedNodeTo: NodeDataObject = {
        ...nodeToConnectTo,
        hasInputFrom: updatedNode.id
      };
      this.props.updateNode(updatedNodeTo);
    }
    // we're done connecting!
    this.setState({
      wantsToConnect: false
    });
  };
  tryToConnect = (node: NodeDataObject, synth: InternalObject, el: DOMRect) => {
    // called from node that wants to connect it's output
    this.setState({
      wantsToConnect: true,
      nodeToConnect: node,
      synthToConnect: synth,
      lineFrom: el
    });
  };
  tryToConnectTo = (node: NodeDataObject, output: AudioParam, el: DOMRect) => {
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
  componentWillReceiveProps(nextProps: EditorProps) {
    this.props = nextProps;
    this.reConnectInternals();
    // draw lines
    this.drawConnectionLine();
  }
  render() {
    const synthElements = this.props.nodeData.map(
      (node: NodeDataObject, index: number) => {
        return (
          <CurveNode
            key={index}
            node={node}
            allNodes={this.props.nodeData}
            internal={_INTERNALS[index]}
            allInternals={_INTERNALS}
            tryToConnect={this.tryToConnect}
            tryToConnectTo={this.tryToConnectTo}
            canConnect={this.state.wantsToConnect}
            updateNode={this.props.updateNode}
          />
        );
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
            stroke="red"
            strokeWidth={4}
            strokeDasharray="4, 4"
          />
        </g>
      );
    });
    return (
      <Grid>
        <svg className="grid-svg">{lineElements}</svg>
        <Row>{synthElements}</Row>
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
    updateNode: (node: NodeDataObject) => dispatch(updateNode(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
