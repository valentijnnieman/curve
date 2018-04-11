import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

export interface BlockProps {
  node: NodeDataObject;
  allNodes: Array<NodeDataObject | GainDataObject>;
  internal: InternalObject;
  allInternals: Array<InternalObject | InternalGainObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
  audioCtx: AudioContext;
}

export interface ComposedBlockProps extends BlockProps {
  connectToAnalyser: () => void;
  connectInternal: () => void;
  onDragHandler: (
    gainInputElement: DOMRect,
    outputElement: DOMRect,
    freqInputElement?: DOMRect
  ) => void;
}
