import * as React from "react";
import OscNode from "./OscNode";
import "web-audio-test-api";
import { audioCtx, mockNodeData } from "../lib/helpers/Mocks";
import { buildInternals } from "../lib/helpers/Editor";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";

interface NodeProps {
  node: NodeDataObject;
  allNodes: Array<NodeDataObject | GainDataObject>;
  internal: InternalObject;
  allInternals: Array<InternalObject | InternalGainObject>;
  tryToConnect: any;
  tryToConnectTo: any;
  canConnect: boolean;
  updateNode: (node: NodeDataObject | GainDataObject) => void;
  audioCtx: AudioContext;
}

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
  const oscNode: OscNode = new OscNode({
    node: mockNodeData[0],
    allNodes: mockNodeData,
    internal: builtInternals[0],
    allInternals: builtInternals,
    tryToConnect: () => {
      window.console.log("mock tryToConnect");
    },
    tryToConnectTo: () => {
      window.console.log("mock tryToConnectTo");
    },
    canConnect: false,
    updateNode: (node: NodeDataObject | GainDataObject) => {
      // set the changes ourselves - we test redux actions elsewhere
      oscNode.props.node.running = (node as NodeDataObject).running;
    },
    audioCtx
  } as NodeProps);
  test("toggleOsc()", () => {
    expect(oscNode.props.node.running).toBe(false);
    oscNode.toggleOsc();
    expect(oscNode.props.internal.gain.gain.value).toEqual(1);
    expect(oscNode.props.node.running).toBe(true);
    oscNode.toggleOsc();
    expect(oscNode.props.internal.gain.gain.value).toEqual(0);
    expect(oscNode.props.node.running).toBe(false);
  });
  test("connectInternal()", () => {
    oscNode.props.node.output = builtInternals[1].gain.gain as AudioParam;
    oscNode.connectInternal();
    expect(oscNode.props.internal.gain.numberOfOutputs).toEqual(1);
    // not much else to test here, there's no (easy) way of testing if the internal Web Audio node is connected
  });
});
