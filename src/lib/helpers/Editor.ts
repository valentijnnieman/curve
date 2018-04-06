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
        y2: node.connectedToEl.y + node.connectedToEl.height / 2 // .height not picked up here for some reason
      };
      allNewLines.push(newLineCoords);
    }
  });
  return allNewLines;
};

// Generates web audio code from internals (experimental)
export const genWACode = (
  nodeData: Array<NodeDataObject | GainDataObject>,
  internals: Array<InternalObject | InternalGainObject>
) => {
  let jsString: string =
      "const audioCtx = new AudioContext(); // define audio context\n\n",
    connects: string = "";
  internals.map((internal, index) => {
    // get nodeData object for more info like output
    let node = nodeData[index];
    if ("oscillator" in internal && "freq" in node) {
      jsString += `// Creating oscillator node
let osc${index} = audioCtx.createOscillator();
osc${index}.type = "${internal.oscillator.type}";
osc${index}.frequency.setValueAtTime(${node.freq}, audioCtx.currentTime);
// create a internal gain used with oscillator object
let gain${index} = audioCtx.createGain();
gain${index}.gain.value = 1;
osc${index}.connect(gain${index});
osc${index}.start();`;
      if (node.connected) {
        if (node.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          if (node.connectedToType === "gain" && node.isConnectedTo) {
            if ("gain" in nodeData[node.isConnectedTo]) {
              connects += `gain${index}.connect(gain${node.isConnectedTo});\n`;
            } else {
              connects += `gain${index}.connect(gain${
                node.isConnectedTo
              }.gain);\n`;
            }
          } else if (node.connectedToType === "freq") {
            connects += `gain${index}.connect(osc${
              node.isConnectedTo
            }.frequency);\n`;
          }
        }
      }
      jsString += "\n\n";
    } else if ("gain" in internal && "gain" in node) {
      jsString += `let gain${index} = audioCtx.createGain();
gain${index}.gain.value = ${node.gain};`;
      if (node.connected) {
        if (node.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          if (node.connectedToType === "gain" && node.isConnectedTo) {
            if ("gain" in nodeData[node.isConnectedTo]) {
              connects += `gain${index}.connect(gain${node.isConnectedTo});\n`;
            } else {
              connects += `gain${index}.connect(gain${
                node.isConnectedTo
              }.gain);\n`;
            }
          } else if (node.connectedToType === "freq") {
            connects += `gain${index}.connect(osc${
              node.isConnectedTo
            }.frequency);\n`;
          }
        }
      }
      jsString += "\n\n";
    }
  });
  return (jsString += connects);
};
