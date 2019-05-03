import {
  InternalData,
  InternalBiquadData,
  InternalOscData
} from "./internalData";
export interface BlockDataOptions {
  id: string;
  x: number;
  y: number;
  blockType: "OSC" | "GAIN" | "BIQUAD" | "ENVELOPE" | "DESTINATION";
  type?: OscillatorType | BiquadFilterType;
  values: Array<number>;
  hasInternal: boolean;
  running?: boolean;
  hasInputFrom: Array<string>;
  connected: boolean;
  outputs: Array<OutputData>;
  gainInputDOMRect: DOMRect; // the DOM element we're connecing to (x2, y2 of line)
  freqInputDOMRect?: DOMRect; // the DOM element we're connecing to (x2, y2 of line)
  triggerInputDOMRect?: DOMRect; // the DOM element we're connecing to (x2, y2 of line)
  outputDOMRect?: DOMRect; // the DOM element we're connecint FROM (x1, y1 of line)
}
export interface BlockData extends BlockDataOptions {
  internal: InternalData | InternalOscData | InternalBiquadData;
}

export interface OutputData {
  id: number;
  isConnectedTo: string; // the id of the block we're connecting to
  connectedToType: "GAIN" | "GAIN_MOD" | "FREQ" | "DESTINATION" | "TRIGGER";
}
