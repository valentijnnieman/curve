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
      hasInput: false,
      hasInputFrom: [],
      isConnectedTo: undefined,
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
      hasInput: false,
      hasInputFrom: [],
      isConnectedTo: undefined,
      connected: false,
      connectedToEl: undefined,
      connectedFromEl: undefined
    },
    {
      id: 2,
      gain: 1,
      output: undefined,
      hasInternal: false,
      hasInput: false,
      hasInputFrom: [],
      isConnectedTo: undefined,
      connected: false,
      connectedToEl: undefined,
      connectedFromEl: undefined
    }
  ],
  outputData: {
    id: 999,
    gain: 1,
    output: undefined,
    hasInternal: false,
    hasInput: false,
    hasInputFrom: [],
    connected: false,
    connectedToEl: undefined,
    connectedFromEl: undefined
  }
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
