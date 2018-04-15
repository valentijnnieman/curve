import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";

import { mockblocks, outputDOMRect, inputDOMRect } from "../lib/helpers/Mocks";
import { Editor } from "./Editor";
import { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("OscNode", () => {
  const mockUpdate = jest.fn();

  const wrapper = shallow(
    <Editor blocks={mockblocks} updateBlock={mockUpdate} />
  );

  const instance = wrapper.instance() as any;
  const props = instance.props;

  const testBlock = props.blocks[0];
  const testInternal = instance._INTERNALS[0];

  const resetState = () => {
    instance.state = {
      wantsToConnect: false,
      speakersAreConnected: false
    };
  };

  afterEach(() => {
    resetState();
  });

  test("tryToConnect()", () => {
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);

    expect(instance.state.wantsToConnect).toBe(true);
    expect(instance.state.blockToConnect).toEqual(testBlock);
    expect(instance.state.internalToConnect).toEqual(testInternal);
    expect(instance.state.lineFrom).toEqual(outputDOMRect);
  });
  test("tryToConnectTo() -> testConnect() can't connect output to own input", () => {
    const outputToConnectTo = instance._INTERNALS[0].gain.gain;
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);
    instance.tryToConnectTo(testBlock, outputToConnectTo, "gain", inputDOMRect);
    expect(testBlock.outputs.length).toEqual(0);
    expect(instance.state.wantsToConnect).toBe(false);
    expect(instance.state.blockToConnect).toBe(undefined);
    expect(instance.state.blockToConnectTo).toBe(undefined);
    expect(instance.state.internalToConnect).toBe(undefined);
    expect(instance.state.outputToConnectTo).toBe(undefined);
    expect(instance.state.lineFrom).toBe(undefined);
    expect(instance.state.lineTo).toBe(undefined);
  });
  // instance.testConnect();
  test("tryToConnectTo() -> testConnect() connects", () => {
    const blockToConnectTo = props.blocks[1];
    blockToConnectTo.hasInternal = true; // this gets set with the buildInternals helper -> updateBlock redux action
    const outputToConnectTo = instance._INTERNALS[1].gain.gain;
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);
    instance.tryToConnectTo(
      blockToConnectTo,
      outputToConnectTo,
      "gain",
      inputDOMRect
    );
    const expectedBlockToConnect = {
      ...testBlock,
      connected: true,
      outputs: [
        {
          connectedToType: "gain",
          destination: outputToConnectTo,
          id: 0,
          isConnectedTo: 1
        }
      ]
    };
    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 2][0]).toEqual(
      expectedBlockToConnect
    );
    const expectedBlockToConnectTo = {
      ...blockToConnectTo,
      hasGainInput: true,
      hasInputFrom: [0],
      hasFreqInput: false
    };
    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 1][0]).toEqual(
      expectedBlockToConnectTo
    );
  });
  test("disconnect()", () => {
    const outputToConnectTo = instance._INTERNALS[1].gain.gain;
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);
    instance.tryToConnectTo(
      props.blocks[1],
      outputToConnectTo,
      "gain",
      inputDOMRect
    );
    const expectedBlockWithOutput = {
      ...testBlock,
      connected: false,
      isConnectedToOutput: false,
      outputs: []
    };
    const expectedBlockWithInput = {
      ...props.blocks[1],
      hasInputFrom: []
    };
    instance.disconnect(0, 1, 0);
    // the update for the block that wants to disconnect it's output is run first
    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 2][0]).toEqual(
      expectedBlockWithOutput
    );
    // then the update for the block that receives input
    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 1][0]).toEqual(
      expectedBlockWithInput
    );
  });
  test("disconnect() only one", () => {
    testBlock.connected = true;
    testBlock.outputs = [
      {
        connectedToType: "gain",
        destination: instance._INTERNALS[1].gain.gain,
        id: 0,
        isConnectedTo: 1
      },
      {
        connectedToType: "gain",
        destination: instance._INTERNALS[2].gain.gain,
        id: 1,
        isConnectedTo: 2
      }
    ];

    instance.disconnect(0, 1, 0);

    const expectedBlock = {
      ...testBlock,
      connected: true,
      isConnectedToOutput: false,
      outputs: [
        {
          connectedToType: "gain",
          destination: instance._INTERNALS[2].gain.gain,
          id: 1,
          isConnectedTo: 2
        }
      ]
    };

    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 2][0]).toEqual(
      expectedBlock
    );
  });
});
