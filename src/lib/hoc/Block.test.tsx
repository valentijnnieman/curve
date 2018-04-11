import "web-audio-test-api";
import { audioCtx, mockNodeData } from "../helpers/Mocks";
import { buildInternals } from "../helpers/Editor";
import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { InternalObject, InternalGainObject } from "../../types/internalObject";
import { composedBlock } from "./Block";
import { BlockProps } from "../../types/blockProps";
import { OscBlock } from "../../components/OscBlock"; // class without composedBlock

describe("OscNode", () => {
  const internals: Array<InternalObject | InternalGainObject> = [];
  const builtInternals = buildInternals(
    mockNodeData,
    audioCtx,
    (node: NodeDataObject | GainDataObject) => {
      mockNodeData[node.id] = node;
    },
    internals
  );
  test("hi", () => {
    expect(1).toEqual(1);
  });

  const TestBlock = composedBlock(OscBlock);
  const MockBlock = new TestBlock({
    node: mockNodeData[0],
    allNodes: mockNodeData,
    internal: builtInternals[0],
    allInternals: builtInternals,
    tryToConnect: (
      node: NodeDataObject,
      internal: InternalObject | InternalGainObject,
      el: DOMRect
    ) => {
      expect(node).toBeDefined();
      expect(internal).toBeDefined();
      expect(el).toBeDefined();
    },
    tryToConnectTo: (
      node: NodeDataObject,
      outputToConnectTo: AudioParam,
      outputType: string,
      inputElement: DOMRect
    ) => {
      expect(node).toBeDefined();
      expect(outputToConnectTo).toBeDefined();
      expect(outputType).toBeDefined();
      expect(inputElement).toBeDefined();

      expect(node).toEqual(MockBlock.props.node);
      switch (outputType) {
        case "gain":
          expect(outputToConnectTo).toEqual(MockBlock.props.internal.gain.gain);
          break;
        case "freq":
          expect(outputToConnectTo).toEqual(
            MockBlock.props.internal.oscillator.frequency
          );
          break;
        default:
          expect(outputToConnectTo).toEqual(MockBlock.props.internal.gain.gain);
          break;
      }
    },
    canConnect: false,
    updateNode: (node: NodeDataObject | GainDataObject) => {
      // set the changes ourselves - we test redux actions elsewhere
      // oscNode.props.node.running = (node as NodeDataObject).running;
    },
    audioCtx
  } as BlockProps);
  // const newOscBlock: OscBlock = new OscBlock({
  // } as ComposedBlockProps);

  // mock refs here
  // oscNode.gainInputElement = document.createElement("div");
  // oscNode.freqInputElement = document.createElement("div");
  // oscNode.outputElement = document.createElement("div");

  // test("toggleOsc()", () => {
  //   expect(oscNode.props.node.running).toBe(false);
  //   oscNode.toggleOsc();
  //   expect(oscNode.props.internal.gain.gain.value).toEqual(1);
  //   expect(oscNode.props.node.running).toBe(true);
  //   oscNode.toggleOsc();
  //   expect(oscNode.props.internal.gain.gain.value).toEqual(0);
  //   expect(oscNode.props.node.running).toBe(false);
  // });
  // test("connectInternal()", () => {
  //   oscNode.props.node.output = builtInternals[1].gain.gain as AudioParam;
  //   oscNode.connectInternal();
  //   expect(oscNode.props.internal.gain.numberOfOutputs).toEqual(1);
  //   // not much else to test here, there's no (easy) way of testing if the internal Web Audio node is connected
  // });
  // test("tryToConnect()", () => {
  //   expect(oscNode.props.node).toBeDefined();
  //   expect(oscNode.props.internal).toBeDefined();
  // });
  // test("tryToConnectTo()", () => {
  //   oscNode.tryToConnectTo("gain");
  //   oscNode.tryToConnectTo("freq");
  //   oscNode.tryToConnectTo("default");
  // });
  // test("onDragHandler()", () => {
  //   oscNode.onDragHandler();
  // });
});
