import { BlockData } from "../../types/blockData";

const configureMockStore = require("redux-mock-store"); // Prevent Ts warning.

export const audioCtx = new AudioContext();

export const outputDOMRect = {
  x: 100,
  y: 100,
  width: 100,
  height: 100
} as DOMRect;

export const inputDOMRect = {
  x: 200,
  y: 200,
  width: 200,
  height: 200
} as DOMRect;

export const speakersDOMRect = {
  x: 0,
  y: 0,
  width: 200,
  height: 200
} as DOMRect;
export const mockblocks: Array<BlockData> = [
  {
    id: 0,
    blockType: "OSC",
    type: "sine" as OscillatorType,
    value: 220,
    hasInternal: false,
    running: false,
    connected: true,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    gainInputDOMRect: inputDOMRect,
    freqInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 1,
    blockType: "GAIN",
    value: 1,
    hasInternal: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    connected: false,
    gainInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 2,
    blockType: "GAIN",
    value: 1,
    hasInternal: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    connected: false,
    gainInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  }
];

export const mockStore = configureMockStore();
