import * as React from "react";
import Button from "material-ui/Button";
import Menu, { MenuItem } from "material-ui/Menu";

class SimpleMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          color="primary"
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Create
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose}>Oscillator</MenuItem>
          <MenuItem onClick={this.handleClose}>Gain</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default SimpleMenu;
