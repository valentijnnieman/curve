import { BlockData, BlockDataOptions } from "../../types/blockData";
import { buildInternal } from "./Editor";

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
const mockblockOptions: Array<BlockDataOptions> = [
  {
    id: 0,
    x: 0,
    y: 0,
    blockType: "OSC",
    type: "sine" as OscillatorType,
    values: [220],
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
    x: 0,
    y: 0,
    blockType: "GAIN",
    values: [1],
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
    x: 0,
    y: 0,
    blockType: "GAIN",
    values: [1],
    hasInternal: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    connected: false,
    gainInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 3,
    x: 0,
    y: 0,
    blockType: "BIQUAD",
    type: "lowpass" as BiquadFilterType,
    values: [1000, 10],
    connected: false,
    hasInternal: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    gainInputDOMRect: inputDOMRect,
    freqInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 4,
    x: 0,
    y: 0,
    blockType: "ENVELOPE",
    values: [0, 0.5, 0.5, 0.4],
    connected: false,
    hasInternal: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    gainInputDOMRect: inputDOMRect,
    freqInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 5,
    x: 0,
    y: 0,
    blockType: "OSC",
    type: "sine" as OscillatorType,
    values: [220],
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
];
export const mockblocks: Array<BlockData> = [
  {
    ...mockblockOptions[0],
    internal: buildInternal(mockblockOptions[0], audioCtx)
  },

  {
    ...mockblockOptions[1],
    internal: buildInternal(mockblockOptions[1], audioCtx)
  },

  {
    ...mockblockOptions[2],
    internal: buildInternal(mockblockOptions[2], audioCtx)
  },

  {
    ...mockblockOptions[3],
    internal: buildInternal(mockblockOptions[3], audioCtx)
  },
  {
    ...mockblockOptions[4],
    internal: buildInternal(mockblockOptions[4], audioCtx)
  },
  {
    ...mockblockOptions[5],
    internal: buildInternal(mockblockOptions[5], audioCtx)
  }
];

export const mockStore = configureMockStore();
