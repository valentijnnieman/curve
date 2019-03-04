import { StoreState } from "../types/storeState";
import { BlockDataOptions } from "../types/blockData";
import { buildInternal } from "../lib/helpers/Editor";

const audioCtx = new AudioContext();

const blockOptions: Array<BlockDataOptions> = [
  {
    id: 0,
    x: 20,
    y: 60,
    blockType: "OSC",
    type: "sine" as OscillatorType,
    values: [440],
    hasInternal: false,
    running: false,
    connected: false,
    hasInputFrom: [],
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    freqInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 1,
    x: 220,
    y: 60,
    blockType: "ENVELOPE",
    values: [0, 0.5, 0.5, 0.4],
    hasInternal: false,
    running: false,
    hasInputFrom: [],
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 2,
    x: 420,
    y: 69,
    blockType: "BIQUAD",
    type: "lowpass" as BiquadFilterType,
    values: [440, 10],
    hasInternal: false,
    running: false,
    hasInputFrom: [],
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 3,
    x: 620,
    y: 80,
    blockType: "GAIN",
    values: [1],
    hasInternal: false,
    hasInputFrom: [],
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0),
    outputDOMRect: new DOMRect(0, 0, 0, 0)
  },
  {
    id: 4,
    x: 820,
    y: 69,
    blockType: "DESTINATION",
    values: [1],
    hasInternal: false,
    hasInputFrom: [],
    connected: false,
    outputs: [],
    gainInputDOMRect: new DOMRect(0, 0, 0, 0)
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
    },
    {
      ...blockOptions[4],
      internal: buildInternal(blockOptions[4], audioCtx)
    }
  ],
  audioCtx,
  error: "",
  success: "",
  lastId: 4
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
        blocks: [...state.blocks, { ...action.block, id: state.lastId + 1 }],
        lastId: state.lastId + 1
      };
    case "DELETE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.id)
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
        success: initialState.success,
        lastId: initialState.lastId
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
