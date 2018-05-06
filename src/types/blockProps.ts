import { BlockData } from "../types/blockData";

// The props of the composed HOC - what we use in Editor.jsx
export interface ComposedBlockProps {
  block: BlockData;
  allBlocks: Array<BlockData>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateBlock: (node: BlockData) => void;
  audioCtx: AudioContext;
}

// common props between blocks - extends the composed block's props
export interface BlockProps extends ComposedBlockProps {
  block: BlockData;
  connectToAnalyser: () => void;
  connectInternal: () => void;
  tryToConnect: (outputElement: DOMRect) => void;
  checkInputs: (outputType: string) => string;
  onDragHandler: any;
}

// block specific props - not all blocks have a freqInputElement for example
export interface OscBlockProps extends BlockProps {
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}

export interface BiquadBlockProps extends BlockProps {
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}

export interface GainBlockProps extends BlockProps {
  onDragHandler: (gainInputElement: DOMRect, outputElement: DOMRect) => void;
}

export interface EnvelopeBlockProps extends BlockProps {
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}
