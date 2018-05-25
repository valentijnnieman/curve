import { BlockData } from "../types/blockData";

export interface StoreState {
  name: string;
  slug: string;
  blocks: Array<BlockData>;
  audioCtx: AudioContext;
  error: string;
  success: string;
}
