import * as React from "react";
import Draggable from "react-draggable";
import ClearIcon from "material-ui/svg-icons/content/clear";
import MinusIcon from "material-ui/svg-icons/content/remove";
import "../ui/Card.css";
import { IconButton } from "material-ui";

interface CardProps {
  children: any;
  removeBlock: any;
  onDrag: () => void;
}

interface CardState {
  collapsed: boolean;
}

export class Card extends React.Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      collapsed: false
    };
  }
  collapseCard = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <Draggable onDrag={this.props.onDrag} cancel="input">
        <div className={this.state.collapsed ? "card card--collapsed" : "card"}>
          <IconButton className="card-close" onClick={this.props.removeBlock}>
            <ClearIcon />
          </IconButton>
          <IconButton
            className="card-close card-collapse"
            onClick={this.collapseCard}
          >
            <MinusIcon />
          </IconButton>
          {this.props.children}
        </div>
      </Draggable>
    );
  }
}
