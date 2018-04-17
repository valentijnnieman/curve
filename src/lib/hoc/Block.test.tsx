import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";

import {
  audioCtx,
  mockblocks,
  outputDOMRect,
  inputDOMRect
} from "../helpers/Mocks";
import { buildInternals } from "../helpers/Editor";
import { BlockData } from "../../types/blockData";
import { InternalOscData, InternalGainData } from "../../types/internalData";
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
const internals: Array<InternalOscData | InternalGainData> = [];
const builtInternals = buildInternals(
  mockblocks,
  audioCtx,
  (block: BlockData) => {
    mockblocks[block.id] = block;
  },
  internals
);

describe("OscNode", () => {
  const blockInstance = mockblocks[0];
  const internalInstance = builtInternals[0] as InternalOscData;
  const wrapper = shallow(
    <ComposedBlock
      block={blockInstance}
      allBlocks={mockblocks}
      internal={internalInstance}
      allInternals={builtInternals}
      tryToConnect={(
        block: BlockData,
        internal: InternalOscData | InternalGainData,
        el: DOMRect
      ) => {
        // this is the parent method that will catch component's tryToConnect method
        expect(block).toEqual(blockInstance);
        expect(internal).toEqual(internalInstance);
        expect(el).toEqual(outputDOMRect);
      }}
      tryToConnectTo={(
        block: BlockData,
        outputToConnectTo: AudioParam,
        outputType: string,
        inputElement: DOMRect
      ) => {
        // this is the parent method that will catch component's tryToConnectTo method
        expect(outputToConnectTo).toBeDefined();
        expect(outputType).toBeDefined();
        expect(inputElement).toBeDefined();
        expect(block).toEqual(blockInstance);
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
      updateBlock={(block: BlockData) => {
        // We're testing the actual redux action elsewhere
        mockblocks[block.id].outputDOMRect = block.outputDOMRect;
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
    instance.props.block.output = builtInternals[1].gain.gain as AudioParam;
    instance.connectInternal();
    expect(instance.props.internal.gain.numberOfOutputs).toEqual(1);
    // not much else to test here, there's no (easy) way of testing if the internal Web Audio block is connected
  });
  test("tryToConnect()", () => {
    instance.tryToConnect(outputDOMRect);
  });
  test("onDragHandler()", () => {
    // test if outputElement (positoin) is updated when connected
    instance.props.block.connected = true;
    instance.props.block.outputs = [
      {
        id: 0,
        destination: builtInternals[1].gain.gain,
        isConnectedTo: 1,
        connectedToType: "gain",
        connectedToEl: inputDOMRect,
        connectedFromEl: outputDOMRect
      }
    ];
    const newOutputRect = { ...outputDOMRect, x: 999 };
    instance.onDragHandler(inputDOMRect, newOutputRect);
    expect(instance.props.block.outputDOMRect).toEqual(newOutputRect);
    // TO-DO: create inputs array before testing this?
    // test if gainInputElement is updated when hasInputFrom
    // instance.props.allBlocks[1].connected = true;
    // const newInputRect = { ...inputDOMRect, x: 999 };
    // instance.props.block.hasInputFrom = [1];
    // instance.onDragHandler(newInputRect, outputDOMRect);
    // expect(instance.props.allBlocks[1].outputs[0].connectedToEl).toEqual(
    //   newInputRect
    // );
    // // test if freqInputElement is updated when hasInputFrom
    // instance.props.allBlocks[1].connectedToType = "freq";
    // instance.props.allBlocks[1].connectedToEl = inputDOMRect;
    // instance.props.block.hasInputFrom = [1];
    // instance.onDragHandler(inputDOMRect, outputDOMRect, newInputRect);
    // expect(instance.props.allBlocks[1].connectedToEl).toEqual(newInputRect);
  });
});
