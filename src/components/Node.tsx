import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import Switch from "material-ui/Switch";
import Button from "material-ui/Button";

import Draggable from "react-draggable";
import { NodeDataObject } from "../models/nodeObject";
import { InternalObject } from "../models/internalObject";

import "./ui/Card.css";

interface NodeProps {
  node: NodeDataObject;
  allNodes: Array<NodeDataObject>;
  synth: InternalObject;
  allSynths: Array<InternalObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject) => void;
}
interface NodeState {
  oscRunning: boolean;
  connected: boolean;
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

    // this.analyser = this.props.ctx.createAnalyser();
    // this.analyser.fftSize = 2048;

    this.state = {
      oscRunning: true,
      connected: false
    };
  }
  toggleOsc = () => {
    if (!this.state.oscRunning) {
      // this.oscillatorNode.connect(this.props.osc.ctx.destination);
      this.props.synth.gain.gain.value = 1;
      this.props.synth.gain.connect(this.props.node.output as AudioParam);
      this.props.synth.gain.connect(this.props.synth.analyser);
      this.setState({
        oscRunning: true
      });
    } else {
      // this.oscillatorNode.disconnect(this.props.osc.ctx.destination);
      this.props.synth.gain.gain.value = 0;
      this.props.synth.gain.disconnect();
      this.setState({
        oscRunning: false
      });
    }
  };

  connectToGain = () => {
    if (this.props.canConnect && !this.state.connected) {
      // update store
      // this.props.node.output = this.props.allSynths[1].gain.gain;
      // this.props.updateNode(this.props.node.id, this.props.node);
      // this.props.allSynths[0].gain.disconnect();
      // this.props.allSynths[0].gain.connect(this.props.synth.gain.gain);

      // this.props.connect(
      //   this.props.allSynths[1].output,
      //   this.props.synth.gain.gain
      // );
      this.setState({
        connected: true
      });
    }
  };

  drawScope = () => {
    let ctx = this.analyserCanvas.getContext("2d") as CanvasRenderingContext2D;
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let timeData = new Uint8Array(this.props.synth.analyser.frequencyBinCount);
    let scaling = height / 256;
    let risingEdge = 0;

    this.props.synth.analyser.getByteTimeDomainData(timeData);

    ctx.fillStyle = "white";
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
  handleChange = () => {
    // set change here so it is instant
    this.props.synth.oscillator.frequency.setValueAtTime(
      this.freqInput.valueAsNumber,
      0
    );

    // update node info in store
    const updatedNode: NodeDataObject = {
      ...this.props.node,
      freq: this.freqInput.valueAsNumber
    };
    this.props.updateNode(updatedNode);
  };

  tryToConnect = () => {
    if (!this.state.connected) {
      this.props.tryToConnect(
        this.props.node,
        this.props.synth,
        this.outputElement.getBoundingClientRect()
      );
    }
  };

  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.node,
      this.props.synth.gain.gain,
      this.gainInputElement.getBoundingClientRect()
    );
  };
  onDragHandler = () => {
    // determine if output and/or input is connected
    if (this.props.node.hasInputFrom !== undefined) {
      window.console.log("HASINPUT YEAH", this.props.node.hasInputFrom);
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
  render() {
    return (
      <Draggable onDrag={this.onDragHandler}>
        <div className="card">
          <div className="card-content">
            <Button onClick={this.tryToConnectTo}>
              Input Gain
              <span
                ref={ref => {
                  this.gainInputElement = ref as HTMLSpanElement;
                }}
              />
            </Button>
          </div>
          <div className="card-content">
            <Switch checked={this.state.oscRunning} onClick={this.toggleOsc}>
              {this.state.oscRunning ? "Stop" : "Start"}
            </Switch>
            <form onChange={this.handleChange}>
              <input
                type="number"
                ref={input => {
                  this.freqInput = input as HTMLInputElement;
                }}
                defaultValue={this.props.node.freq.toString()}
              />
              {this.props.node.type}
            </form>
            <canvas
              ref={canvasElement => {
                this.analyserCanvas = canvasElement as HTMLCanvasElement;
              }}
              width={180}
              height={50}
            />
          </div>
          <div className="card-content">
            <Button onClick={this.tryToConnect}>
              Output
              <span
                ref={ref => {
                  this.outputElement = ref as HTMLSpanElement;
                }}
              />
            </Button>
          </div>
        </div>
      </Draggable>
    );
  }
}

export default CurveNode;
