import { StoreState } from "../types/storeState";

const initialState = {
  nodeData: [
    {
      id: 0,
      type: "sine" as OscillatorType,
      freq: 4,
      output: undefined,
      hasInternal: false,
      running: false,
      connected: false,
      hasGainInput: false,
      hasFreqInput: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      isConnectedTo: undefined,
      connectedToType: undefined,
      connectedToEl: undefined,
      connectedFromEl: undefined
    },
    {
      id: 1,
      type: "square" as OscillatorType,
      freq: 330,
      output: undefined,
      hasInternal: false,
      running: false,
      hasGainInput: false,
      hasFreqInput: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      isConnectedTo: undefined,
      connected: false,
      connectedToType: undefined,
      connectedToEl: undefined,
      connectedFromEl: undefined
    },
    {
      id: 2,
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
  ]
};

export default (state: StoreState = initialState, action: any): StoreState => {
  switch (action.type) {
    case "UPDATE_NODE":
      return {
        ...state,
        nodeData: state.nodeData.map(node => {
          if (node.id === action.node.id) {
            return action.node;
          }
          return node;
        })
      };
    case "CREATE_NODE":
      return {
        ...state,
        nodeData: [
          ...state.nodeData,
          { ...action.node, id: state.nodeData.length }
        ]
      };
    default:
      return state;
  }
};
