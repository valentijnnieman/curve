import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

export interface BlockProps {
  node: NodeDataObject | GainDataObject;
  allNodes: Array<NodeDataObject | GainDataObject>;
  internal: InternalObject | InternalGainObject;
  allInternals: Array<InternalObject | InternalGainObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
  audioCtx: AudioContext;
}

export interface OscBlockProps extends BlockProps {
  node: NodeDataObject;
  internal: InternalObject;
  connectToAnalyser: () => void;
  connectInternal: () => void;
  tryToConnect: (outputElement: DOMRect) => void;
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}

export interface GainBlockProps extends BlockProps {
  node: GainDataObject;
  internal: InternalGainObject;
  connectToAnalyser: () => void;
  connectInternal: () => void;
  tryToConnect: (outputElement: DOMRect) => void;
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}
