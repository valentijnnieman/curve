import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import Toggle from "material-ui/Toggle";

import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

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
  freqInputElement: HTMLSpanElement;
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

  tryToConnectTo = (outputType: string) => {
    let outputToConnectTo, inputElement;
    switch (outputType) {
      case "gain":
        outputToConnectTo = this.props.internal.gain.gain;
        inputElement = this.gainInputElement.getBoundingClientRect();
        break;
      case "freq":
        outputToConnectTo = this.props.internal.oscillator.frequency;
        inputElement = this.freqInputElement.getBoundingClientRect();
        break;
      default:
        outputToConnectTo = this.props.internal.gain.gain;
        inputElement = this.gainInputElement.getBoundingClientRect();
    }
    this.props.tryToConnectTo(
      this.props.node,
      outputToConnectTo,
      outputType,
      inputElement
    );
  };
  onDragHandler = () => {
    // determine if output and/or input is connected
    if (this.props.node.hasInputFrom.length > 0) {
      this.props.node.hasInputFrom.map(input => {
        const inputFromNode = this.props.allNodes[input];
        if (inputFromNode.connectedToType === "gain") {
          const updatedNode: GainDataObject | NodeDataObject = {
            ...inputFromNode,
            connectedToEl: this.gainInputElement.getBoundingClientRect() as DOMRect
          };
          this.props.updateNode(updatedNode);
        } else if (inputFromNode.connectedToType === "freq") {
          const updatedNode: GainDataObject | NodeDataObject = {
            ...inputFromNode,
            connectedToEl: this.freqInputElement.getBoundingClientRect() as DOMRect
          };
          this.props.updateNode(updatedNode);
        }
      });
    }

    if (this.props.node.connected) {
      const updateSelf: NodeDataObject = {
        ...this.props.node,
        connectedFromEl: this.outputElement.getBoundingClientRect() as DOMRect
      };
      this.props.updateNode(updateSelf);
    }
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
  handleTypeChange = (e: any, index: any, value: any) => {
    // set change here so it is instant
    this.props.internal.oscillator.type = value;

    // update node info in store
    const updatedNode: NodeDataObject = {
      ...this.props.node,
      type: value
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
              this.props.node.hasGainInput
                ? "io-element io-element--active"
                : "io-element"
            }
            onClick={() => this.tryToConnectTo("gain")}
          >
            <div style={{ position: "relative" }}>
              <span className="tooltip">Input: gain</span>
            </div>
            <span
              ref={ref => {
                this.gainInputElement = ref as HTMLSpanElement;
              }}
            />
          </div>
          <div
            className={
              this.props.node.hasFreqInput
                ? "io-element io-element--freq io-element--active"
                : "io-element io-element--freq"
            }
            onClick={() => this.tryToConnectTo("freq")}
          >
            <span
              ref={ref => {
                this.freqInputElement = ref as HTMLSpanElement;
              }}
            />
          </div>
          <div className="card-content">
            <Toggle
              onClick={this.toggleOsc}
              className="toggle"
              thumbSwitchedStyle={{ backgroundColor: "#f50057" }}
              trackSwitchedStyle={{ backgroundColor: "#ff9d9d" }}
            />
            <form className="node-controls">
              <TextField
                id="freq"
                floatingLabelText="Frequency"
                defaultValue={this.props.node.freq}
                onChange={this.handleFreqChange}
                className="input"
              />
              <DropDownMenu
                className="input"
                value={this.props.node.type}
                onChange={this.handleTypeChange}
              >
                <MenuItem value="sine" primaryText="Sine" />
                <MenuItem value="square" primaryText="Square" />
                <MenuItem value="triangle" primaryText="Triangle" />
                <MenuItem value="sawtooth" primaryText="Sawtooth" />
              </DropDownMenu>
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
