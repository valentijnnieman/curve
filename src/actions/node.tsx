import { OscDataObject, GainDataObject } from "../types/nodeObject";

// export interface CreateSynthAction {
//   type: "CREATE_SYNTH";
//   newSynth: SynthObject;
// }

export interface UpdateNodeAction {
  type: "UPDATE_NODE";
  node: OscDataObject | GainDataObject;
}

export interface CreateNodeAction {
  type: "CREATE_NODE";
  node: OscDataObject | GainDataObject;
}

export function updateNode(
  node: OscDataObject | GainDataObject
): UpdateNodeAction {
  return {
    type: "UPDATE_NODE",
    node
  };
}

export function createNode(
  node: OscDataObject | GainDataObject
): CreateNodeAction {
  return {
    type: "CREATE_NODE",
    node
  };
}
