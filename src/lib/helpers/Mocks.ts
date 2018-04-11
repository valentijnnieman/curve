import { NodeDataObject, GainDataObject } from "../../types/nodeObject";

const configureMockStore = require("redux-mock-store"); // Prevent Ts warning.

export const audioCtx = new AudioContext();

const outputDOMRect = { x: 100, y: 100, width: 100, height: 100 } as DOMRect;

const inputDOMRect = { x: 200, y: 200, width: 200, height: 200 } as DOMRect;
export const mockNodeData: Array<NodeDataObject | GainDataObject> = [
  {
    id: 0,
    type: "sine" as OscillatorType,
    freq: 220,
    output: undefined,
    hasInternal: false,
    running: false,
    connected: true,
    hasGainInput: false,
    hasFreqInput: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    isConnectedTo: 1,
    connectedToType: undefined,
    connectedToEl: inputDOMRect,
    connectedFromEl: outputDOMRect
  },
  {
    id: 1,
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
  }
];

const middleWare: any = [];
export const mockStore = configureMockStore(middleWare, {
  nodeData: mockNodeData
});
