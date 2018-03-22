import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import Switch from "material-ui/Switch";
import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { NodeDataObject } from "../models/nodeObject";
import { InternalObject } from "../models/internalObject";

import "./ui/Card.css";
import "./Node.css";

interface NodeProps {
  node: NodeDataObject;
  allNodes: Array<NodeDataObject>;
  internal: InternalObject;
  allInternals: Array<InternalObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject) => void;
}
interface NodeState {
  oscRunning: boolean;
}

class CurveNode extends React.Component<NodeProps, NodeState> {
  analyser: AnalyserNode;
  analyserCanvas: HTMLCanvasElement;

  freqInput: HTMLInputElement;
  typeInput: HTMLInputElement;

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: NodeProps) {
    super(props);

    this.state = {
      oscRunning: false
    };
  }
  toggleOsc = () => {
    if (!this.state.oscRunning) {
      this.props.internal.gain.gain.value = 1;
      this.setState({
        oscRunning: true
      });
      this.props.updateNode({
        ...this.props.node,
        running: true
      });
    } else {
      this.props.internal.gain.gain.value = 0;
      this.props.internal.gain.disconnect();
      this.setState({
        oscRunning: false
      });
      this.props.updateNode({
        ...this.props.node,
        running: false
      });
    }
  };

  drawScope = () => {
    let ctx = this.analyserCanvas.getContext("2d") as CanvasRenderingContext2D;
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let timeData = new Uint8Array(
      this.props.internal.analyser.frequencyBinCount
    );
    let scaling = height / 256;
    let risingEdge = 0;

    this.props.internal.analyser.getByteTimeDomainData(timeData);

    ctx.fillStyle = "#f8f8f8";
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#337ab7";
    ctx.beginPath();

    for (
      let x = risingEdge;
      x < timeData.length && x - risingEdge < width;
      x++
    ) {
      ctx.lineTo(x - risingEdge, height - timeData[x] * scaling);
    }

    ctx.stroke();
  };
  draw = () => {
    this.drawScope();
    requestAnimationFrame(this.draw);
  };
  componentDidMount() {
    this.draw();
  }

  tryToConnect = () => {
    if (!this.props.node.connected) {
      this.props.tryToConnect(
        this.props.node,
        this.props.internal,
        this.outputElement.getBoundingClientRect()
      );
    }
  };

  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.node,
      this.props.internal.gain.gain,
      this.gainInputElement.getBoundingClientRect()
    );
  };
  onDragHandler = () => {
    // determine if output and/or input is connected
    if (this.props.node.hasInputFrom !== undefined) {
      const inputFromNode = this.props.allNodes[this.props.node.hasInputFrom];
      const updatedNode: NodeDataObject = {
        ...inputFromNode,
        connectedToEl: this.gainInputElement.getBoundingClientRect() as DOMRect
      };
      this.props.updateNode(updatedNode);
    }
    const nodeToUpdate: NodeDataObject = {
      ...this.props.node,
      connectedFromEl: this.outputElement.getBoundingClientRect() as DOMRect
    };
    this.props.updateNode(nodeToUpdate);
  };
  handleFreqChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // set change here so it is instant
    this.props.internal.oscillator.frequency.setValueAtTime(e.target.value, 0);

    // update node info in store
    const updatedNode: NodeDataObject = {
      ...this.props.node,
      freq: e.target.value
    };
    this.props.updateNode(updatedNode);
  };
  handleTypeChange = (e: any) => {
    // set change here so it is instant
    this.props.internal.oscillator.type = e.target.value;

    // update node info in store
    const updatedNode: NodeDataObject = {
      ...this.props.node,
      type: e.target.value
    };
    this.props.updateNode(updatedNode);
  };
  preventBubble = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    window.console.log(e);
  };
  render() {
    return (
      <Draggable onDrag={this.onDragHandler} cancel="input">
        <div className="card">
          <div
            className={
              this.props.node.hasInput
                ? "io-element io-element--active"
                : "io-element"
            }
            onClick={this.tryToConnectTo}
          >
            <span
              ref={ref => {
                this.gainInputElement = ref as HTMLSpanElement;
              }}
            />
          </div>
          <div className="card-content">
            <Switch checked={this.state.oscRunning} onClick={this.toggleOsc}>
              {this.state.oscRunning ? "Stop" : "Start"}
            </Switch>
            <form>
              <TextField
                id="freq"
                label="Frequency"
                defaultValue={this.props.node.freq}
                onChange={this.handleFreqChange}
                className="input"
                onFocus={this.preventBubble}
              />
              <TextField
                id="type"
                label="Type"
                defaultValue={this.props.node.type}
                onChange={this.handleTypeChange}
                className="input"
              />
            </form>
            <canvas
              ref={canvasElement => {
                this.analyserCanvas = canvasElement as HTMLCanvasElement;
              }}
              width={160}
              height={80}
            />
          </div>
          <div
            className={
              this.props.node.connected
                ? "io-element io-element--right io-element--active"
                : "io-element io-element--right"
            }
            onClick={this.tryToConnect}
            ref={ref => {
              this.outputElement = ref as HTMLSpanElement;
            }}
          />
        </div>
      </Draggable>
    );
  }
}

export default CurveNode;
