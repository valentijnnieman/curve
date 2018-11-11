import * as React from "react";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";

import {
  mockblocks,
  outputDOMRect,
  inputDOMRect,
  audioCtx
} from "../lib/helpers/Mocks";
import { Editor } from "./Editor";
import { shallow } from "enzyme";
import { match } from "react-router";
import { Location, History } from "history";

Enzyme.configure({ adapter: new Adapter() });

describe("OscNode", () => {
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  let wrapper;
  let instance;
  let props;
  let testInternal;
  let testBlock;
  beforeEach(() => {
    wrapper = shallow(
      <Editor
        blocks={mockblocks}
        updateBlock={mockUpdate}
        deleteBlock={mockDelete}
        fetchState={jest.fn()}
        audioCtx={audioCtx}
        match={{} as match<any>}
        location={{} as Location}
        history={{} as History}
      />
    );

    instance = wrapper.instance() as any;
    props = instance.props;

    testBlock = props.blocks[0];
    testInternal = testBlock.internal;

    // resetState = () => {
    //   instance.state = {
    //     wantsToConnect: false,
    //     speakersAreConnected: false
    //   };
    // };
  });

  test("tryToConnect()", () => {
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);

    expect(instance.state.wantsToConnect).toBe(true);
    expect(instance.state.blockToConnect).toEqual(testBlock);
    expect(instance.state.internalToConnect).toEqual(testInternal);
    expect(instance.state.lineFrom).toEqual(outputDOMRect);
  });
  test("tryToConnectTo() -> testConnect() can't connect output to own input", () => {
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);
    instance.tryToConnectTo(testBlock, "gain", inputDOMRect);
    expect(testBlock.outputs.length).toEqual(0);
    expect(instance.state.wantsToConnect).toBe(false);
    expect(instance.state.blockToConnect).toBe(undefined);
    expect(instance.state.blockToConnectTo).toBe(undefined);
    expect(instance.state.internalToConnect).toBe(undefined);
    expect(instance.state.lineFrom).toBe(undefined);
    expect(instance.state.lineTo).toBe(undefined);
  });
  // instance.testConnect();
  test("tryToConnectTo() -> testConnect() connects", () => {
    const blockToConnectTo = props.blocks[1];
    blockToConnectTo.hasInternal = true; // this gets set with the buildInternals helper -> updateBlock redux action
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);
    instance.tryToConnectTo(blockToConnectTo, "gain", inputDOMRect);
    const expectedBlockToConnect = {
      ...testBlock,
      connected: true,
      outputs: [
        {
          connectedToType: "gain",
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
      hasInputFrom: [0]
    };
    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 1][0]).toEqual(
      expectedBlockToConnectTo
    );
  });
  test("disconnect()", () => {
    instance.tryToConnect(testBlock, testInternal, outputDOMRect);
    instance.tryToConnectTo(props.blocks[1], "gain", inputDOMRect);
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
        destination: props.blocks[1].internal.gain.gain,
        id: 0,
        isConnectedTo: 1
      },
      {
        connectedToType: "gain",
        destination: props.blocks[2].internal.gain.gain,
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
          destination: props.blocks[2].internal.gain.gain,
          id: 1,
          isConnectedTo: 2
        }
      ]
    };

    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 2][0]).toEqual(
      expectedBlock
    );
  });
  test("disconnect() from speakers", () => {
    testBlock.connected = true;
    testBlock.isConnectedToOutput = true;
    instance.state.speakersAreConnected = true;
    testBlock.outputs = [
      {
        connectedToType: "gain",
        destination: audioCtx.destination,
        id: 0,
        isConnectedTo: -1 // speakers are -1
      }
    ];
    instance.disconnect(0, -1, 0);

    const expectedBlock = {
      ...testBlock,
      connected: false,
      isConnectedToOutput: false,
      outputs: []
    };

    expect(mockUpdate.mock.calls[mockUpdate.mock.calls.length - 1][0]).toEqual(
      expectedBlock
    );
    expect(instance.state.speakersAreConnected).toBe(false);
  });
});
