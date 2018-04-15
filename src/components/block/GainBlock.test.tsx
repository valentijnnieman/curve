import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";
import { audioCtx, mockblocks } from "../../lib/helpers/Mocks";
import { buildInternals } from "../../lib/helpers/Editor";
import { OscData, GainData } from "../../types/blockData";
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
    (node: OscData | GainData) => {
      mockblocks[node.id] = node;
    },
    internals
  );
  const nodeInstance = mockblocks[0] as GainData;
  const internalInstance = builtInternals[0] as InternalGainData;
  const MockBlock = mount(
    <MuiThemeProvider>
      <GainBlock
        node={nodeInstance}
        allNodes={mockblocks}
        internal={internalInstance}
        allInternals={builtInternals}
        tryToConnectTo={(
          node: OscData,
          outputToConnectTo: AudioParam,
          outputType: string,
          inputElement: DOMRect
        ) => {
          expect(outputToConnectTo).toBeDefined();
          expect(outputType).toBeDefined();
          expect(inputElement).toBeDefined();
          // expect(node).toEqual(MockBlockProps.node);
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
        updateBlock={(node: OscData | GainData) => {
          // We're testing the actual redux action elsewhere
          // const store = mockStore(mockblocks);
          // mockStore.dispatch(updateBlock(node));
          // nodeInstance.running = (node as OscData).running;
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
    // expect(MockBlockInstance.props.node.freq).toEqual(999);
  });
});
