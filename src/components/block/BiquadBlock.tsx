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

import { BiquadBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import { InternalBiquadData } from "../../types/internalData";

export class BiquadBlock extends React.Component<BiquadBlockProps> {
  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLDivElement;
  freqInputElement: HTMLDivElement;
  outputElement: HTMLDivElement;

  constructor(props: BiquadBlockProps) {
    super(props);

    if ((this.props.block.internal as InternalBiquadData).filter) {
      (this.props.block.internal as InternalBiquadData).filter.connect(this
        .props.block.internal.gain as GainNode);
    }
  }

  tryToConnectTo = (outputType: string) => {
    let outputToConnectTo, inputElement;
    switch (outputType) {
      case "gain":
        outputToConnectTo = (this.props.block.internal as InternalBiquadData)
          .filter;
        inputElement = this.gainInputElement.getBoundingClientRect();
        break;
      case "freq":
        outputToConnectTo = (this.props.block.internal as InternalBiquadData)
          .filter.frequency;
        inputElement = this.freqInputElement.getBoundingClientRect();
        break;
      default:
        outputToConnectTo = (this.props.block.internal as InternalBiquadData)
          .filter;
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
      (this.props.block
        .internal as InternalBiquadData).filter.frequency.setValueAtTime(
        e.target.value,
        0
      );

      // update block info in store
      const updatedBlock: BlockData = {
        ...this.props.block,
        values: [newFreq, this.props.block.values[1]]
      };
      this.props.updateBlock(updatedBlock);
    }
  };
  handleTypeChange = (e: any, index: any, value: any) => {
    // set change here so it is instant
    (this.props.block.internal as InternalBiquadData).filter.type = value;

    // update block info in store
    const updatedBlock: BlockData = {
      ...this.props.block,
      type: value
    };
    this.props.updateBlock(updatedBlock);
  };
  handleQChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // set change here so it is instant
    const newQ = Number(e.target.value);
    if (newQ >= 0 && typeof newQ === "number") {
      (this.props.block.internal as InternalBiquadData).filter.Q.setValueAtTime(
        newQ,
        0
      );
      // update block info in store
      const updatedBlock: BlockData = {
        ...this.props.block,
        values: [this.props.block.values[0], newQ]
      };
      this.props.updateBlock(updatedBlock);
    }
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
                defaultValue={this.props.block.values[0]}
                onChange={this.handleFreqChange}
                className="input"
                type="number"
              />
              <TextField
                id="q"
                floatingLabelText="Q"
                defaultValue={this.props.block.values[1]}
                onChange={this.handleQChange}
                className="input"
                type="number"
              />
            </form>
            <DropDownMenu
              className="input"
              value={this.props.block.type}
              onChange={this.handleTypeChange}
            >
              <MenuItem value="lowpass" primaryText="Lowpass" />
              <MenuItem value="highpass" primaryText="Highpass" />
              <MenuItem value="bandpass" primaryText="Bandpass" />
              <MenuItem value="lowshelf" primaryText="Lowshelf" />
              <MenuItem value="highshelf" primaryText="Highshelf" />
              <MenuItem value="peaking" primaryText="Peaking" />
              <MenuItem value="notch" primaryText="Notch" />
              <MenuItem value="allpass" primaryText="Allpass" />
            </DropDownMenu>
            <Analyser
              analyser={this.props.block.internal.analyser as AnalyserNode}
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
