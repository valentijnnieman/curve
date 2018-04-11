import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";
import { audioCtx, mockNodeData } from "../lib/helpers/Mocks";
import { buildInternals } from "../lib/helpers/Editor";
import { NodeDataObject, GainDataObject } from "../types/nodeObject";
import { InternalObject, InternalGainObject } from "../types/internalObject";
// import ComposedOscBlock from "./OscBlock";
import { OscBlock } from "./OscBlock";
// import { BlockProps } from "../types/blockProps";
import { mount } from "enzyme";
import { MuiThemeProvider } from "material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe("<OscBlock />", () => {
  const internals: Array<InternalObject | InternalGainObject> = [];
  const builtInternals = buildInternals(
    mockNodeData,
    audioCtx,
    (node: NodeDataObject | GainDataObject) => {
      mockNodeData[node.id] = node;
    },
    internals
  );
  const MockBlock = mount(
    <MuiThemeProvider>
      <OscBlock
        node={mockNodeData[0] as NodeDataObject}
        allNodes={mockNodeData}
        internal={builtInternals[0] as InternalObject}
        allInternals={builtInternals}
        tryToConnectTo={(
          node: NodeDataObject,
          outputToConnectTo: AudioParam,
          outputType: string,
          inputElement: DOMRect
        ) => {
          window.console.log("outputToConnectoTo in Test: ", outputToConnectTo);
          expect(outputToConnectTo).toBeDefined();
          expect(outputType).toBeDefined();
          expect(inputElement).toBeDefined();
          // expect(node).toEqual(MockBlockProps.node);
          switch (outputType) {
            case "gain":
              expect(outputToConnectTo).toEqual(builtInternals[0].gain.gain);
              break;
            case "freq":
              expect(outputToConnectTo).toEqual(
                (builtInternals[0] as InternalObject).oscillator.frequency
              );
              break;
            default:
              expect(outputToConnectTo).toEqual(builtInternals[0].gain.gain);
              break;
          }
        }}
        canConnect={false}
        updateNode={(node: NodeDataObject | GainDataObject) => {
          // We're testing the actual redux action elsewhere
          (mockNodeData[0] as NodeDataObject).running = (node as NodeDataObject).running;
        }}
        audioCtx={audioCtx}
        connectToAnalyser={jest.fn()}
        connectInternal={jest.fn()}
        onDragHandler={jest.fn()}
        tryToConnect={jest.fn()}
      />
    </MuiThemeProvider>
  );

  const MockBlockInstance = MockBlock.instance() as OscBlock;
  const MockBlockProps = MockBlockInstance.props;
  test("toggleOsc()", () => {
    expect(MockBlockProps.node.running).toBe(false);
    MockBlockInstance.toggleOsc();
    expect(MockBlockProps.internal.gain.gain.value).toEqual(1);
    expect(MockBlockProps.node.running).toBe(true);
    MockBlockInstance.toggleOsc();
    expect(MockBlockProps.internal.gain.gain.value).toEqual(0);
    expect(MockBlockProps.node.running).toBe(false);
  });
  test("connectInternal()", () => {
    MockBlockProps.node.output = builtInternals[1].gain.gain as AudioParam;
    MockBlockProps.connectInternal();
    expect(MockBlockProps.internal.gain.numberOfOutputs).toEqual(1);
    // not much else to test here, there's no (easy) way of testing if the internal Web Audio node is connected
  });
  test("tryToConnect()", () => {
    expect(MockBlockProps.node).toBeDefined();
    expect(MockBlockProps.internal).toBeDefined();
  });
  test("tryToConnectTo()", () => {
    MockBlockInstance.tryToConnectTo("gain");
    MockBlockInstance.tryToConnectTo("freq");
    MockBlockInstance.tryToConnectTo("default");
  });
  test("onDragHandler()", () => {
    // expect(MockBlockInstance.gainInputElement).toEqual(1);
  });
});
