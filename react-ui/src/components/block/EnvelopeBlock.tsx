import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import TextField from "material-ui/TextField";

import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { BlockData } from "../../types/blockData";

import { EnvelopeBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import { IconButton, FlatButton } from "material-ui";
import { Card } from "../ui/Card";
import { DraggableData } from "react-draggable";

interface EnvelopeState {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export class EnvelopeBlock extends React.Component<
  EnvelopeBlockProps,
  EnvelopeState
> {
  analyser: AnalyserNode;

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: EnvelopeBlockProps) {
    super(props);
    this.props.connectInternal();
    this.state = {
      attack: this.props.block.values[0],
      decay: this.props.block.values[1],
      sustain: this.props.block.values[2],
      release: this.props.block.values[3]
    };
  }
  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.block,
      "GAIN",
      this.gainInputElement.getBoundingClientRect()
    );
  };
  handleChange = (e: any, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = Number(e.target.value);
    const name = e.target.name;
    if (newValue >= 0 && typeof newValue === "number") {
      // set internal state
      this.setState(
        {
          ...this.state,
          [name]: newValue
        },
        () => {
          // update block info in store
          const updatedNode: BlockData = {
            ...this.props.block,
            values: [
              this.state.attack,
              this.state.decay,
              this.state.sustain,
              this.state.release
            ]
          };
          this.props.updateBlock(updatedNode);
        }
      );
    }
  };

  handleTrigger = () => {
    const { attack, decay, sustain, release } = this.state;
    const now = this.props.audioCtx.currentTime;
    const gain = this.props.block.internal.gain.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(0, now);
    gain.linearRampToValueAtTime(1, now + attack);
    gain.linearRampToValueAtTime(sustain, now + attack + decay);
    gain.linearRampToValueAtTime(0, now + attack + decay + release);
  };
  removeBlock = () => {
    this.props.deleteBlock(this.props.block.id);
  };
  componentDidMount() {
    // when component has mounted and refs are set, we update the store
    const updatedBlock: BlockData = {
      ...this.props.block,
      gainInputDOMRect: this.gainInputElement.getBoundingClientRect() as DOMRect,
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
        onDrag={(data: DraggableData) =>
          this.props.onDragHandler(
            data,
            this.gainInputElement.getBoundingClientRect() as DOMRect,
            this.outputElement.getBoundingClientRect() as DOMRect
          )
        }
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
            onClick={this.tryToConnectTo}
            ref={ref => {
              this.gainInputElement = ref as HTMLDivElement;
            }}
          />
        </IconButton>
        <div className="card-content">
          <FlatButton
            label="Trigger"
            primary={true}
            onClick={this.handleTrigger}
            style={{ fontSize: "12px" }}
          />
          <form onSubmit={e => e.preventDefault()}>
            <TextField
              floatingLabelText="Attack"
              name="attack"
              value={this.state.attack}
              onChange={e => this.handleChange(e, 0)}
              type="number"
              step={0.1}
              className="input"
            />
            <TextField
              floatingLabelText="Decay"
              name="decay"
              value={this.state.decay}
              onChange={e => this.handleChange(e, 1)}
              type="number"
              step={0.1}
              className="input"
            />
            <TextField
              floatingLabelText="Sustain"
              name="sustain"
              value={this.state.sustain}
              onChange={e => this.handleChange(e, 2)}
              type="number"
              step={0.1}
              className="input"
            />
            <TextField
              floatingLabelText="Release"
              name="release"
              value={this.state.release}
              onChange={e => this.handleChange(e, 3)}
              type="number"
              step={0.1}
              className="input"
            />
          </form>
          <Analyser
            analyser={this.props.block.internal.analyser as AnalyserNode}
            backgroundColor="#e53935"
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
              this.outputElement = ref as HTMLSpanElement;
            }}
          />
        </IconButton>
      </Card>
    );
  }
}

export default composedBlock(EnvelopeBlock);
