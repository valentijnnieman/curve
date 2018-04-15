import { OscData, GainData } from "../../types/blockData";

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
export const mockblocks: Array<OscData | GainData> = [
  {
    id: 0,
    type: "sine" as OscillatorType,
    freq: 220,
    hasInternal: false,
    running: false,
    connected: true,
    hasGainInput: false,
    hasFreqInput: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    gainInputDOMRect: inputDOMRect,
    freqInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 1,
    gain: 1,
    hasInternal: false,
    hasGainInput: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    connected: false,
    gainInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  },
  {
    id: 2,
    gain: 1,
    hasInternal: false,
    hasGainInput: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    connected: false,
    gainInputDOMRect: inputDOMRect,
    outputDOMRect: outputDOMRect
  }
];

export const mockStore = configureMockStore();
