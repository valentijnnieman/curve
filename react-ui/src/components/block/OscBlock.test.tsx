import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";
import { audioCtx, mockblocks } from "../../lib/helpers/Mocks";
import { BlockData } from "../../types/blockData";
// import ComposedOscBlock from "./OscBlock";
import { OscBlock } from "./OscBlock";
// import { BlockProps } from "../types/blockProps";
import { mount } from "enzyme";
import { MuiThemeProvider } from "material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe("<OscBlock />", () => {
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  const blockInstance = mockblocks[0] as BlockData;
  const wrapper = mount(
    <MuiThemeProvider>
      <OscBlock
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
      />
    </MuiThemeProvider>
  );

  const instance = wrapper.children().instance() as OscBlock;
  const props = wrapper.children().instance().props;
  test("toggleOsc()", () => {
    expect(props.block.running).toBe(false);
    instance.toggleOsc();
    // osc is now ON
    expect(mockUpdate.mock.calls[1][0].internal.gain.gain.value).toEqual(1);
    expect(mockUpdate.mock.calls[1][0].running).toEqual(true);

    instance.props.block.running = true;
    instance.toggleOsc();
    // osc is now OFF
    expect(mockUpdate.mock.calls[0][0].internal.gain.gain.value).toEqual(0);
    expect(mockUpdate.mock.calls[0][0].running).toBe(false);
  });
  test("tryToConnectTo()", () => {
    instance.tryToConnectTo("gain");
    instance.tryToConnectTo("freq");
    instance.tryToConnectTo("default");
  });
  test("handleFreqChange()", () => {
    instance.handleFreqChange({
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
      target: { value: 999 }
    });
    expect(mockUpdate.mock.calls[3][0].values).toEqual([999]);
  });
  test("handleTypeChange()", () => {
    instance.handleTypeChange({}, 0, "sine");
    expect(mockUpdate.mock.calls[3][0].type).toEqual("sine");
  });
});