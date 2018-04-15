import { OscData, GainData } from "../types/blockData";
import { InternalOscData, InternalGainData } from "../types/internalData";

export interface BlockProps {
  node: OscData | GainData;
  allNodes: Array<OscData | GainData>;
  internal: InternalOscData | InternalGainData;
  allInternals: Array<InternalOscData | InternalGainData>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateBlock: (node: OscData | GainData) => void;
  audioCtx: AudioContext;
}

export interface OscBlockProps extends BlockProps {
  node: OscData;
  internal: InternalOscData;
  connectToAnalyser: () => void;
  connectInternal: () => void;
  tryToConnect: (outputElement: DOMRect) => void;
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
  checkInputs: (outputType: string) => string;
}

export interface GainBlockProps extends BlockProps {
  node: GainData;
  internal: InternalGainData;
  connectToAnalyser: () => void;
  connectInternal: () => void;
  tryToConnect: (outputElement: DOMRect) => void;
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
  checkInputs: (outputType: string) => string;
}
