import * as React from "react";
import Menu from "./Menu/Menu";
import MenuItem from "./Menu/MenuItem";
import { BlockData, BlockDataOptions } from "../../types/blockData";
import "./Menu/Dropdown.css";
// import ContentAdd from "../ui/Icons/add.svg";

import { v4 as uuid } from "uuid";

import { buildInternal } from "../../lib/helpers/Editor";
import Drawer from "./Menu/Drawer";
import SidebarButton from "./Buttons/SidebarButton";

interface CreateBlockProps {
  audioCtx: AudioContext;
  createBlock: (node: BlockData) => void;
  zoom: number;
}

export class CreateBlock extends React.Component<CreateBlockProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: true,
      displayZoom: false
    };
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  componentWillReceiveProps(newProps: any) {
    if (newProps.zoom !== this.props.zoom) {
      this.setState({ displayZoom: true }, () => {
        window.setTimeout(() => {
          this.setState({ displayZoom: false });
        }, 1100);
      });
    }
  }

  render() {
    return (
      <div>
        <SidebarButton
          className="createblock-button"
          closedClassName="createblock-button--collapsed"
          open={this.state.open}
          onClick={this.handleToggle}
        />
        <Drawer open={this.state.open} right={true} static={true}>
          <div
            className={`menu-zoom-level ${
              this.state.displayZoom ? "" : "menu-zoom-level--hidden"
            }`}
          >
            {this.props.zoom}%
          </div>
          <h2 className="menu-title">+</h2>
          <Menu>
            <MenuItem
              className="create-osc-button"
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
              className="create-filter-button"
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
              className="create-envelope-button"
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
              className="create-gain-button"
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
