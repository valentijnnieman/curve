export interface NodeDataObject {
  id: number;
  type: OscillatorType;
  freq: number;
  output?: AudioDestinationNode | AudioParam;
  running: boolean;
  hasInput: boolean;
  hasInputFrom?: number;
  connected: boolean;
  connectedToEl?: DOMRect;
  connectedFromEl?: DOMRect;
}
