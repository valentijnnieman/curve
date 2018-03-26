import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

import "./ui/Card.css";
import "./Node.css";

interface NodeProps {
  node: GainDataObject;
  allNodes: Array<NodeDataObject | GainDataObject>;
  internal: InternalGainObject;
  allInternals: Array<InternalObject | InternalGainObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
  audioCtx: AudioContext;
}

class GainNode extends React.Component<NodeProps> {
  analyser: AnalyserNode;
  analyserCanvas: HTMLCanvasElement;

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: NodeProps) {
    super(props);
    this.connectInternal();
  }
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
      this.props.internal.gain,
      this.gainInputElement.getBoundingClientRect()
    );
  };
  connectInternal = () => {
    const node = this.props.node;
    const internal = this.props.allInternals[node.id];

    internal.gain.disconnect();

    if (node.output !== undefined) {
      internal.gain.connect(node.output as AudioParam);
    } else {
      internal.gain.connect(this.props.audioCtx.destination);
    }
    internal.gain.connect(internal.analyser);
  };
  onDragHandler = () => {
    // determine if output and/or input is connected
    if (this.props.node.hasInputFrom.length > 0) {
      this.props.node.hasInputFrom.map(input => {
        // the node that receives data
        const inputFromNode = this.props.allNodes[input];
        const updatedNode: GainDataObject | NodeDataObject = {
          ...inputFromNode,
          connectedToEl: this.gainInputElement.getBoundingClientRect() as DOMRect
        };
        this.props.updateNode(updatedNode);
      });
    }

    const updateSelf: GainDataObject = {
      ...this.props.node,
      connectedFromEl: this.outputElement.getBoundingClientRect() as DOMRect
    };
    this.props.updateNode(updateSelf);
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
            <h6>Speakers</h6>
            <form>
              <TextField
                label="Gain"
                defaultValue={this.props.node.gain}
                onChange={this.handleGainChange}
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
        </div>
      </Draggable>
    );
  }
}

export default GainNode;
