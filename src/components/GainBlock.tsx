import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import TextField from "material-ui/TextField";

import Draggable from "react-draggable";

import "./ui/Card.css";
import "./Node.css";
import { Analyser } from "./Analyser";

import { GainDataObject } from "../types/nodeObject";

import { GainBlockProps } from "../types/blockProps";
import { composedBlock } from "../lib/hoc/Block";

export class GainBlock extends React.Component<GainBlockProps> {
  analyser: AnalyserNode;

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: GainBlockProps) {
    super(props);
    // this.connectInternal();
  }
  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.node,
      this.props.internal.gain,
      "gain",
      this.gainInputElement.getBoundingClientRect()
    );
  };
  handleGainChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // set change here so it is instant
    this.props.internal.gain.gain.value = e.target.value;

    // update node info in store
    const updatedNode: GainDataObject = {
      ...this.props.node,
      gain: e.target.value
    };
    this.props.updateNode(updatedNode);
  };
  render() {
    return (
      <Draggable
        onDrag={() =>
          this.props.onDragHandler(
            this.gainInputElement.getBoundingClientRect() as DOMRect,
            this.outputElement.getBoundingClientRect() as DOMRect
          )
        }
        cancel="input"
      >
        <div className="card" id="gain-block">
          <div
            className={
              this.props.node.hasGainInput
                ? "io-element io-element--active"
                : "io-element"
            }
            onClick={this.tryToConnectTo}
            ref={ref => {
              this.gainInputElement = ref as HTMLDivElement;
            }}
          />
          <div className="card-content">
            <form>
              <TextField
                floatingLabelText="Gain"
                defaultValue={this.props.node.gain}
                onChange={this.handleGainChange}
                className="input"
              />
            </form>
            <Analyser
              analyser={this.props.internal.analyser}
              backgroundColor="#337ab7"
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
              this.outputElement = ref as HTMLSpanElement;
            }}
          />
        </div>
      </Draggable>
    );
  }
}

export default composedBlock(GainBlock);