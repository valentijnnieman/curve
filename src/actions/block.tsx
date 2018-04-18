import { BlockData } from "../types/blockData";

// export interface CreateSynthAction {
//   type: "CREATE_SYNTH";
//   newSynth: SynthObject;
// }

export interface UpdateBlockAction {
  type: "UPDATE_BLOCK";
  block: BlockData;
}

export interface CreateBlockAction {
  type: "CREATE_BLOCK";
  block: BlockData;
}

export function updateBlock(block: BlockData): UpdateBlockAction {
  return {
    type: "UPDATE_BLOCK",
    block
  };
}

export function createBlock(block: BlockData): CreateBlockAction {
  return {
    type: "CREATE_BLOCK",
    block
  };
}
