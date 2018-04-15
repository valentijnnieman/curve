import "./Editor";
import "web-audio-test-api";
import { buildInternals, drawConnectionLines, genWACode } from "./Editor";
import { OscDataObject, GainDataObject } from "../../types/nodeObject";
import {
  InternalOscObject,
  InternalGainObject
} from "../../types/internalObject";
import { Line } from "../../types/lineObject";
import { audioCtx, mockNodeData, speakersDOMRect } from "./Mocks";

const internals: Array<InternalOscObject | InternalGainObject> = [];
const builtInternals = buildInternals(
  mockNodeData,
  audioCtx,
  (node: OscDataObject | GainDataObject) => {
    // fire updateNode
  },
  internals
);
describe("buildInternals()", () => {
  test("internal oscillator has gain", () => {
    const internalToTest: InternalOscObject = builtInternals[0] as InternalOscObject;
    expect(internalToTest.gain).toBeDefined();
    expect(internalToTest.gain.gain.value).toEqual(1);
  });
  test("internal oscillators set correctly", () => {
    const internalToTest: InternalOscObject = builtInternals[0] as InternalOscObject;

    expect(internalToTest.oscillator.type).toEqual(
      (mockNodeData[0] as OscDataObject).type
    );
    expect(internalToTest.oscillator.frequency.value).toEqual(
      (mockNodeData[0] as OscDataObject).freq
    );
  });
  test("internal gain objects set correctly", () => {
    const internalToTest = builtInternals[1] as InternalGainObject;
    expect(internalToTest.gain.gain.value).toEqual(
      (mockNodeData[1] as GainDataObject).gain
    );
  });
  test("internals have analyser", () => {
    const internalWithOscillator: InternalOscObject = builtInternals[0] as InternalOscObject;
    expect(internalWithOscillator.analyser).toBeDefined();

    const internalWithGain: InternalOscObject = builtInternals[0] as InternalOscObject;
    expect(internalWithGain.analyser).toBeDefined();
  });
});

describe("drawConnectionLines()", () => {
  test("sets line coordinates correctly", () => {
    mockNodeData[0].outputs = [
      {
        id: 0,
        destination: builtInternals[1].gain.gain,
        isConnectedTo: 1,
        connectedToType: "gain"
      }
    ];
    let lines = drawConnectionLines(mockNodeData, speakersDOMRect);
    let fromRect = mockNodeData[0].outputDOMRect as DOMRect;
    let toRect = mockNodeData[1].gainInputDOMRect;
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
    mockNodeData[0].connected = false;
    let lines = drawConnectionLines(mockNodeData, speakersDOMRect);

    expect(lines.length).toEqual(0);
  });
  // test("no lines are drawn if connected but no connectedFromEl", () => {
  //   mockNodeData[0].connected = true;
  //   mockNodeData[0].connectedFromEl = undefined;
  //   let lines = drawConnectionLines(mockNodeData);

  //   expect(lines.length).toEqual(0);
  // });
  // test("no lines are drawn if connected but no connectedToEl", () => {
  //   mockNodeData[0].connected = true;
  //   mockNodeData[0].connectedToEl = undefined;
  //   let lines = drawConnectionLines(mockNodeData);

  //   expect(lines.length).toEqual(0);
  // });
});

describe("genWACode()", () => {
  test("it generates Web Audio code", () => {
    const code = genWACode(mockNodeData, builtInternals);
    const expectedCode = `const audioCtx = new AudioContext(); // define audio context

// Creating oscillator node
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
