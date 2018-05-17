import * as React from "react";
import Draggable from "react-draggable";
import ClearIcon from "material-ui/svg-icons/content/clear";
import "../ui/Card.css";
import { IconButton } from "material-ui";

interface CardProps {
  children: any;
  removeBlock: any;
  onDrag: () => void;
}

export const Card: React.SFC<CardProps> = props => {
  return (
    <Draggable onDrag={props.onDrag} cancel="input">
      <div className="card">
        <IconButton className="card-close" onClick={props.removeBlock}>
          <ClearIcon />
        </IconButton>
        {props.children}
      </div>
    </Draggable>
  );
};
