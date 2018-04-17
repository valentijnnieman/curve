import { StoreState } from "../types/storeState";
import { BlockData } from "../types/blockData";

const initialState = {
  blocks: [
    {
      id: 0,
      blockType: "OSC",
      type: "sine" as OscillatorType,
      value: 220,
      hasInternal: false,
      running: false,
      connected: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      outputs: [],
      gainInputDOMRect: new DOMRect(0, 0, 0, 0),
      freqInputDOMRect: new DOMRect(0, 0, 0, 0),
      outputDOMRect: new DOMRect(0, 0, 0, 0)
    } as BlockData,
    {
      id: 1,
      blockType: "OSC",
      type: "square" as OscillatorType,
      value: 330,
      hasInternal: false,
      running: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      connected: false,
      outputs: [],
      gainInputDOMRect: new DOMRect(0, 0, 0, 0),
      freqInputDOMRect: new DOMRect(0, 0, 0, 0),
      outputDOMRect: new DOMRect(0, 0, 0, 0)
    } as BlockData,
    {
      id: 2,
      blockType: "GAIN",
      value: 1,
      hasInternal: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      connected: false,
      outputs: [],
      gainInputDOMRect: new DOMRect(0, 0, 0, 0),
      outputDOMRect: new DOMRect(0, 0, 0, 0)
    } as BlockData
  ]
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
