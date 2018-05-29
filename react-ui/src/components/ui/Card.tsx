import * as React from "react";
import Draggable, { DraggableData } from "react-draggable";
import ClearIcon from "material-ui/svg-icons/content/clear";
import "../ui/Card.css";
import { IconButton } from "material-ui";
import { BlockData } from "../../types/blockData";

interface CardProps {
  block: BlockData;
  children: any;
  removeBlock: any;
  onDrag: (data: DraggableData) => void;
}

export class Card extends React.Component<CardProps> {
  constructor(props: CardProps) {
    super(props);
  }
  render() {
    return (
      <Draggable
        onDrag={(e: Event, data: DraggableData) => {
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
