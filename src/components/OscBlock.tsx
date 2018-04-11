import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import Toggle from "material-ui/Toggle";

import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { OscDataObject } from "../types/nodeObject";

import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

import "./ui/Card.css";
import "./Block.css";
import { Analyser } from "./Analyser";

import { OscBlockProps } from "../types/blockProps";
import { composedBlock } from "../lib/hoc/Block";

export class OscBlock extends React.Component<OscBlockProps> {
  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLDivElement;
  freqInputElement: HTMLDivElement;
  outputElement: HTMLDivElement;

  constructor(props: OscBlockProps) {
    super(props);

    this.props.internal.oscillator.connect(this.props.internal.gain);
  }
  toggleOsc = () => {
    const internal = this.props.internal;
    if (!this.props.node.running) {
      try {
        this.props.internal.oscillator.start();
      } catch (e) {
        // window.console.log(e);
      }
      internal.gain.gain.value = 1;
      this.props.connectInternal();
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

  handleFreqChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // set change here so it is instant
    this.props.internal.oscillator.frequency.setValueAtTime(e.target.value, 0);

    // update node info in store
    const updatedNode: OscDataObject = {
      ...this.props.node,
      freq: e.target.value
    } as OscDataObject;
    this.props.updateNode(updatedNode);
  };
  handleTypeChange = (e: any, index: any, value: any) => {
    // set change here so it is instant
    this.props.internal.oscillator.type = value;

    // update node info in store
    const updatedNode: OscDataObject = {
      ...this.props.node,
      type: value
    } as OscDataObject;
    this.props.updateNode(updatedNode);
  };
  render() {
    return (
      <Draggable
        onDrag={() => {
          this.props.onDragHandler(
            this.gainInputElement.getBoundingClientRect() as DOMRect,
            this.outputElement.getBoundingClientRect() as DOMRect,
            this.freqInputElement.getBoundingClientRect() as DOMRect
          );
        }}
        cancel="input"
      >
        <div className="card">
          <div
            className={
              this.props.node.hasGainInput
                ? "io-element io-element--active"
                : "io-element"
            }
            onClick={() => this.tryToConnectTo("gain")}
            ref={ref => {
              this.gainInputElement = ref as HTMLDivElement;
            }}
          />
          <div
            className={
              this.props.node.hasFreqInput
                ? "io-element io-element--freq io-element--active"
                : "io-element io-element--freq"
            }
            onClick={() => this.tryToConnectTo("freq")}
            ref={ref => {
              this.freqInputElement = ref as HTMLDivElement;
            }}
          />
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
            onClick={() =>
              this.props.tryToConnect(
                this.outputElement.getBoundingClientRect() as DOMRect
              )
            }
            ref={ref => {
              this.outputElement = ref as HTMLDivElement;
            }}
          />
        </div>
      </Draggable>
    );
  }
}

export default composedBlock(OscBlock);
