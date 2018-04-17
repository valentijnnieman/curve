import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import "web-audio-test-api";
Enzyme.configure({ adapter: new Adapter() });

describe("<BiquadBlock />", () => {
  test("foobar", () => {
    // it's foo
  });
});
