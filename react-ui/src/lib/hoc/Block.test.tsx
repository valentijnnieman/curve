import * as React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";

import {
  audioCtx,
  mockblocks,
  outputDOMRect,
  inputDOMRect
} from "../helpers/Mocks";
import { BlockData } from "../../types/blockData";
import { InternalOscData, InternalData } from "../../types/internalData";
import { shallow } from "enzyme";
import { composedBlock } from "./Block";
import { OscBlockProps } from "../../types/blockProps";

Enzyme.configure({ adapter: new Adapter() });

class MockBlock extends React.Component<OscBlockProps> {
  tryToConnectTo = () => {
    //
  };
  connectToAnalyser = () => {
    //
  };
  render() {
    return <div>Mock</div>;
  }
}

const ComposedBlock = composedBlock(MockBlock);

describe("OscNode", () => {
  const blockInstance = mockblocks[0];
  const internalInstance = blockInstance.internal as InternalOscData;
  const wrapper = shallow(
    <ComposedBlock
      block={blockInstance}
      allBlocks={mockblocks}
      tryToConnect={(
        block: BlockData,
        internal: InternalOscData | InternalData,
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
          case "FREQ":
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
      deleteBlock={jest.fn()}
      audioCtx={audioCtx}
      startDragging={jest.fn()}
      stopDragging={jest.fn()}
    />
  );

  const instance = wrapper.instance() as any;

  test("connectInternal()", () => {
    instance.props.block.output = mockblocks[1].internal.gain
      .gain as AudioParam;
    instance.connectInternal();
    expect(instance.props.block.internal.gain.numberOfOutputs).toEqual(1);
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
        isConnectedTo: 1,
        connectedToType: "GAIN",
        connectedToEl: inputDOMRect,
        connectedFromEl: outputDOMRect
      }
    ];
    const newOutputRect = { ...outputDOMRect, x: 999 };
    instance.onDragHandler({}, inputDOMRect, newOutputRect);
    expect(instance.props.block.outputDOMRect).toEqual(newOutputRect);
  });
});
