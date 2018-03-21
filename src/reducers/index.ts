import { StoreState } from "../models/storeState";

const initialState = {
  nodeData: [
    {
      id: 0,
      type: "sine" as OscillatorType,
      freq: 4,
      output: undefined,
      running: false,
      connected: false,
      hasInputFrom: undefined,
      connectedToEl: undefined,
      connectedFromEl: undefined
    },
    {
      id: 1,
      type: "square" as OscillatorType,
      freq: 330,
      output: undefined,
      running: false,
      hasInputFrom: undefined,
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
    default:
      return state;
  }
};
