import { BlockData } from "../../types/blockData";
import {
  InternalOscData,
  InternalGainData,
  InternalBiquadData
} from "../../types/internalData";
import { Line } from "../../types/lineData";

// builds internal objects from blocks used with web audio api
export const buildInternals = (
  blocks: Array<BlockData>,
  audioCtx: AudioContext,
  updateBlock: (block: BlockData) => void,
  internals: Array<InternalOscData | InternalGainData | InternalBiquadData>
) => {
  blocks.map((block, index) => {
    if (block.hasInternal) {
      // block already has an internal - no need to create new internals
    } else {
      let gain = audioCtx.createGain();
      gain.gain.value = 1;
      let analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      if (block.blockType === "OSC") {
        let oscillator;
        oscillator = audioCtx.createOscillator();
        oscillator.type = block.type as OscillatorType;
        oscillator.frequency.setValueAtTime(block.value, audioCtx.currentTime);
        const newOscInternal = {
          id: index,
          oscillator,
          gain,
          analyser
        };
        internals.push(newOscInternal);
      } else if (block.blockType === "GAIN") {
        const newGainInternal = {
          id: index,
          gain,
          analyser
        };
        internals.push(newGainInternal);
      } else if (block.blockType === "BIQUAD") {
        let biquadFilter;
        biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = block.type as BiquadFilterType;
        biquadFilter.frequency.setValueAtTime(
          block.value,
          audioCtx.currentTime
        );
        const newBiquadInternal = {
          id: index,
          filter: biquadFilter,
          gain,
          analyser
        };
        internals.push(newBiquadInternal);
      }
      // update the blocks object now that we build an internal
      updateBlock({
        ...block,
        hasInternal: true
      });
    }
  });
  return internals;
};

// draws lines between connected blocks
export const drawConnectionLines = (
  blocks: Array<BlockData>,
  speakersDOMRect: DOMRect
) => {
  let allNewLines: Array<Line> = [];
  blocks.map(block => {
    if (block.connected) {
      block.outputs.map(output => {
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
              inputDOMRect = blocks[output.isConnectedTo]
                .freqInputDOMRect as DOMRect;
              break;
            default:
              inputDOMRect = blocks[output.isConnectedTo].gainInputDOMRect;
              break;
          }
        }
        const newLineCoords = {
          x1: block.outputDOMRect.x + block.outputDOMRect.width / 2,
          y1: block.outputDOMRect.y + block.outputDOMRect.height / 2,
          x2: inputDOMRect.x,
          y2: inputDOMRect.y + inputDOMRect.height / 2,
          fromBlock: block.id,
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
  blocks: Array<BlockData>,
  internals: Array<InternalOscData | InternalGainData>
) => {
  let jsString: string =
      "const audioCtx = new AudioContext(); // define audio context\n\n",
    connects: string = "";
  internals.map((internal, index) => {
    // get blocks object for more info like output
    let block = blocks[index];
    if (block && block.blockType === "OSC") {
      jsString += `// Creating oscillator block
let osc${index} = audioCtx.createOscillator();
osc${index}.type = "${(internal as InternalOscData).oscillator.type}";
osc${index}.frequency.setValueAtTime(${block.value}, audioCtx.currentTime);
// create a internal gain used with oscillator object
let gain${index} = audioCtx.createGain();
gain${index}.gain.value = 1;
osc${index}.connect(gain${index});
osc${index}.start();`;
      if (block.connected) {
        if (block.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.map(output => {
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
    } else if (block && block.blockType === "GAIN") {
      jsString += `let gain${index} = audioCtx.createGain();
gain${index}.gain.value = ${block.value};`;
      if (block.connected) {
        if (block.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.map(output => {
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
