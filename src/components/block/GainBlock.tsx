import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import TextField from "material-ui/TextField";

import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { BlockData } from "../../types/blockData";

import { GainBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import { IconButton } from "material-ui";

import { Card } from "../ui/Card";

export class GainBlock extends React.Component<GainBlockProps> {
  analyser: AnalyserNode;

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: GainBlockProps) {
    super(props);
    this.props.connectInternal();
  }
  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.block,
      this.props.block.internal.gain,
      "gain",
      this.gainInputElement.getBoundingClientRect()
    );
  };
  handleGainChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newGain = Number(e.target.value);
    if (newGain >= 0 && typeof newGain === "number") {
      // set change here so it is instant
      if (this.props.block.internal.gain) {
        this.props.block.internal.gain.gain.value = newGain;
      }
      // update block info in store
      const updatedNode: BlockData = {
        ...this.props.block,
        values: [newGain]
      };
      this.props.updateBlock(updatedNode);
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
        onDrag={() =>
          this.props.onDragHandler(
            this.gainInputElement.getBoundingClientRect() as DOMRect,
            this.outputElement.getBoundingClientRect() as DOMRect
          )
        }
      >
        <IconButton
          tooltipPosition="bottom-left"
          tooltip="Input"
          className="io-button"
          tooltipStyles={{ marginTop: "-40px" }}
        >
          <div
            className={this.props.checkInputs("gain")}
            onClick={this.tryToConnectTo}
            ref={ref => {
              this.gainInputElement = ref as HTMLDivElement;
            }}
          />
        </IconButton>
        <div className="card-content">
          <div className="block-controls">
            <form onSubmit={e => e.preventDefault()}>
              <TextField
                floatingLabelText="Gain"
                defaultValue={this.props.block.values[0]}
                onChange={this.handleGainChange}
                type="number"
                step={0.1}
                className="input"
              />
            </form>
          </div>
          <Analyser
            analyser={this.props.block.internal.analyser as AnalyserNode}
            backgroundColor="#337ab7"
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

export default composedBlock(GainBlock);
