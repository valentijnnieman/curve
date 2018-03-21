export interface NodeDataObject {
  id: number;
  type: OscillatorType;
  freq: number;
  output?: AudioDestinationNode | AudioParam;
  hasInputFrom?: number;
  connected: boolean;
  connectedToEl?: DOMRect;
  connectedFromEl?: DOMRect;
}
