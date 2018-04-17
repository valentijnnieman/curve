import "./Editor";
import "web-audio-test-api";
import { buildInternals, drawConnectionLines, genWACode } from "./Editor";
import { BlockData } from "../../types/blockData";
import { InternalOscData, InternalGainData } from "../../types/internalData";
import { Line } from "../../types/lineData";
import { audioCtx, mockblocks, speakersDOMRect } from "./Mocks";

const internals: Array<InternalOscData | InternalGainData> = [];
const builtInternals = buildInternals(
  mockblocks,
  audioCtx,
  (block: BlockData) => {
    // fire updateBlock
  },
  internals
);
describe("buildInternals()", () => {
  test("internal oscillator has gain", () => {
    const internalToTest: InternalOscData = builtInternals[0] as InternalOscData;
    expect(internalToTest.gain).toBeDefined();
    expect(internalToTest.gain.gain.value).toEqual(1);
  });
  test("internal oscillators set correctly", () => {
    const internalToTest: InternalOscData = builtInternals[0] as InternalOscData;

    expect(internalToTest.oscillator.type).toEqual(mockblocks[0].type);
    expect(internalToTest.oscillator.frequency.value).toEqual(
      mockblocks[0].value
    );
  });
  test("internal gain objects set correctly", () => {
    const internalToTest = builtInternals[1] as InternalGainData;
    expect(internalToTest.gain.gain.value).toEqual(mockblocks[1].value);
  });
  test("internals have analyser", () => {
    const internalWithOscillator: InternalOscData = builtInternals[0] as InternalOscData;
    expect(internalWithOscillator.analyser).toBeDefined();

    const internalWithGain: InternalOscData = builtInternals[0] as InternalOscData;
    expect(internalWithGain.analyser).toBeDefined();
  });
});

describe("drawConnectionLines()", () => {
  test("sets line coordinates correctly", () => {
    mockblocks[0].outputs = [
      {
        id: 0,
        destination: builtInternals[1].gain.gain,
        isConnectedTo: 1,
        connectedToType: "gain"
      }
    ];
    let lines = drawConnectionLines(mockblocks, speakersDOMRect);
    let fromRect = mockblocks[0].outputDOMRect as DOMRect;
    let toRect = mockblocks[1].gainInputDOMRect;
    let expectedLine = {
      x1: fromRect.x + fromRect.width / 2,
      y1: fromRect.y + fromRect.height / 2,
      x2: toRect.x,
      y2: toRect.y + toRect.height / 2,
      fromBlock: 0,
      outputId: 0,
      toBlock: 1
    } as Line;

    expect(lines.length).toEqual(1);
    expect(lines[0]).toEqual(expectedLine);
  });
  test("no lines are drawn if not connected", () => {
    mockblocks[0].connected = false;
    let lines = drawConnectionLines(mockblocks, speakersDOMRect);

    expect(lines.length).toEqual(0);
  });
});

describe("genWACode()", () => {
  test("it generates Web Audio code", () => {
    const code = genWACode(mockblocks, builtInternals);
    const expectedCode = `const audioCtx = new AudioContext(); // define audio context

// Creating oscillator block
let osc0 = audioCtx.createOscillator();
osc0.type = \"sine\";
osc0.frequency.setValueAtTime(220, audioCtx.currentTime);
// create a internal gain used with oscillator object
let gain0 = audioCtx.createGain();
gain0.gain.value = 1;
osc0.connect(gain0);
osc0.start();

let gain1 = audioCtx.createGain();
gain1.gain.value = 1;

let gain2 = audioCtx.createGain();
gain2.gain.value = 1;

`;
    expect(code).toEqual(expectedCode);
  });
});
