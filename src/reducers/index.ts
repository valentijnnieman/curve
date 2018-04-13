import { StoreState } from "../types/storeState";

const initialState = {
  nodeData: [
    {
      id: 0,
      type: "sine" as OscillatorType,
      freq: 220,
      hasInternal: false,
      running: false,
      connected: false,
      hasGainInput: false,
      hasFreqInput: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      outputs: [],
      gainInputDOMRect: new DOMRect(0, 0, 0, 0),
      freqInputDOMRect: new DOMRect(0, 0, 0, 0),
      outputDOMRect: new DOMRect(0, 0, 0, 0)
    },
    {
      id: 1,
      type: "square" as OscillatorType,
      freq: 330,
      hasInternal: false,
      running: false,
      hasGainInput: false,
      hasFreqInput: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      connected: false,
      outputs: [],
      gainInputDOMRect: new DOMRect(0, 0, 0, 0),
      freqInputDOMRect: new DOMRect(0, 0, 0, 0),
      outputDOMRect: new DOMRect(0, 0, 0, 0)
    },
    {
      id: 2,
      gain: 1,
      hasInternal: false,
      hasGainInput: false,
      hasInputFrom: [],
      isConnectedToOutput: false,
      connected: false,
      outputs: [],
      gainInputDOMRect: new DOMRect(0, 0, 0, 0),
      outputDOMRect: new DOMRect(0, 0, 0, 0)
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
