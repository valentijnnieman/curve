import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";

import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { BlockData } from "../../types/blockData";

import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { OscBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";

export class BiquadBlock extends React.Component<OscBlockProps> {
  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLDivElement;
  freqInputElement: HTMLDivElement;
  outputElement: HTMLDivElement;

  constructor(props: OscBlockProps) {
    super(props);

    this.props.internal.oscillator.connect(this.props.internal.gain);
  }

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
      this.props.block,
      outputToConnectTo,
      outputType,
      inputElement
    );
  };

  handleFreqChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // set change here so it is instant
    const newFreq = Number(e.target.value);
    if (newFreq >= 0 && typeof newFreq === "number") {
      this.props.internal.oscillator.frequency.setValueAtTime(
        e.target.value,
        0
      );

      // update block info in store
      const updatedBlock: BlockData = {
        ...this.props.block,
        value: e.target.value
      };
      this.props.updateBlock(updatedBlock);
    }
  };
  handleTypeChange = (e: any, index: any, value: any) => {
    // set change here so it is instant
    this.props.internal.oscillator.type = value;

    // update block info in store
    const updatedBlock: BlockData = {
      ...this.props.block,
      type: value
    };
    this.props.updateBlock(updatedBlock);
  };
  componentDidMount() {
    // when component has mounted and refs are set, we update the store
    const updatedBlock: BlockData = {
      ...this.props.block,
      gainInputDOMRect: this.gainInputElement.getBoundingClientRect() as DOMRect,
      freqInputDOMRect: this.freqInputElement.getBoundingClientRect() as DOMRect,
      outputDOMRect: this.outputElement.getBoundingClientRect() as DOMRect
    };
    this.props.updateBlock(updatedBlock);
  }

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
            className={this.props.checkInputs("gain")}
            onClick={() => this.tryToConnectTo("gain")}
            ref={ref => {
              this.gainInputElement = ref as HTMLDivElement;
            }}
          />
          <div
            className={this.props.checkInputs("freq") + " io-element--freq"}
            onClick={() => this.tryToConnectTo("freq")}
            ref={ref => {
              this.freqInputElement = ref as HTMLDivElement;
            }}
          />
          <div className="card-content">
            <form onSubmit={e => e.preventDefault()} className="block-controls">
              <TextField
                id="freq"
                floatingLabelText="Frequency"
                defaultValue={this.props.block.value}
                onChange={this.handleFreqChange}
                className="input"
                type="number"
              />
              <DropDownMenu
                className="input"
                value={this.props.block.type}
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
              this.props.block.connected
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

export default composedBlock(BiquadBlock);
