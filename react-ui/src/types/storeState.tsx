import { BlockData } from "../types/blockData";

export interface StoreState {
  user: object;
  name: string;
  slug: string;
  blocks: Array<BlockData>;
  audioCtx: AudioContext;
  error: string;
  success: string;
  lastId: number;
}
