const assert = require("assert");
const httpMocks = require("node-mocks-http");
const proxyquire = require("proxyquire");
const SequelizeMock = require("sequelize-mock");

const dbMock = new SequelizeMock();

const mockUser = dbMock.define("User", {
  id: 1,
  name: "Test user",
  email: "test@test.com",
  password: "test-pwd"
});
const mockSynth = dbMock.define("User", {
  id: 1,
  name: "Test synth",
  data: [],
  userId: 1
});

const synthController = proxyquire("../server/controllers/synth", {
  "../models/synth": mockSynth,
  "../models/user": mockUser
});

describe("Synth controller", () => {
  describe(".create()", () => {
    it("should return status 201", async () => {
      const data = {
        name: "Test-synth",
        data: [],
        userId: 1
      };

      const response = httpMocks.createResponse();

      await synthController.create({ body: data }, response);
      assert.equal(response.statusCode, 201);
    });
    it("should return valid JSON", () => {});
  });
});
