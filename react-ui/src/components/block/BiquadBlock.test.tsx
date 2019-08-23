import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import "jest-canvas-mock";

import "web-audio-test-api";
import { audioCtx, mockblocks } from "../../lib/helpers/Mocks";
import { BlockData } from "../../types/blockData";
// import ComposedOscBlock from "./OscBlock";
import { BiquadBlock } from "./BiquadBlock";
// import { BlockProps } from "../types/blockProps";
import { mount } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("<BiquadBlock />", () => {
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  const blockInstance = mockblocks[3] as BlockData;
  const wrapper = mount(
    <BiquadBlock
      block={blockInstance}
      allBlocks={mockblocks}
      tryToConnectTo={(
        block: BlockData,
        outputToConnectTo: AudioParam,
        outputType: string,
        inputElement: DOMRect
      ) => {
        //
      }}
      canConnect={false}
      updateBlock={mockUpdate}
      deleteBlock={mockDelete}
      audioCtx={audioCtx}
      connectToAnalyser={jest.fn()}
      connectInternal={jest.fn()}
      onDragHandler={jest.fn()}
      tryToConnect={jest.fn()}
      checkInputs={jest.fn()}
      startDragging={jest.fn()}
      stopDragging={jest.fn()}
    />
  );

  const instance = wrapper.instance() as BiquadBlock;
  // const props = wrapper.children().instance().props;
  test("tryToConnectTo()", () => {
    instance.tryToConnectTo("gain");
    instance.tryToConnectTo("FREQ");
    instance.tryToConnectTo("default");
  });
  test("handleFreqChange()", () => {
    instance.handleFreqChange({
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
      target: { value: 999 }
    });
    const lastMockCall = mockUpdate.mock.calls.length;
    expect(mockUpdate.mock.calls[lastMockCall - 1][0].values).toEqual([
      999,
      10
    ]);
  });
});
