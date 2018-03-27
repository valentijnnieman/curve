export interface NodeDataObject {
  id: number;
  type: OscillatorType;
  freq: number;
  output?: AudioDestinationNode | AudioParam;
  hasInternal: boolean;
  running: boolean;
  hasGainInput: boolean;
  hasFreqInput: boolean;
  hasInputFrom: Array<number>;
  isConnectedToOutput: boolean;
  isConnectedTo?: number;
  connected: boolean;
  connectedToType?: string;
  connectedToEl?: DOMRect;
  connectedFromEl?: DOMRect;
}

export interface GainDataObject {
  id: number;
  output?: AudioDestinationNode | AudioParam;
  hasInternal: boolean;
  gain: number;
  hasGainInput: boolean;
  hasInputFrom: Array<number>;
  isConnectedToOutput: boolean;
  isConnectedTo?: number;
  connected: boolean;
  connectedToType?: string;
  connectedToEl?: DOMRect;
  connectedFromEl?: DOMRect;
}
