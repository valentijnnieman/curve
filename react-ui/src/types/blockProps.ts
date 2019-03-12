import { BlockData } from "../types/blockData";
import { DraggableData } from "react-draggable";

// The props of the composed HOC - what we use in Editor.jsx
export interface ComposedBlockProps {
  block: BlockData;
  allBlocks: Array<BlockData>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateBlock: (node: BlockData) => void;
  deleteBlock: (id: number) => void;
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
    data: DraggableData,
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}

export interface BiquadBlockProps extends BlockProps {
  onDragHandler: (
    data: DraggableData,
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}

export interface GainBlockProps extends BlockProps {
  onDragHandler: (
    data: DraggableData,
    gainInputElement: DOMRect,
    outputElement: DOMRect
  ) => void;
}

export interface DestinationBlockProps extends BlockProps {
  onDragHandler: (data: DraggableData, gainInputElement: DOMRect) => void;
}

export interface EnvelopeBlockProps extends BlockProps {
  onDragHandler: (
    data: DraggableData,
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    triggerInputElement?: DOMRect
  ) => void;
}
