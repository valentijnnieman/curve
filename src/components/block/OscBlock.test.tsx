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
  const blockInstance = mockblocks[0] as BlockData;
  const MockBlock = mount(
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
        updateBlock={(block: BlockData) => {
          // We're testing the actual redux action elsewhere
          // const store = mockStore(mockblocks);
          // mockStore.dispatch(updateBlock(block));
          blockInstance.running = (block as BlockData).running;
          blockInstance.value = (block as BlockData).value;
        }}
        audioCtx={audioCtx}
        connectToAnalyser={jest.fn()}
        connectInternal={jest.fn()}
        onDragHandler={jest.fn()}
        tryToConnect={jest.fn()}
        checkInputs={jest.fn()}
      />
    </MuiThemeProvider>
  );

  const MockBlockInstance = MockBlock.children().instance() as OscBlock;
  const MockBlockProps = MockBlock.props().children.props;
  test("toggleOsc()", () => {
    expect(MockBlockProps.block.running).toBe(false);
    MockBlockInstance.toggleOsc();
    expect(MockBlockProps.internal.gain.gain.value).toEqual(1);
    expect(MockBlockProps.block.running).toBe(true);
    MockBlockInstance.toggleOsc();
    expect(MockBlockProps.internal.gain.gain.value).toEqual(0);
    expect(MockBlockProps.block.running).toBe(false);
  });
  test("tryToConnectTo()", () => {
    MockBlockInstance.tryToConnectTo("gain");
    MockBlockInstance.tryToConnectTo("freq");
    MockBlockInstance.tryToConnectTo("default");
  });
  test("handleFreqChange()", () => {
    // MockBlockInstance.handleFreqChange(999);
    // expect(MockBlockInstance.props.block.freq).toEqual(999);
  });
});
