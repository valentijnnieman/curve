import { NodeDataObject } from "../models/nodeObject";

// export interface CreateSynthAction {
//   type: "CREATE_SYNTH";
//   newSynth: SynthObject;
// }

export interface UpdateNodeAction {
  type: "UPDATE_NODE";
  node: NodeDataObject;
}

// export function createSynth(newSynth: SynthObject): CreateSynthAction {
//   return {
//     type: "CREATE_SYNTH",
//     newSynth
//   };
// }
export function updateNode(node: NodeDataObject): UpdateNodeAction {
  return {
    type: "UPDATE_NODE",
    node
  };
}
