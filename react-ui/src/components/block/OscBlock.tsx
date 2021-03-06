import * as React from "react";
import Toggle from "../ui/Buttons/Toggle";

import TextField from "../ui/Forms/TextField";

import { BlockData } from "../../types/blockData";

import { InternalOscData } from "../../types/internalData";

import DropDownMenu from "../ui/Menu/Dropdown";

import "./Block.css";
import { Analyser } from "../Analyser";

import { OscBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import IconButton from "../ui/Buttons/IconButton";
import Card from "../ui/Card";
import { DraggableData } from "react-draggable";
import DropdownItem from "../ui/Menu/DropdownItem";

export class OscBlock extends React.Component<OscBlockProps> {
  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLDivElement;
  freqInputElement: HTMLDivElement;
  outputElement: HTMLDivElement;

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
    let inputElement;
    switch (outputType) {
      case "GAIN_MOD":
        inputElement = this.gainInputElement.getBoundingClientRect();
        break;
      case "FREQ":
        inputElement = this.freqInputElement.getBoundingClientRect();
        break;
      default:
        inputElement = this.gainInputElement.getBoundingClientRect();
    }
    this.props.tryToConnectTo(this.props.block, outputType, inputElement);
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
  // handleTypeChange's parameters are dictated by material-ui/DropdownMenu
  handleTypeChange = (value: any) => {
    // set change here so it is instant
    (this.props.block.internal as InternalOscData).oscillator.type = value;

    // update block info in store
    const updatedBlock: BlockData = {
      ...this.props.block,
      type: value
    } as BlockData;
    this.props.updateBlock(updatedBlock);
  };
  removeBlock = () => {
    this.props.deleteBlock(this.props.block.id);
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
  componentWillReceiveProps(nextProps: OscBlockProps) {
    (nextProps.block.internal as InternalOscData).oscillator.connect(
      nextProps.block.internal.gain as GainNode
    );
  }

  render() {
    return (
      <Card
        removeBlock={() => {
          this.props.deleteBlock(this.props.block.id);
        }}
        onDrag={(data: DraggableData) => {
          this.props.onDragHandler(
            data,
            this.gainInputElement.getBoundingClientRect() as DOMRect,
            this.outputElement.getBoundingClientRect() as DOMRect,
            this.freqInputElement.getBoundingClientRect() as DOMRect
          );
        }}
        startDragging={this.props.startDragging}
        stopDragging={this.props.stopDragging}
        block={this.props.block}
      >
        <IconButton
          tooltipPosition="bottom-left"
          tooltip="Modulate gain input"
          className="io-button"
          tooltipStyles={{ marginTop: "-40px" }}
        >
          <div
            className={this.props.checkInputs("GAIN_MOD")}
            onClick={() => this.tryToConnectTo("GAIN_MOD")}
            ref={ref => {
              this.gainInputElement = ref as HTMLDivElement;
              if (this.gainInputElement != null) {
                const gainInputRect = this.gainInputElement.getBoundingClientRect() as DOMRect;
                if (
                  this.props.block.gainInputDOMRect &&
                  (gainInputRect.x !== this.props.block.gainInputDOMRect.x ||
                    gainInputRect.y !== this.props.block.gainInputDOMRect.y)
                ) {
                  this.props.updateBlock({
                    ...this.props.block,
                    gainInputDOMRect: gainInputRect
                  });
                }
              }
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
            className={this.props.checkInputs("FREQ") + " io-element--freq"}
            onClick={() => this.tryToConnectTo("FREQ")}
            ref={ref => {
              this.freqInputElement = ref as HTMLDivElement;
              if (this.freqInputElement != null) {
                const freqInputRect = this.freqInputElement.getBoundingClientRect() as DOMRect;
                if (
                  this.props.block.freqInputDOMRect &&
                  (freqInputRect.x !== this.props.block.freqInputDOMRect.x ||
                    freqInputRect.y !== this.props.block.freqInputDOMRect.y)
                ) {
                  this.props.updateBlock({
                    ...this.props.block,
                    freqInputDOMRect: freqInputRect
                  });
                }
              }
            }}
          />
        </IconButton>
        <div className="card-content">
          <Toggle
            onClick={this.toggleOsc}
            className="toggle"
            thumbSwitchedStyle={{ backgroundColor: "#f50057" }}
            trackSwitchedStyle={{ backgroundColor: "#ff9d9d" }}
            toggled={this.props.block.running}
          />
          <form onSubmit={e => e.preventDefault()} className="block-controls">
            <TextField
              id="FREQ"
              floatingLabelText="Frequency"
              value={this.props.block.values[0]}
              onChange={this.handleFreqChange}
              className="input"
              type="number"
            />
          </form>
          <DropDownMenu
            className="input input--dropdown"
            value={this.props.block.type}
            onChange={this.handleTypeChange}
          >
            <DropdownItem value="sine" primaryText="Sine" />
            <DropdownItem value="square" primaryText="Square" />
            <DropdownItem value="triangle" primaryText="Triangle" />
            <DropdownItem value="sawtooth" primaryText="Sawtooth" />
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
              if (this.outputElement != null) {
                const outputRect = this.outputElement.getBoundingClientRect() as DOMRect;
                if (
                  this.props.block.outputDOMRect &&
                  (outputRect.x !== this.props.block.outputDOMRect.x ||
                    outputRect.y !== this.props.block.outputDOMRect.y)
                ) {
                  this.props.updateBlock({
                    ...this.props.block,
                    outputDOMRect: outputRect
                  });
                }
              }
            }}
          />
        </IconButton>
      </Card>
    );
  }
}

export default composedBlock(OscBlock);
