import { OscData, GainData } from "../types/blockData";

// export interface CreateSynthAction {
//   type: "CREATE_SYNTH";
//   newSynth: SynthObject;
// }

export interface UpdateBlockAction {
  type: "UPDATE_BLOCK";
  block: OscData | GainData;
}

export interface CreateBlockAction {
  type: "CREATE_BLOCK";
  block: OscData | GainData;
}

export function updateBlock(block: OscData | GainData): UpdateBlockAction {
  return {
    type: "UPDATE_BLOCK",
    block
  };
}

export function createBlock(block: OscData | GainData): CreateBlockAction {
  return {
    type: "CREATE_BLOCK",
    block
  };
}
