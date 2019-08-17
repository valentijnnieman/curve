import * as React from "react";
import TextField from "../ui/TextField";

import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { BlockData } from "../../types/blockData";

import { EnvelopeBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import IconButton from "../ui/Buttons/IconButton";
import FlatButton from "../ui/Buttons/FlatButton";
import Card from "../ui/Card";
import { DraggableData } from "react-draggable";

interface EnvelopeState {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  inputTriggered: boolean;
}

export class EnvelopeBlock extends React.Component<
  EnvelopeBlockProps,
  EnvelopeState
> {
  analyser: AnalyserNode;

  gainInputElement: HTMLDivElement;
  triggerInputElement: HTMLDivElement;
  outputElement: HTMLDivElement;

  timeData: Uint8Array;

  constructor(props: EnvelopeBlockProps) {
    super(props);
    this.props.connectInternal();

    this.state = {
      attack: this.props.block.values[0],
      decay: this.props.block.values[1],
      sustain: this.props.block.values[2],
      release: this.props.block.values[3],
      inputTriggered: false
    };
    this.timeData = new Uint8Array(1);
  }
  readTriggerInput = () => {
    this.props.block.internal.analyser.getByteTimeDomainData(this.timeData);

    if (this.timeData.some(data => data >= 250) && !this.state.inputTriggered) {
      this.setState(
        {
          ...this.state,
          inputTriggered: true
        },
        () => {
          this.handleTrigger();
        }
      );
    }
    if (this.timeData.some(data => data <= 20)) {
      this.setState({
        ...this.state,
        inputTriggered: false
      });
    }
    setTimeout(this.readTriggerInput, 10);
  };
  tryToConnectTo = (connectionType: string) => {
    if (connectionType === "GAIN") {
      this.props.tryToConnectTo(
        this.props.block,
        "GAIN",
        this.gainInputElement.getBoundingClientRect()
      );
    } else if (connectionType === "TRIGGER") {
      this.props.tryToConnectTo(
        this.props.block,
        "TRIGGER",
        this.triggerInputElement.getBoundingClientRect()
      );
    }
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
      outputDOMRect: this.outputElement.getBoundingClientRect() as DOMRect,
      triggerInputDOMRect: this.triggerInputElement.getBoundingClientRect() as DOMRect
    };
    this.props.updateBlock(updatedBlock);
  }
  componentWillReceiveProps(newProps: EnvelopeBlockProps) {
    if (newProps.block.hasInputFrom.length > 0) {
      for (var i = 0; i < this.props.block.hasInputFrom.length; i++) {
        const blockConnectedToThis = this.props.allBlocks.find(
          block => block.id === this.props.block.hasInputFrom[i]
        );
        if (
          blockConnectedToThis &&
          blockConnectedToThis.outputs &&
          blockConnectedToThis.outputs.length > 0
        ) {
          for (var j = 0; j < blockConnectedToThis.outputs.length; j++) {
            const output = blockConnectedToThis.outputs[j];
            if (output.connectedToType === "TRIGGER") {
              this.readTriggerInput();
            }
          }
        }
      }
    }
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
            this.outputElement.getBoundingClientRect() as DOMRect,
            undefined,
            this.triggerInputElement.getBoundingClientRect() as DOMRect
          )
        }
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
            }}
          />
        </IconButton>
        <IconButton
          tooltipPosition="bottom-left"
          tooltip="Trigger"
          className="io-button io-button--freq"
          tooltipStyles={{ marginTop: "-40px" }}
        >
          <div
            className={this.props.checkInputs("TRIGGER")}
            onClick={() => this.tryToConnectTo("TRIGGER")}
            ref={ref => {
              this.triggerInputElement = ref as HTMLDivElement;
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
              this.outputElement = ref as HTMLDivElement;
            }}
          />
        </IconButton>
      </Card>
    );
  }
}

export default composedBlock(EnvelopeBlock);
