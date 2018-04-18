import * as React from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Popover from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import { BlockData, BlockDataOptions } from "../../types/blockData";
import "./Dropdown.css";
import ContentAdd from "material-ui/svg-icons/content/add";

import { buildInternal } from "../../lib/helpers/Editor";

interface DropdownProps {
  audioCtx: AudioContext;
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
                const options = {
                  id: 999,
                  blockType: "OSC",
                  type: "square" as OscillatorType,
                  values: [330],
                  hasInternal: false,
                  running: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  connected: false,
                  outputs: [],
                  gainInputDOMRect: new DOMRect(0, 0, 0, 0),
                  freqInputDOMRect: new DOMRect(0, 0, 0, 0),
                  outputDOMRect: new DOMRect(0, 0, 0, 0)
                } as BlockDataOptions;
                const newOscBlock = {
                  ...options,
                  internal: buildInternal(options, this.props.audioCtx)
                } as BlockData;
                this.props.createBlock(newOscBlock);
              }}
            />
            <MenuItem
              primaryText="Filter"
              onClick={() => {
                const options = {
                  id: 999,
                  blockType: "BIQUAD",
                  type: "lowpass" as BiquadFilterType,
                  values: [1000, 10],
                  connected: false,
                  hasInternal: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  outputs: [],
                  gainInputDOMRect: new DOMRect(0, 0, 0, 0),
                  freqInputDOMRect: new DOMRect(0, 0, 0, 0),
                  outputDOMRect: new DOMRect(0, 0, 0, 0)
                } as BlockDataOptions;
                const newOscBlock = {
                  ...options,
                  internal: buildInternal(options, this.props.audioCtx)
                } as BlockData;
                this.props.createBlock(newOscBlock);
              }}
            />
            <MenuItem
              primaryText="Gain"
              onClick={() => {
                const options = {
                  id: 999,
                  blockType: "GAIN",
                  values: [1],
                  connected: false,
                  hasInternal: false,
                  hasInputFrom: [],
                  isConnectedToOutput: false,
                  outputs: [],
                  gainInputDOMRect: new DOMRect(0, 0, 0, 0),
                  outputDOMRect: new DOMRect(0, 0, 0, 0)
                } as BlockDataOptions;
                const newOscBlock = {
                  ...options,
                  internal: buildInternal(options, this.props.audioCtx)
                } as BlockData;
                this.props.createBlock(newOscBlock);
              }}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
}
