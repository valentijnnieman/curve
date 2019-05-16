import * as React from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import ClearIcon from "material-ui/svg-icons/content/clear";
import "../ui/Card.css";
import { IconButton } from "material-ui";
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
          <IconButton className="card-close" onClick={this.props.removeBlock}>
            <ClearIcon />
          </IconButton>
          {this.props.children}
        </div>
      </Draggable>
    );
  }
}
