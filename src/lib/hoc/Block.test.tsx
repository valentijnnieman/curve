import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";

import {
  audioCtx,
  mockNodeData,
  outputDOMRect,
  inputDOMRect
} from "../helpers/Mocks";
import { buildInternals } from "../helpers/Editor";
import { NodeDataObject, GainDataObject } from "../../types/nodeObject";
import { InternalObject, InternalGainObject } from "../../types/internalObject";
import { shallow } from "enzyme";
import { composedBlock } from "./Block";
import { OscBlockProps } from "../../types/blockProps";

Enzyme.configure({ adapter: new Adapter() });

class MockBlock extends React.Component<OscBlockProps> {
  render() {
    return <div>Mock</div>;
  }
}

const ComposedBlock = composedBlock(MockBlock);

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
  const nodeInstance = mockNodeData[0] as NodeDataObject;
  const internalInstance = builtInternals[0] as InternalObject;
  const wrapper = shallow(
    <ComposedBlock
      node={nodeInstance}
      allNodes={mockNodeData}
      internal={internalInstance}
      allInternals={builtInternals}
      tryToConnect={(
        node: NodeDataObject | GainDataObject,
        internal: InternalObject | InternalGainObject,
        el: DOMRect
      ) => {
        // this is the parent method that will catch component's tryToConnect method
        expect(node).toEqual(nodeInstance);
        expect(internal).toEqual(internalInstance);
        expect(el).toEqual(outputDOMRect);
      }}
      tryToConnectTo={(
        node: NodeDataObject,
        outputToConnectTo: AudioParam,
        outputType: string,
        inputElement: DOMRect
      ) => {
        // this is the parent method that will catch component's tryToConnectTo method
        expect(outputToConnectTo).toBeDefined();
        expect(outputType).toBeDefined();
        expect(inputElement).toBeDefined();
        expect(node).toEqual(nodeInstance);
        switch (outputType) {
          case "gain":
            expect(outputToConnectTo).toEqual(internalInstance.gain.gain);
            break;
          case "freq":
            expect(outputToConnectTo).toEqual(
              internalInstance.oscillator.frequency
            );
            break;
          default:
            expect(outputToConnectTo).toEqual(internalInstance.gain.gain);
            break;
        }
      }}
      canConnect={false}
      updateNode={(node: NodeDataObject | GainDataObject) => {
        // We're testing the actual redux action elsewhere
        (mockNodeData[
          node.id
        ] as NodeDataObject).connectedFromEl = (node as NodeDataObject).connectedFromEl;
        (mockNodeData[
          node.id
        ] as NodeDataObject).connectedToEl = (node as NodeDataObject).connectedToEl;
      }}
      audioCtx={audioCtx}
    />
  );
  // const newOscBlock: OscBlock = new OscBlock({
  // } as OscBlockProps);

  // mock refs here
  // MockBlock.gainInputElement = document.createElement("div");
  // oscNode.freqInputElement = document.createElement("div");
  // oscNode.outputElement = document.createElement("div");

  const instance = wrapper.instance() as any;

  test("connectInternal()", () => {
    instance.props.node.output = builtInternals[1].gain.gain as AudioParam;
    instance.connectInternal();
    expect(instance.props.internal.gain.numberOfOutputs).toEqual(1);
    // not much else to test here, there's no (easy) way of testing if the internal Web Audio node is connected
  });
  test("tryToConnect()", () => {
    instance.tryToConnect(outputDOMRect);
  });
  test("onDragHandler()", () => {
    // test if outputElement (positoin) is updated when connected
    instance.props.node.connected = true;
    instance.props.node.connectedFromEl = outputDOMRect;
    const newOutputRect = { ...outputDOMRect, x: 999 };
    instance.onDragHandler(inputDOMRect, newOutputRect);
    expect(instance.props.node.connectedFromEl).toEqual(newOutputRect);
    // test if gainInputElement is updated when hasInputFrom
    instance.props.allNodes[1].connected = true;
    instance.props.allNodes[1].connectedToType = "gain";
    instance.props.allNodes[1].connectedToEl = inputDOMRect;
    const newInputRect = { ...inputDOMRect, x: 999 };
    instance.props.node.hasInputFrom = [1];
    instance.onDragHandler(newInputRect, outputDOMRect);
    expect(instance.props.allNodes[1].connectedToEl).toEqual(newInputRect);
    // test if freqInputElement is updated when hasInputFrom
    instance.props.allNodes[1].connectedToType = "freq";
    instance.props.allNodes[1].connectedToEl = inputDOMRect;
    instance.props.node.hasInputFrom = [1];
    instance.onDragHandler(inputDOMRect, outputDOMRect, newInputRect);
    expect(instance.props.allNodes[1].connectedToEl).toEqual(newInputRect);
  });
});
