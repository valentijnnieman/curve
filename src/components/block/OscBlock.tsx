import * as React from "react";
import Toggle from "material-ui/Toggle";

import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { BlockData } from "../../types/blockData";

import { InternalOscData } from "../../types/internalData";

import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { OscBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import { IconButton } from "material-ui";

export class OscBlock extends React.Component<OscBlockProps> {
  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLDivElement;
  freqInputElement: HTMLDivElement;
  outputElement: HTMLDivElement;

  constructor(props: OscBlockProps) {
    super(props);

    (this.props.block.internal as InternalOscData).oscillator.connect(this.props
      .block.internal.gain as GainNode);
  }
  toggleOsc = () => {
    const internal = this.props.block.internal;
    if (!this.props.block.running) {
      try {
        (internal as InternalOscData).oscillator.start();
      } catch (e) {
        // window.console.log(e);
      }
      internal.gain.gain.value = 1;
      this.props.connectInternal();
      this.props.updateBlock({
        ...this.props.block,
        running: true
      });
    } else {
      internal.gain.gain.value = 0;
      internal.gain.disconnect();
      this.props.updateBlock({
        ...this.props.block,
        internal: internal,
        running: false
      });
    }
  };

  tryToConnectTo = (outputType: string) => {
    const internal = this.props.block.internal as InternalOscData;
    let outputToConnectTo, inputElement;
    switch (outputType) {
      case "gain":
        outputToConnectTo = internal.gain.gain;
        inputElement = this.gainInputElement.getBoundingClientRect();
        break;
      case "freq":
        outputToConnectTo = internal.oscillator.frequency;
        inputElement = this.freqInputElement.getBoundingClientRect();
        break;
      default:
        outputToConnectTo = internal.gain.gain;
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
        .internal as InternalOscData).oscillator.frequency.setValueAtTime(
        newFreq,
        0
      );

      // update block info in store
      const updatedBlock: BlockData = {
        ...this.props.block,
        values: [newFreq]
      };
      this.props.updateBlock(updatedBlock);
    }
  };
  handleTypeChange = (value: any) => {
    // set change here so it is instant
    try {
      (this.props.block.internal as InternalOscData).oscillator.type = value;

      // update block info in store
      const updatedBlock: BlockData = {
        ...this.props.block,
        type: value
      } as BlockData;
      this.props.updateBlock(updatedBlock);
    } catch (e) {
      throw () => {
        return e;
      };
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
          <IconButton
            tooltipPosition="bottom-left"
            tooltip="Modulate gain input"
            className="io-button"
            tooltipStyles={{ marginTop: "-40px" }}
          >
            <div
              className={this.props.checkInputs("gain")}
              onClick={() => this.tryToConnectTo("gain")}
              ref={ref => {
                this.gainInputElement = ref as HTMLDivElement;
              }}
            />
          </IconButton>
          <IconButton
            tooltip="Modulate frequency input"
            tooltipPosition="bottom-left"
            className="io-button io-button--freq"
            tooltipStyles={{ marginTop: "-40px" }}
          >
            <div
              className={this.props.checkInputs("freq") + " io-element--freq"}
              onClick={() => this.tryToConnectTo("freq")}
              ref={ref => {
                this.freqInputElement = ref as HTMLDivElement;
              }}
            />
          </IconButton>
          <div className="card-content">
            <Toggle
              onClick={this.toggleOsc}
              className="toggle"
              thumbSwitchedStyle={{ backgroundColor: "#f50057" }}
              trackSwitchedStyle={{ backgroundColor: "#ff9d9d" }}
            />
            <form onSubmit={e => e.preventDefault()} className="block-controls">
              <TextField
                id="freq"
                floatingLabelText="Frequency"
                defaultValue={this.props.block.values[0]}
                onChange={this.handleFreqChange}
                className="input"
                type="number"
              />
            </form>
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
            <Analyser
              analyser={this.props.block.internal.analyser}
              backgroundColor="#53a857"
              lineColor="#f8f8f8"
            />
          </div>
          <IconButton
            tooltip="Output"
            tooltipPosition="bottom-right"
            className="io-button io-button--right"
            tooltipStyles={{ marginTop: "-40px" }}
          >
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
          </IconButton>
        </div>
      </Draggable>
    );
  }
}

export default composedBlock(OscBlock);
