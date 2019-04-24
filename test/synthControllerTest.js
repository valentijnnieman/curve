const assert = require("assert");
const mocks = require("node-mocks-http");

const User = require("../server/controllers/user");

describe("Synth controller", () => {
  describe(".create()", () => {
    it("should return status 201", async () => {
      const Synth = require("../server/controllers/synth");
      const request = {
        body: {
          name: "Test-synth",
          data: [],
          userId: 1
        }
      };
      const response = mocks.createResponse();
      await Synth.create(request, response);
      assert.equal(response.statusCode, 201);
      await Synth.destroy({ body: { id: 0 } }, response);
    });
    it("should return valid JSON", () => {
      const Synth = require("../server/controllers/synth");
      const request = {
        body: {
          name: "Test",
          slug: "test",
          data: [],
          userId: 0
        }
      };
      const response = mocks.createResponse();
      Synth.create(request, response);
      // assert.equal(response.status(), {});
    });
  });
});
