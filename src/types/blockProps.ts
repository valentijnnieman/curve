import { OscDataObject, GainDataObject } from "../types/nodeObject";
import { InternalOscObject, InternalGainObject } from "../types/internalObject";

export interface BlockProps {
  node: OscDataObject | GainDataObject;
  allNodes: Array<OscDataObject | GainDataObject>;
  internal: InternalOscObject | InternalGainObject;
  allInternals: Array<InternalOscObject | InternalGainObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: OscDataObject | GainDataObject) => void;
  audioCtx: AudioContext;
}

export interface OscBlockProps extends BlockProps {
  node: OscDataObject;
  internal: InternalOscObject;
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
