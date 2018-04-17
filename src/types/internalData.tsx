export interface InternalOscData {
  oscillator: OscillatorNode;
  gain: GainNode;
  analyser: AnalyserNode;
}
export interface InternalBiquadData {
  filter: BiquadFilterNode;
  gain: GainNode;
  analyser: AnalyserNode;
}

export interface InternalGainData {
  gain: GainNode;
  analyser: AnalyserNode;
}
