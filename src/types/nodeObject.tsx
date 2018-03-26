export interface NodeDataObject {
  id: number;
  type: OscillatorType;
  freq: number;
  output?: AudioDestinationNode | AudioParam;
  hasInternal: boolean;
  running: boolean;
  hasInput: boolean;
  hasInputFrom: Array<number>;
  isConnectedToOutput: boolean;
  isConnectedTo?: number;
  connected: boolean;
  connectedToEl?: DOMRect;
  connectedFromEl?: DOMRect;
}

export interface GainDataObject {
  id: number;
  output?: AudioDestinationNode | AudioParam;
  hasInternal: boolean;
  gain: number;
  hasInput: boolean;
  hasInputFrom: Array<number>;
  isConnectedToOutput: boolean;
  isConnectedTo?: number;
  connected: boolean;
  connectedToEl?: DOMRect;
  connectedFromEl?: DOMRect;
}
