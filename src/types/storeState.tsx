import { OscDataObject, GainDataObject } from "../types/nodeObject";

export interface StoreState {
  nodeData: Array<OscDataObject | GainDataObject>;
}
