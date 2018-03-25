import { NodeDataObject, GainDataObject } from "../types/nodeObject";

// export interface CreateSynthAction {
//   type: "CREATE_SYNTH";
//   newSynth: SynthObject;
// }

export interface UpdateNodeAction {
  type: "UPDATE_NODE";
  node: NodeDataObject | GainDataObject;
}

// export function createSynth(newSynth: SynthObject): CreateSynthAction {
//   return {
//     type: "CREATE_SYNTH",
//     newSynth
//   };
// }
export function updateNode(
  node: NodeDataObject | GainDataObject
): UpdateNodeAction {
  return {
    type: "UPDATE_NODE",
    node
  };
}
