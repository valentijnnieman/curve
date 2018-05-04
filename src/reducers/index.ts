import { StoreState } from "../types/storeState";
import { BlockDataOptions } from "../types/blockData";
import { buildInternal } from "../lib/helpers/Editor";

const audioCtx = new AudioContext();

const blockOptions: Array<BlockDataOptions> = [
  {
    id: 0,
    blockType: "OSC",
    type: "sine" as OscillatorType,
    values: [220],
    hasInternal: false,
    running: false,
    connected: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    freqInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 1,
    blockType: "ENVELOPE",
    values: [0, 0.5, 0.5, 0.4],
    hasInternal: false,
    running: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 2,
    blockType: "BIQUAD",
    type: "lowpass" as BiquadFilterType,
    values: [440, 10],
    hasInternal: false,
    running: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 3,
    blockType: "GAIN",
    values: [1],
    hasInternal: false,
    hasInputFrom: [],
    isConnectedToOutput: false,
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  }
];

const initialState = {
  blocks: [
    {
      ...blockOptions[0],
      internal: buildInternal(blockOptions[0], audioCtx)
    },
    {
      ...blockOptions[1],
      internal: buildInternal(blockOptions[1], audioCtx)
    },
    {
      ...blockOptions[2],
      internal: buildInternal(blockOptions[2], audioCtx)
    },
    {
      ...blockOptions[3],
      internal: buildInternal(blockOptions[3], audioCtx)
    }
  ],
  audioCtx
};

export default (state: StoreState = initialState, action: any): StoreState => {
  switch (action.type) {
    case "UPDATE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map(block => {
          if (block.id === action.block.id) {
            return action.block;
          }
          return block;
        })
      };
    case "CREATE_BLOCK":
      return {
        ...state,
        blocks: [...state.blocks, { ...action.block, id: state.blocks.length }]
      };
    default:
      return state;
  }
};
