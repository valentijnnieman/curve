import { BlockData } from "../types/blockData";

export interface BlockProps {
  block: BlockData;
  allBlocks: Array<BlockData>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateBlock: (node: BlockData) => void;
  audioCtx: AudioContext;
}

export interface OscBlockProps extends BlockProps {
  block: BlockData;
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
