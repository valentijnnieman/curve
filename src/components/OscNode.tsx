import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import Switch from "material-ui/Switch";
import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

import "./ui/Card.css";
import "./Node.css";
import { Analyser } from "./Analyser";

interface NodeProps {
  node: NodeDataObject;
  allNodes: Array<NodeDataObject | GainDataObject>;
  internal: InternalObject;
  allInternals: Array<InternalObject | InternalGainObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
  audioCtx: AudioContext;
}
class OscNode extends React.Component<NodeProps> {
  analyser: AnalyserNode;

  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: NodeProps) {
    super(props);

    this.props.internal.oscillator.connect(this.props.internal.gain);
  }
  toggleOsc = () => {
    const internal = this.props.internal;
    if (!this.props.node.running) {
      try {
        this.props.internal.oscillator.start();
      } catch (e) {
        window.console.log(e);
      }
      internal.gain.gain.value = 1;
      this.connectInternal();
      this.props.updateNode({
        ...this.props.node,
        running: true
      });
    } else {
      internal.gain.gain.value = 0;
      this.props.internal.gain.disconnect();
      this.props.updateNode({
        ...this.props.node,
        running: false
      });
    }
  };
  connectToAnalyser = () => {
    this.props.internal.gain.connect(this.props.internal.analyser);
  };

  connectInternal = () => {
    const { node, internal } = this.props;
    internal.gain.disconnect();
    this.connectToAnalyser();
    if (node.output !== undefined) {
      internal.gain.connect(node.output as AudioParam);
    }
  };
  tryToConnect = () => {
    this.props.tryToConnect(
      this.props.node,
      this.props.internal,
      this.outputElement.getBoundingClientRect()
    );
  };

  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.node,
      this.props.internal.gain.gain,
      this.gainInputElement.getBoundingClientRect()
    );
  };
  onDragHandler = () => {
    // determine if output and/or input is connected
    if (this.props.node.hasInputFrom.length > 0) {
      this.props.node.hasInputFrom.map(input => {
        const inputFromNode = this.props.allNodes[input];
        const updatedNode: GainDataObject | NodeDataObject = {
          ...inputFromNode,
          connectedToEl: this.gainInputElement.getBoundingClientRect() as DOMRect
        };
        this.props.updateNode(updatedNode);
      });
    }

    const updateSelf: NodeDataObject = {
      ...this.props.node,
      connectedFromEl: this.outputElement.getBoundingClientRect() as DOMRect
    };
    this.props.updateNode(updateSelf);
  };
  handleFreqChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // set change here so it is instant
    this.props.internal.oscillator.frequency.setValueAtTime(e.target.value, 0);

    // update node info in store
    const updatedNode: NodeDataObject = {
      ...this.props.node,
      freq: e.target.value
    };
    this.props.updateNode(updatedNode);
  };
  handleTypeChange = (e: any) => {
    // set change here so it is instant
    this.props.internal.oscillator.type = e.target.value;

    // update node info in store
    const updatedNode: NodeDataObject = {
      ...this.props.node,
      type: e.target.value
    };
    this.props.updateNode(updatedNode);
  };
  componentWillReceiveProps(nextProps: NodeProps) {
    if (this.props.node.output !== nextProps.node.output) {
      this.props = nextProps;
      this.connectInternal();
    } else {
      this.props = nextProps;
    }
  }
  render() {
    return (
      <Draggable onDrag={this.onDragHandler} cancel="input">
        <div className="card">
          <div
            className={
              this.props.node.hasInput
                ? "io-element io-element--active"
                : "io-element"
            }
            onClick={this.tryToConnectTo}
          >
            <span
              ref={ref => {
                this.gainInputElement = ref as HTMLSpanElement;
              }}
            />
          </div>
          <div className="card-content">
            <Switch checked={this.props.node.running} onClick={this.toggleOsc}>
              {this.props.node.running ? "Stop" : "Start"}
            </Switch>
            <form>
              <TextField
                id="freq"
                label="Frequency"
                defaultValue={this.props.node.freq}
                onChange={this.handleFreqChange}
                className="input"
              />
              <TextField
                id="type"
                label="Type"
                defaultValue={this.props.node.type}
                onChange={this.handleTypeChange}
                className="input"
              />
            </form>
            <Analyser
              analyser={this.props.internal.analyser}
              backgroundColor="#53a857"
              lineColor="#f8f8f8"
            />
          </div>
          <div
            className={
              this.props.node.connected
                ? "io-element io-element--right io-element--active"
                : "io-element io-element--right"
            }
            onClick={this.tryToConnect}
            ref={ref => {
              this.outputElement = ref as HTMLSpanElement;
            }}
          />
        </div>
      </Draggable>
    );
  }
}

export default OscNode;
