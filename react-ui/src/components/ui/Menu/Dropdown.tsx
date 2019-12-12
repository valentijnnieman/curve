import * as React from "react";

interface DropdownProps {
  children: any;
  onChange: (e: any, index: any, value: any) => void;
  value: any;
  className?: string;
}

export default class Dropdown extends React.Component<DropdownProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      opened: false
    };
  }
  handleClick = () => {
    this.setState({ opened: !this.state.opened });
  };
  handleItemClick = (e: any, value: any) => {
    this.props.onChange(e, 0, value);
    this.handleClick();
  };
  render() {
    let kids;
    if (this.props.children.length < 1) {
      kids = [this.props.children];
    } else {
      kids = this.props.children;
    }
    const childrenWithClick = kids.map((child: any) => {
      return React.cloneElement(child, { onClick: this.handleItemClick });
    });
    return (
      <ul className="dropdown" onClick={this.handleClick}>
        {this.props.value}
        {this.state.opened ? childrenWithClick : ""}
      </ul>
    );
  }
}
