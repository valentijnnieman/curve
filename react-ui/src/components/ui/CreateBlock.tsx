import * as React from "react";
import Menu from "./Menu/Menu";
import MenuItem from "./Menu/MenuItem";
import { BlockData, BlockDataOptions } from "../../types/blockData";
import "./Menu/Dropdown.css";
// import ContentAdd from "../ui/Icons/add.svg";

import { v4 as uuid } from "uuid";

import { buildInternal } from "../../lib/helpers/Editor";
import Drawer from "./Menu/Drawer";

interface CreateBlockProps {
  audioCtx: AudioContext;
  createBlock: (node: BlockData) => void;
}

export class CreateBlock extends React.Component<CreateBlockProps, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <Drawer open={true} right={true} static={true}>
          <h2>Add:</h2>
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
