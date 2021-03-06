import { BlockData, BlockDataOptions } from "../../types/blockData";
import { InternalOscData, InternalBiquadData } from "../../types/internalData";
import { Line } from "../../types/lineData";

// builds internal object from block used with web audio api
export const buildInternal = (
  block: BlockDataOptions,
  audioCtx: AudioContext
) => {
  let gain = audioCtx.createGain();
  gain.gain.value = 1;
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  if (block.blockType === "OSC") {
    let oscillator;
    oscillator = audioCtx.createOscillator();
    oscillator.type = block.type as OscillatorType;
    oscillator.frequency.setValueAtTime(block.values[0], audioCtx.currentTime);
    const newOscInternal = {
      oscillator,
      gain,
      analyser
    };
    return newOscInternal;
  } else if (block.blockType === "GAIN") {
    gain.gain.value = block.values[0]; // a gain block has a controllable gain parameter
    const newGainInternal = {
      gain,
      analyser
    };
    return newGainInternal;
  } else if (block.blockType === "ENVELOPE") {
    gain.gain.value = 0; // an envelope will control it's own gain
    const newGainInternal = {
      gain,
      analyser
    };
    return newGainInternal;
  } else if (block.blockType === "BIQUAD") {
    let filter;
    filter = audioCtx.createBiquadFilter();
    filter.type = block.type as BiquadFilterType;
    filter.frequency.setValueAtTime(block.values[0], audioCtx.currentTime);
    filter.Q.setValueAtTime(block.values[1], audioCtx.currentTime);
    const newBiquadInternal = {
      filter: filter,
      gain,
      analyser
    } as InternalBiquadData;
    return newBiquadInternal;
  } else {
    // default
    const newGainInternal = {
      gain,
      analyser
    };
    return newGainInternal;
  }
};

// draws lines between connected blocks
export const drawConnectionLines = (blocks: Array<BlockData>) => {
  let allNewLines: Array<Line> = [];
  blocks.forEach(block => {
    if (block.connected) {
      block.outputs.forEach(output => {
        let inputDOMRect;
        // get block it's connected to
        const blockConnectedTo = blocks.find(
          b => b.id === output.isConnectedTo
        ) as BlockData;
        if (blockConnectedTo) {
          switch (output.connectedToType) {
            case "GAIN" || "GAIN_MOD":
              inputDOMRect = blockConnectedTo.gainInputDOMRect;
              break;
            case "FREQ":
              inputDOMRect = blockConnectedTo.freqInputDOMRect as DOMRect;
              break;
            case "TRIGGER":
              inputDOMRect = blockConnectedTo.triggerInputDOMRect as DOMRect;
              break;
            default:
              inputDOMRect = blockConnectedTo.gainInputDOMRect;
              break;
          }
        }
        if (inputDOMRect && block.outputDOMRect) {
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
        }
      });
    }
  });
  return allNewLines;
};

// Generates web audio code from internals (experimental)
export const genWACode = (blocks: Array<BlockData>) => {
  let jsString: string =
      "const audioCtx = new AudioContext(); // define audio context\n\n",
    connects: string = "";
  blocks.forEach((block, index) => {
    // get blocks object for more info like output
    const internal = block.internal;
    if (block && block.blockType === "OSC") {
      jsString += `// Creating oscillator block
let osc${index} = audioCtx.createOscillator();
osc${index}.type = "${(internal as InternalOscData).oscillator.type}";
osc${index}.frequency.setValueAtTime(${block.values[0]}, audioCtx.currentTime);
// create a internal gain used with oscillator object
let gain${index} = audioCtx.createGain();
gain${index}.gain.value = 1;
osc${index}.connect(gain${index});
osc${index}.start();`;
      if (block.connected) {
        if (
          block.outputs.filter(
            output => output.connectedToType === "DESTINATION"
          ).length > 0
        ) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.forEach(output => {
            if (output.connectedToType === "GAIN" && output.isConnectedTo) {
              // get block it's connected to
              const blockConnectedTo = blocks.find(
                b => b.id === output.isConnectedTo
              ) as BlockData;
              if (blockConnectedTo && blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${output.isConnectedTo});\n`;
              } else if (
                blockConnectedTo &&
                blockConnectedTo.blockType === "GAIN"
              ) {
                connects += `gain${index}.connect(gain${output.isConnectedTo});\n`;
              } else {
                connects += `gain${index}.connect(gain${output.isConnectedTo}.gain);\n`;
              }
            } else if (output.connectedToType === "FREQ") {
              connects += `gain${index}.connect(osc${output.isConnectedTo}.frequency);\n`;
            }
          });
        }
      }
      jsString += "\n\n";
    } else if (block && block.blockType === "GAIN") {
      jsString += `let gain${index} = audioCtx.createGain();
gain${index}.gain.value = ${block.values[0]};`;
      if (block.connected) {
        if (
          block.outputs.filter(
            output => output.connectedToType === "DESTINATION"
          ).length > 0
        ) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.forEach(output => {
            // get block it's connected to
            const blockConnectedTo = blocks.find(
              b => b.id === output.isConnectedTo
            ) as BlockData;
            if (
              blockConnectedTo &&
              output.connectedToType === "GAIN" &&
              output.isConnectedTo
            ) {
              if (blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${output.isConnectedTo});\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
                connects += `gain${index}.connect(gain${output.isConnectedTo});\n`;
              } else {
                connects += `gain${index}.connect(gain${output.isConnectedTo}.gain);\n`;
              }
            } else if (output.connectedToType === "FREQ") {
              connects += `gain${index}.connect(osc${output.isConnectedTo}.frequency);\n`;
            }
          });
        }
      }
      jsString += "\n\n";
    } else if (block && block.blockType === "BIQUAD") {
      jsString += `// Creating filter block
let filter${index} = audioCtx.createBiquadFilter();
filter${index}.type = "${(internal as InternalBiquadData).filter.type}";
filter${index}.frequency.setValueAtTime(${
        block.values[0]
      }, audioCtx.currentTime);
filter${index}.Q.setValueAtTime(${block.values[1]}, audioCtx.currentTime);
// create a internal gain used with oscillator object
let gain${index} = audioCtx.createGain();
gain${index}.gain.value = 1;
filter${index}.connect(gain${index});`;
      if (block.connected) {
        if (
          block.outputs.filter(
            output => output.connectedToType === "DESTINATION"
          ).length > 0
        ) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.forEach(output => {
            // get block it's connected to
            const blockConnectedTo = blocks.find(
              b => b.id === output.isConnectedTo
            ) as BlockData;
            if (
              blockConnectedTo &&
              output.connectedToType === "GAIN" &&
              output.isConnectedTo
            ) {
              if (blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${output.isConnectedTo});\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
                connects += `gain${index}.connect(gain${output.isConnectedTo});\n`;
              } else {
                connects += `gain${index}.connect(gain${output.isConnectedTo}.gain);\n`;
              }
            } else if (output.connectedToType === "FREQ") {
              connects += `gain${index}.connect(osc${output.isConnectedTo}.frequency);\n`;
            }
          });
        }
      }
      jsString += "\n\n";
    } else if (block && block.blockType === "ENVELOPE") {
      jsString += `// Creating envelope block
let envelope${index} = {
  attack: ${block.values[0]},
  decay: ${block.values[0]},
  sustain: ${block.values[0]},
  release: ${block.values[0]}
};

// create a internal gain used with envelope object
let gain${index} = audioCtx.createGain();
gain${index}.gain.value = 0;

envelope${index}.trigger = function() {
    const { attack, decay, sustain, release } = envelope${index};
    const now = audioCtx.currentTime;
    gain${index}.gain.cancelScheduledValues(now);
    gain${index}.gain.setValueAtTime(0, now);
    gain${index}.gain.linearRampToValueAtTime(1, now + attack);
    gain${index}.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    gain${index}.gain.linearRampToValueAtTime(0, now + attack + decay + release);
}`;

      if (block.connected) {
        if (
          block.outputs.filter(
            output => output.connectedToType === "DESTINATION"
          ).length > 0
        ) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.forEach(output => {
            // get block it's connected to
            const blockConnectedTo = blocks.find(
              b => b.id === output.isConnectedTo
            ) as BlockData;
            if (
              blockConnectedTo &&
              output.connectedToType === "GAIN" &&
              output.isConnectedTo
            ) {
              if (blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${output.isConnectedTo});\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
                connects += `gain${index}.connect(gain${output.isConnectedTo});\n`;
              } else {
                connects += `gain${index}.connect(gain${output.isConnectedTo}.gain);\n`;
              }
            } else if (output.connectedToType === "FREQ") {
              connects += `gain${index}.connect(osc${output.isConnectedTo}.frequency);\n`;
            }
          });
        }
      }
      jsString += "\n\n";
    }
  });
  return (jsString += connects);
};
