import { BlockData } from "../types/blockData";
import {
  InternalOscData,
  InternalGainData,
  InternalBiquadData
} from "../types/internalData";

export interface BlockProps {
  block: BlockData;
  allBlocks: Array<BlockData>;
  internal: InternalOscData | InternalGainData;
  allInternals: Array<InternalOscData | InternalGainData>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateBlock: (node: BlockData) => void;
  audioCtx: AudioContext;
}

export interface OscBlockProps extends BlockProps {
  block: BlockData;
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

export interface BiquadBlockProps extends BlockProps {
  block: BlockData;
  internal: InternalBiquadData;
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
  block: BlockData;
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
