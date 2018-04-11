import * as React from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import { OscDataObject, GainDataObject } from "../../types/nodeObject";
import "./Dropdown.css";
import ContentAdd from "material-ui/svg-icons/content/add";

interface DropdownProps {
  createNode: (node: OscDataObject | GainDataObject) => void;
}

export class Dropdown extends React.Component<DropdownProps, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      open: false
    };
  }

  handleClick = (event: React.MouseEvent<any>) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <div>
        <FloatingActionButton
          secondary={true}
          onClick={this.handleClick}
          className="dropdown-button"
        >
          <ContentAdd />
        </FloatingActionButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          targetOrigin={{ horizontal: "left", vertical: "top" }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem
              primaryText="Oscillator"
              onClick={() => {
                const newOscNode = {
                  id: 999,
                  type: "square" as OscillatorType,
                  freq: 330,
                  output: undefined,
                  hasInternal: false,
                  running: false,
                  hasGainInput: false,
                  hasFreqInput: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  isConnectedTo: undefined,
                  connected: false,
                  connectedToType: undefined,
                  connectedToEl: undefined,
                  connectedFromEl: undefined
                };
                this.props.createNode(newOscNode);
              }}
            />
            <MenuItem
              primaryText="Gain"
              onClick={() => {
                const newOscNode = {
                  id: 999,
                  gain: 1,
                  output: undefined,
                  hasInternal: false,
                  hasGainInput: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  isConnectedTo: undefined,
                  connected: false,
                  connectedToEl: undefined,
                  connectedFromEl: undefined
                };
                this.props.createNode(newOscNode);
              }}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
}
