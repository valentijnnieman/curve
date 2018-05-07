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
  analyser.fftSize = 1024;
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
          // get block it's connected to
          const blockConnectedTo = blocks.find(
            b => b.id === output.isConnectedTo
          ) as BlockData;
          if (blockConnectedTo) {
            switch (output.connectedToType) {
              case "gain":
                inputDOMRect = blockConnectedTo.gainInputDOMRect;
                break;
              case "freq":
                inputDOMRect = blockConnectedTo.freqInputDOMRect as DOMRect;
                break;
              default:
                inputDOMRect = blockConnectedTo.gainInputDOMRect;
                break;
            }
          }
        }
        if (inputDOMRect) {
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
  blocks.map((block, index) => {
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
        if (block.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.map(output => {
            if (output.connectedToType === "gain" && output.isConnectedTo) {
              // get block it's connected to
              const blockConnectedTo = blocks.find(
                b => b.id === output.isConnectedTo
              ) as BlockData;
              if (blockConnectedTo && blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${
                  output.isConnectedTo
                });\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
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
gain${index}.gain.value = ${block.values[0]};`;
      if (block.connected) {
        if (block.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.map(output => {
            // get block it's connected to
            const blockConnectedTo = blocks.find(
              b => b.id === output.isConnectedTo
            ) as BlockData;
            if (
              blockConnectedTo &&
              output.connectedToType === "gain" &&
              output.isConnectedTo
            ) {
              if (blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${
                  output.isConnectedTo
                });\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
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
        if (block.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.map(output => {
            // get block it's connected to
            const blockConnectedTo = blocks.find(
              b => b.id === output.isConnectedTo
            ) as BlockData;
            if (
              blockConnectedTo &&
              output.connectedToType === "gain" &&
              output.isConnectedTo
            ) {
              if (blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${
                  output.isConnectedTo
                });\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
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
        if (block.isConnectedToOutput) {
          // connected to speakers
          connects += `gain${index}.connect(audioCtx.destination);\n`;
        } else {
          block.outputs.map(output => {
            // get block it's connected to
            const blockConnectedTo = blocks.find(
              b => b.id === output.isConnectedTo
            ) as BlockData;
            if (
              blockConnectedTo &&
              output.connectedToType === "gain" &&
              output.isConnectedTo
            ) {
              if (blockConnectedTo.blockType === "BIQUAD") {
                connects += `gain${index}.connect(filter${
                  output.isConnectedTo
                });\n`;
              } else if (blockConnectedTo.blockType === "GAIN") {
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
