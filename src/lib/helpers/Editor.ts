import { OscData, GainData } from "../../types/blockData";
import { InternalOscData, InternalGainData } from "../../types/internalData";
import { Line } from "../../types/lineData";

// builds internal objects from blocks used with web audio api
export const buildInternals = (
  blocks: Array<OscData | GainData>,
  audioCtx: AudioContext,
  updateBlock: (node: OscData | GainData) => void,
  internals: Array<InternalOscData | InternalGainData>
) => {
  blocks.map((node, index) => {
    if (node.hasInternal) {
      // node already has an internal - no need to create new internals
    } else {
      let gain = audioCtx.createGain();
      gain.gain.value = 1;
      let analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
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
      // update the blocks object now that we build an internal
      updateBlock({
        ...node,
        hasInternal: true
      });
    }
  });
  return internals;
};

// draws lines between connected nodes
export const drawConnectionLines = (
  blocks: Array<OscData | GainData>,
  speakersDOMRect: DOMRect
) => {
  let allNewLines: Array<Line> = [];
  blocks.map(node => {
    if (node.connected) {
      node.outputs.map(output => {
        let inputDOMRect;
        if (output.isConnectedTo === -1) {
          // if it's smaller than 0 it's connected to the output (speakers)
          inputDOMRect = speakersDOMRect;
        } else {
          switch (output.connectedToType) {
            case "gain":
              inputDOMRect = blocks[output.isConnectedTo].gainInputDOMRect;
              break;
            case "freq":
              inputDOMRect = (blocks[output.isConnectedTo] as OscData)
                .freqInputDOMRect;
              break;
            default:
              inputDOMRect = blocks[output.isConnectedTo].gainInputDOMRect;
              break;
          }
        }
        const newLineCoords = {
          x1: node.outputDOMRect.x + node.outputDOMRect.width / 2,
          y1: node.outputDOMRect.y + node.outputDOMRect.height / 2,
          x2: inputDOMRect.x,
          y2: inputDOMRect.y + inputDOMRect.height / 2,
          fromBlock: node.id,
          toBlock: output.isConnectedTo,
          outputId: output.id
        };
        allNewLines.push(newLineCoords);
      });
    }
  });
  return allNewLines;
};

// Generates web audio code from internals (experimental)
export const genWACode = (
  blocks: Array<OscData | GainData>,
  internals: Array<InternalOscData | InternalGainData>
) => {
  let jsString: string =
      "const audioCtx = new AudioContext(); // define audio context\n\n",
    connects: string = "";
  internals.map((internal, index) => {
    // get blocks object for more info like output
    let node = blocks[index];
    if (node && "oscillator" in internal && "freq" in node) {
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
          node.outputs.map(output => {
            if (output.connectedToType === "gain" && output.isConnectedTo) {
              if ("gain" in blocks[output.isConnectedTo]) {
                connects += `gain${index}.connect(gain${
                  output.isConnectedTo
                });\n`;
              } else {
                connects += `gain${index}.connect(gain${
                  output.isConnectedTo
                }.gain);\n`;
              }
            } else if (output.connectedToType === "freq") {
              connects += `gain${index}.connect(osc${
                output.isConnectedTo
              }.frequency);\n`;
            }
          });
        }
      }
      jsString += "\n\n";
    } else if (node && "gain" in internal && "gain" in node) {
      jsString += `let gain${index} = audioCtx.createGain();
gain${index}.gain.value = ${node.gain};`;
      if (node.connected) {
        if (node.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          node.outputs.map(output => {
            if (output.connectedToType === "gain" && output.isConnectedTo) {
              if ("gain" in blocks[output.isConnectedTo]) {
                connects += `gain${index}.connect(gain${
                  output.isConnectedTo
                });\n`;
              } else {
                connects += `gain${index}.connect(gain${
                  output.isConnectedTo
                }.gain);\n`;
              }
            } else if (output.connectedToType === "freq") {
              connects += `gain${index}.connect(osc${
                output.isConnectedTo
              }.frequency);\n`;
            }
          });
        }
      }
      jsString += "\n\n";
    }
  });
  return (jsString += connects);
};
