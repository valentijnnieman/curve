import { NodeDataObject, GainDataObject } from "../types/nodeObject";

export interface StoreState {
  nodeData: Array<NodeDataObject | GainDataObject>;
}
