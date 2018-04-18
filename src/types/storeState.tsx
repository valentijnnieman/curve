import { BlockData } from "../types/blockData";

export interface StoreState {
  blocks: Array<BlockData>;
  audioCtx: AudioContext;
}
