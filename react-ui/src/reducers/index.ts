import { StoreState } from "../types/storeState";
import { BlockDataOptions } from "../types/blockData";
import { buildInternal } from "../lib/helpers/Editor";

const audioCtx = new AudioContext();

const blockOptions: Array<BlockDataOptions> = [
  {
    id: "curve-output",
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
  user: {},
  name: "Unnamed synth",
  synths: [],
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
  lastId: 0,
  synthId: -1,
  dragging: false
};

export default (state: StoreState = initialState, action: any): StoreState => {
  switch (action.type) {
    case "START_DRAGGING":
      return {
        ...state,
        dragging: true
      };
    case "STOP_DRAGGING":
      return {
        ...state,
        dragging: false
      };
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
        blocks: [...state.blocks, { ...action.block }]
      };
    case "DELETE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter(block => block.id !== action.id)
      };
    case "LOAD_STATE":
      const loadedState = {
        user: state.user,
        name: action.name,
        slug: action.slug,
        synthId: action.id,
        synths: [], // TO-DO -> pass synths allong
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
        dragging: false
      };
      return loadedState;

    case "LOAD_SYNTHS":
      return {
        ...state,
        synths: action.synths
      };
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
    case "USER_LOGIN":
      return {
        ...state,
        error: "",
        user: { name: action.name, id: action.id }
      };
    case "USER_LOGOUT":
      return {
        ...state,
        error: "",
        user: {},
        synths: []
      };
    default:
      return state;
  }
};
