import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";
import TextField from "material-ui/TextField";

import Draggable from "react-draggable";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

import "./ui/Card.css";
import "./Node.css";
import { Analyser } from "./Analyser";

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

  gainInputElement: HTMLSpanElement;
  outputElement: HTMLSpanElement;

  constructor(props: NodeProps) {
    super(props);
    // this.connectInternal();
  }
  connectToAnalyser = () => {
    this.props.internal.gain.connect(this.props.internal.analyser);
  };
  tryToConnect = () => {
    this.props.tryToConnect(
      this.props.node,
      this.props.internal,
      this.outputElement.getBoundingClientRect()
    );
  };

  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.node,
      this.props.internal.gain,
      "gain",
      this.gainInputElement.getBoundingClientRect()
    );
  };
  connectInternal = () => {
    const node = this.props.node;
    const internal = this.props.allInternals[node.id];

    internal.gain.disconnect();

    if (node.output !== undefined) {
      internal.gain.connect(node.output as AudioParam);
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
    if (this.props.node.connected) {
      const updateSelf: GainDataObject = {
        ...this.props.node,
        connectedFromEl: this.outputElement.getBoundingClientRect() as DOMRect
      };
      this.props.updateNode(updateSelf);
    }
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
  componentWillReceiveProps(nextProps: NodeProps) {
    if (this.props.node.output !== nextProps.node.output) {
      this.props = nextProps;
      this.connectInternal();
    } else {
      this.props = nextProps;
    }
  }
  render() {
    return (
      <Draggable onDrag={this.onDragHandler} cancel="input">
        <div className="card">
          <div
            className={
              this.props.node.hasGainInput
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

export default GainNode;
