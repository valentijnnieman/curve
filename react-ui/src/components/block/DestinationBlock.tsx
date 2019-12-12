import * as React from "react";
// import { Button, ButtonToolbar } from "react-bootstrap";

import "../ui/Card.css";
import "./Block.css";
import { Analyser } from "../Analyser";

import { BlockData } from "../../types/blockData";

import { DestinationBlockProps } from "../../types/blockProps";
import { composedBlock } from "../../lib/hoc/Block";
import IconButton from "../ui/Buttons/IconButton";

import Card from "../ui/Card";
import { DraggableData } from "react-draggable";

const SpeakerSVG = require("../../speakers.svg");

export class DestinationBlock extends React.Component<DestinationBlockProps> {
  analyser: AnalyserNode;

  gainInputElement: HTMLDivElement;

  constructor(props: DestinationBlockProps) {
    super(props);
    this.props.connectInternal();
  }
  tryToConnectTo = () => {
    this.props.tryToConnectTo(
      this.props.block,
      "DESTINATION",
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
      gainInputDOMRect: this.gainInputElement.getBoundingClientRect() as DOMRect
    };
    this.props.updateBlock(updatedBlock);
  }
  render() {
    return (
      <Card
        removeBlock={() => {
          // can't delete speaker output block
        }}
        onDrag={(data: DraggableData) =>
          this.props.onDragHandler(
            data,
            this.gainInputElement.getBoundingClientRect() as DOMRect
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
            className={this.props.checkInputs("DESTINATION")}
            onClick={this.tryToConnectTo}
            id="destination"
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
        <div className="card-content">
          <img
            alt="spearkers"
            className="speakers-svg"
            src={SpeakerSVG}
            width={100}
          />
          <Analyser
            analyser={this.props.block.internal.analyser as AnalyserNode}
            backgroundColor="#e91e63"
            lineColor="#f8f8f8"
          />
        </div>
      </Card>
    );
  }
}

export default composedBlock(DestinationBlock);
