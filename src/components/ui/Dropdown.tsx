import * as React from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import { BlockData } from "../../types/blockData";
import "./Dropdown.css";
import ContentAdd from "material-ui/svg-icons/content/add";

interface DropdownProps {
  blocksLength: number;
  createBlock: (node: BlockData) => void;
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
                  id: this.props.blocksLength,
                  blockType: "OSC",
                  type: "square" as OscillatorType,
                  value: 330,
                  hasInternal: false,
                  running: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  connected: false,
                  outputs: [],
                  gainInputDOMRect: new DOMRect(0, 0, 0, 0),
                  freqInputDOMRect: new DOMRect(0, 0, 0, 0),
                  outputDOMRect: new DOMRect(0, 0, 0, 0)
                } as BlockData;
                this.props.createBlock(newOscNode);
              }}
            />
            <MenuItem
              primaryText="Gain"
              onClick={() => {
                const newOscNode = {
                  id: this.props.blocksLength,
                  blockType: "GAIN",
                  value: 1,
                  connected: false,
                  hasInternal: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  outputs: [],
                  gainInputDOMRect: new DOMRect(0, 0, 0, 0),
                  outputDOMRect: new DOMRect(0, 0, 0, 0)
                } as BlockData;
                this.props.createBlock(newOscNode);
              }}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
}
