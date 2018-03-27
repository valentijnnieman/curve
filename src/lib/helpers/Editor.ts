import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { InternalObject, InternalGainObject } from "../../types/internalObject";
import { Line } from "../../types/lineObject";

// builds internal objects from nodeData used with web audio api
export const buildInternals = (
  nodeData: Array<NodeDataObject | GainDataObject>,
  audioCtx: AudioContext,
  updateNode: (node: NodeDataObject | GainDataObject) => void,
  internals: Array<InternalObject | InternalGainObject>
) => {
  nodeData.map((node, index) => {
    if (node.hasInternal) {
      // node already has an internal - no need to create new internals
    } else {
      let gain = audioCtx.createGain();
      gain.gain.value = 1;
      let analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      if ("freq" in node) {
        let oscillator;
        oscillator = audioCtx.createOscillator();
        oscillator.type = node.type;
        oscillator.frequency.setValueAtTime(node.freq, audioCtx.currentTime);
        const newOscInternal = {
          id: index,
          oscillator,
          gain,
          analyser
        };
        internals.push(newOscInternal);
      } else if ("gain" in node) {
        const newGainInternal = {
          id: index,
          gain,
          analyser
        };
        internals.push(newGainInternal);
      }
      // update the nodeData object now that we build an internal
      updateNode({
        ...node,
        hasInternal: true
      });
    }
  });
  return internals;
};

// draws lines between connected nodes
export const drawConnectionLines = (
  nodeData: Array<NodeDataObject | GainDataObject>
) => {
  let allNewLines: Array<Line> = [];
  nodeData.map(node => {
    if (node.connected && node.connectedFromEl && node.connectedToEl) {
      const newLineCoords = {
        x1: node.connectedFromEl.x + node.connectedFromEl.width / 2,
        y1: node.connectedFromEl.y + node.connectedFromEl.height / 2,
        x2: node.connectedToEl.x,
        y2: node.connectedToEl.y + 12 // .height not picked up here for some reason
      };
      allNewLines.push(newLineCoords);
    }
  });
  return allNewLines;
};
