import {
  InternalData,
  InternalBiquadData,
  InternalOscData
} from "./internalData";
export interface BlockDataOptions {
  id: number;
  blockType: "OSC" | "GAIN" | "BIQUAD";
  type?: OscillatorType | BiquadFilterType;
  values: Array<number>;
  hasInternal: boolean;
  running?: boolean;
  hasInputFrom: Array<number>;
  connected: boolean;
  isConnectedToOutput: boolean;
  outputs: Array<OutputData>;
  gainInputDOMRect: DOMRect; // the DOM element we're connecing to (x2, y2 of line)
  freqInputDOMRect?: DOMRect; // the DOM element we're connecing to (x2, y2 of line)
  outputDOMRect: DOMRect; // the DOM element we're connecint FROM (x1, y1 of line)
}
export interface BlockData extends BlockDataOptions {
  internal: InternalData | InternalOscData | InternalBiquadData;
}

export interface OutputData {
  id: number;
  destination: AudioDestinationNode | AudioParam; // the web audio node we're connecting to
  isConnectedTo: number; // the id of the block we're connecting to
  connectedToType: "gain" | "freq"; // which parameter of the block we're connecting to
}
