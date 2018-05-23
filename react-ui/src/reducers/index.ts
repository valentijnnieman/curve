import { StoreState } from "../types/storeState";
import { BlockDataOptions, BlockData } from "../types/blockData";
import { buildInternal } from "../lib/helpers/Editor";

const audioCtx = new AudioContext();

let idCount = 0;

const blockOptions: Array<BlockDataOptions> = [
  {
    id: idCount++,
    blockType: "OSC",
    type: "sine" as OscillatorType,
    values: [440],
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
    id: idCount++,
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
    id: idCount++,
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
    id: idCount++,
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
        blocks: [...state.blocks, { ...action.block, id: idCount++ }]
      };
    case "DELETE_BLOCK":
      const blockToDelete = state.blocks.find(
        b => b.id === action.id
      ) as BlockData;
      const index = state.blocks.indexOf(blockToDelete);
      return {
        ...state,
        blocks: [
          ...state.blocks.slice(0, index),
          ...state.blocks.slice(index + 1)
        ]
      };
    case "LOAD_STATE":
      const loadedState = {
        blocks: [
          ...action.blockOptions.map((option: BlockDataOptions) => {
            return {
              ...option,
              internal: buildInternal(option, audioCtx)
            };
          })
        ],
        audioCtx
      };
      window.console.log("loadedstate", loadedState);
      return loadedState;
    case "RETRIEVE_BLOCKS":
      // retrieves blocks without internals - for storing in database
      return {
        blocks: [
          ...state.blocks.map(block => {
            delete block.internal;
            return block;
          })
        ],
        audioCtx
      };
    default:
      return state;
  }
};
