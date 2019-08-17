import * as React from "react";
import Menu from "../ui/Menu";
import MenuItem from "../ui/MenuItem";
import { BlockData, BlockDataOptions } from "../../types/blockData";
import "./Dropdown.css";
// import ContentAdd from "../ui/Icons/add.svg";

import { v4 as uuid } from "uuid";

import { buildInternal } from "../../lib/helpers/Editor";
import Drawer from "./Drawer";
import SidebarButton from "./Buttons/SidebarButton";

interface CreateBlockProps {
  audioCtx: AudioContext;
  createBlock: (node: BlockData) => void;
}

export class CreateBlock extends React.Component<CreateBlockProps, any> {
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
        <SidebarButton
          secondary={true}
          onClick={this.handleClick}
          className="createblock-button"
        >
          {/* <ContentAdd /> */}
        </SidebarButton>
        <Drawer
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
          right={true}
        >
          <h2>Add block:</h2>
          <Menu>
            <MenuItem
              onClick={() => {
                const options = {
                  id: uuid(),
                  x: 0,
                  y: 0,
                  blockType: "OSC",
                  type: "square" as OscillatorType,
                  values: [330],
                  hasInternal: false,
                  running: false,
                  hasInputFrom: [],
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
            >
              Oscillator
            </MenuItem>
            <MenuItem
              onClick={() => {
                const options = {
                  id: uuid(),
                  x: 0,
                  y: 0,
                  blockType: "BIQUAD",
                  type: "lowpass" as BiquadFilterType,
                  values: [1000, 10],
                  connected: false,
                  hasInternal: false,
                  hasInputFrom: [],
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
            >
              Filter
            </MenuItem>
            <MenuItem
              onClick={() => {
                const options = {
                  id: uuid(),
                  x: 0,
                  y: 0,
                  blockType: "ENVELOPE",
                  values: [0, 0.5, 0.5, 0.4],
                  connected: false,
                  hasInternal: false,
                  hasInputFrom: [],
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
            >
              Envelope
            </MenuItem>
            <MenuItem
              onClick={() => {
                const options = {
                  id: uuid(),
                  x: 0,
                  y: 0,
                  blockType: "GAIN",
                  values: [1],
                  connected: false,
                  hasInternal: false,
                  hasInputFrom: [],
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
            >
              Gain
            </MenuItem>
          </Menu>
        </Drawer>
      </div>
    );
  }
}
