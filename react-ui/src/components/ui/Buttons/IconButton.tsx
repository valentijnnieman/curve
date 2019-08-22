import * as React from "react";
import "./Button.css";

interface IconButtonProps {
  tooltip?: string;
  tooltipPosition?: string;
  className?: string;
  tooltipStyles?: object;
  onClick?: any;
}

interface IconButtonState {
  tooltipEnabled: boolean;
}

export default class IconButton extends React.Component<
  IconButtonProps,
  IconButtonState
> {
  constructor(props: IconButtonProps) {
    super(props);
    this.state = {
      tooltipEnabled: false
    };
  }

  render() {
    const buttonClass = `button floating-action-button ${this.props.className}`;
    return (
      <div>
        <span
          className={`tooltip ${
            this.state.tooltipEnabled ? "" : "tooltip--hidden"
          }`}
        >
          {this.props.tooltip}
        </span>
        <div
          className={buttonClass}
          onMouseEnter={() => this.setState({ tooltipEnabled: true })}
          onMouseLeave={() => this.setState({ tooltipEnabled: false })}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
