import { OscData, GainData } from "../types/blockData";

export interface StoreState {
  blocks: Array<OscData | GainData>;
}
