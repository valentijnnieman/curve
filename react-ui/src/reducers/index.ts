import { StoreState } from "../types/storeState";
import { BlockDataOptions, BlockData } from "../types/blockData";
import { buildInternal } from "../lib/helpers/Editor";

const audioCtx = new AudioContext();

let idCount = 0;

const blockOptions: Array<BlockDataOptions> = [
  {
    id: idCount++,
    x: 0,
    y: 0,
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
    x: 0,
    y: 0,
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
    x: 0,
    y: 0,
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
    x: 0,
    y: 0,
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
  name: "Unnamed synth",
  slug: "",
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
  audioCtx,
  error: "",
  success: ""
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
      // id's can be all over the place - we'll get the highest one
      const allIds = state.blocks.map(block => block.id);
      const newId = Math.max(...allIds) + 1;
      window.console.log(newId);
      return {
        ...state,
        blocks: [...state.blocks, { ...action.block, id: newId }]
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
        name: action.name,
        slug: action.slug,
        blocks: [
          ...action.blockOptions.map((option: BlockDataOptions) => {
            return {
              ...option,
              internal: buildInternal(option, audioCtx)
            };
          })
        ],
        audioCtx,
        error: initialState.error,
        success: initialState.success
      };
      return loadedState;
    case "FETCH_ERRORS":
      return {
        ...state,
        error: action.message
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        success: action.message,
        name: action.name,
        slug: action.slug,
        error: ""
      };
    default:
      return state;
  }
};
