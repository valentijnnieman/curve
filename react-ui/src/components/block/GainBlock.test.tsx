import * as React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import "jest-canvas-mock";
import "web-audio-test-api";
import { audioCtx, mockblocks } from "../../lib/helpers/Mocks";
import { BlockData } from "../../types/blockData";
// import ComposedOscBlock from "./OscBlock";
import { GainBlock } from "./GainBlock";
// import { BlockProps } from "../types/blockProps";
import { mount } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("<GainBlock />", () => {
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  const blockInstance = mockblocks[0] as BlockData;
  const wrapper = mount(
    <GainBlock
      block={blockInstance}
      allBlocks={mockblocks}
      tryToConnectTo={jest.fn()}
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

  const instance = wrapper.instance() as GainBlock;
  // const props = wrapper.children().instance().props;
  // const MockBlockProps = MockBlock.props().children.props;
  test("tryToConnectTo()", () => {
    instance.tryToConnectTo();
  });
  test("handleGainChange()", () => {
    instance.handleGainChange({
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
      target: { value: 999 }
    });
    const lastMockCall = mockUpdate.mock.calls.length;
    expect(mockUpdate.mock.calls[lastMockCall - 1][0].values).toEqual([999]);
  });
});
