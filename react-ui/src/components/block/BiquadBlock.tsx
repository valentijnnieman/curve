import * as React from "react";

import TextField from "../ui/Forms/TextField";

import { BlockData } from "../../types/blockData";

import DropDownMenu from "../ui/Menu/Dropdown";
import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { BiquadBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import { InternalBiquadData } from "../../types/internalData";
import IconButton from "../ui/Buttons/IconButton";
import Card from "../ui/Card";
import { DraggableData } from "react-draggable";
import DropdownItem from "../ui/Menu/DropdownItem";

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
    let inputElement;
    switch (outputType) {
      case "GAIN":
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
  handleTypeChange = (value: any) => {
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
          tooltip="Input"
          className="io-button"
          tooltipStyles={{ marginTop: "-40px" }}
        >
          <div
            className={this.props.checkInputs("GAIN")}
            onClick={() => this.tryToConnectTo("GAIN")}
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
            className="input input--dropdown"
            value={this.props.block.type}
            onChange={this.handleTypeChange}
          >
            <DropdownItem value="lowpass" primaryText="Lowpass" />
            <DropdownItem value="highpass" primaryText="Highpass" />
            <DropdownItem value="bandpass" primaryText="Bandpass" />
          </DropDownMenu>
          <Analyser
            analyser={this.props.block.internal.analyser as AnalyserNode}
            backgroundColor="#fdd835"
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
export default composedBlock(BiquadBlock);
