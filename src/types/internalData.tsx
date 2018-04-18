export interface InternalData {
  gain: GainNode;
  analyser: AnalyserNode;
}
export interface InternalOscData extends InternalData {
  oscillator: OscillatorNode;
}
export interface InternalBiquadData extends InternalData {
  filter: BiquadFilterNode;
}
