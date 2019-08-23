import * as React from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
const ClearSVG = require("../ui/Icons/clear.svg");
import "../ui/Card.css";
import { BlockData } from "../../types/blockData";

interface CardProps {
  block: BlockData;
  children: any;
  removeBlock: any;
  onDrag: (data: DraggableData) => void;
  startDragging: () => void;
  stopDragging: () => void;
}

export default class Card extends React.Component<CardProps> {
  constructor(props: CardProps) {
    super(props);
  }
  render() {
    return (
      <Draggable
        onStart={this.props.startDragging}
        onStop={(e: DraggableEvent, data: DraggableData) => {
          this.props.stopDragging();
          this.props.onDrag(data);
        }}
        onDrag={(e: DraggableEvent, data: DraggableData) => {
          this.props.onDrag(data);
        }}
        cancel="input"
        position={{
          x: this.props.block.x,
          y: this.props.block.y
        }}
      >
        <div className="card">
          <div className="card-close" onClick={this.props.removeBlock}>
            <img src={ClearSVG} />
            {/* <ClearIcon /> */}
          </div>
          {this.props.children}
        </div>
      </Draggable>
    );
  }
}
