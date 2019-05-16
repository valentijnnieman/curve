import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "jest-canvas-mock";
import "web-audio-test-api";
import { audioCtx, mockblocks } from "../../lib/helpers/Mocks";
import { BlockData } from "../../types/blockData";
import { EnvelopeBlock } from "./EnvelopeBlock";
import { mount } from "enzyme";
import { MuiThemeProvider } from "material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe("<EnvelopeBlock />", () => {
  let mockUpdate;
  let mockDelete;

  let wrapper, instance, blockInstance;
  beforeEach(() => {
    mockUpdate = jest.fn();
    mockDelete = jest.fn();
    blockInstance = mockblocks[4] as BlockData;
    wrapper = mount(
      <MuiThemeProvider>
        <EnvelopeBlock
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
      </MuiThemeProvider>
    );
    instance = wrapper.children().instance() as EnvelopeBlock;
  });

  // const props = wrapper.children().instance().props;
  // const MockBlockProps = MockBlock.props().children.props;
  test("tryToConnectTo()", () => {
    instance.tryToConnectTo();
  });
  test("blockdata's values should define ADSR values", () => {
    expect(blockInstance.values.length).toEqual(4);
  });
  test("state is set correctly", () => {
    expect(instance.state.attack).toEqual(blockInstance.values[0]);
    expect(instance.state.decay).toEqual(blockInstance.values[1]);
    expect(instance.state.sustain).toEqual(blockInstance.values[2]);
    expect(instance.state.release).toEqual(blockInstance.values[3]);
  });
  test("handleChange() attack", () => {
    instance.handleChange(
      {
        preventDefault: () => undefined,
        stopPropagation: () => undefined,
        target: { name: "attack", value: 0.1 }
      },
      0
    );
    expect(mockUpdate.mock.calls[1][0].values).toEqual([0.1, 0.5, 0.5, 0.4]);
  });
  test("handleChange() decay", () => {
    instance.handleChange(
      {
        preventDefault: () => undefined,
        stopPropagation: () => undefined,
        target: { name: "decay", value: 0.1 }
      },
      1
    );
    expect(mockUpdate.mock.calls[1][0].values).toEqual([0, 0.1, 0.5, 0.4]);
  });
  test("handleChange() sustain", () => {
    instance.handleChange(
      {
        preventDefault: () => undefined,
        stopPropagation: () => undefined,
        target: { name: "sustain", value: 0.1 }
      },
      2
    );
    expect(mockUpdate.mock.calls[1][0].values).toEqual([0, 0.5, 0.1, 0.4]);
  });
  test("handleChange() release", () => {
    instance.handleChange(
      {
        preventDefault: () => undefined,
        stopPropagation: () => undefined,
        target: { name: "release", value: 0.1 }
      },
      3
    );
    expect(mockUpdate.mock.calls[1][0].values).toEqual([0, 0.5, 0.5, 0.1]);
  });
  test("handleTrigger()", () => {
    expect(instance.handleTrigger).toBeDefined();
  });
});
