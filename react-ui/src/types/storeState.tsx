import { BlockData } from "../types/blockData";

export interface StoreState {
  user: object;
  name: string;
  slug: string;
  blocks: Array<BlockData>;
  synths: Array<string>;
  audioCtx: AudioContext;
  error: string;
  success: string;
  dragging: boolean;
}
