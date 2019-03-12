import { StoreState } from "../types/storeState";
import { BlockDataOptions } from "../types/blockData";
import { buildInternal } from "../lib/helpers/Editor";

const audioCtx = new AudioContext();

const blockOptions: Array<BlockDataOptions> = [
  {
    id: 0,
    x: 0,
    y: 0,
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
    }
  ],
  audioCtx,
  error: "",
  success: "",
  lastId: 0
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
