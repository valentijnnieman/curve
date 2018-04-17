import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";
import { audioCtx, mockblocks } from "../../lib/helpers/Mocks";
import { buildInternals } from "../../lib/helpers/Editor";
import { BlockData } from "../../types/blockData";
import { InternalOscData, InternalGainData } from "../../types/internalData";
// import ComposedOscBlock from "./OscBlock";
import { GainBlock } from "./GainBlock";
// import { BlockProps } from "../types/blockProps";
import { mount } from "enzyme";
import { MuiThemeProvider } from "material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe("<GainBlock />", () => {
  const internals: Array<InternalOscData | InternalGainData> = [];
  const builtInternals = buildInternals(
    mockblocks,
    audioCtx,
    (block: BlockData) => {
      mockblocks[block.id] = block;
    },
    internals
  );
  const blockInstance = mockblocks[0] as BlockData;
  const internalInstance = builtInternals[0] as InternalGainData;
  const MockBlock = mount(
    <MuiThemeProvider>
      <GainBlock
        block={blockInstance}
        allBlocks={mockblocks}
        internal={internalInstance}
        allInternals={builtInternals}
        tryToConnectTo={(
          block: BlockData,
          outputToConnectTo: AudioParam,
          outputType: string,
          inputElement: DOMRect
        ) => {
          expect(outputToConnectTo).toBeDefined();
          expect(outputType).toBeDefined();
          expect(inputElement).toBeDefined();
          // expect(block).toEqual(MockBlockProps.block);
          switch (outputType) {
            case "gain":
              expect(outputToConnectTo).toEqual(builtInternals[0].gain);
              break;
            default:
              expect(outputToConnectTo).toEqual(internalInstance.gain.gain);
              break;
          }
        }}
        canConnect={false}
        updateBlock={(block: BlockData) => {
          // We're testing the actual redux action elsewhere
          // const store = mockStore(mockblocks);
          // mockStore.dispatch(updateBlock(block));
          // blockInstance.running = (block as OscData).running;
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

  const MockBlockInstance = MockBlock.children().instance() as GainBlock;
  // const MockBlockProps = MockBlock.props().children.props;
  test("tryToConnectTo()", () => {
    MockBlockInstance.tryToConnectTo();
  });
  test("handleGainChange()", () => {
    // MockBlockInstance.handleFreqChange(999);
    // expect(MockBlockInstance.props.block.freq).toEqual(999);
  });
});
