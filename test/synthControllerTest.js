const assert = require("assert");
const expect = require("chai").expect;
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

const mockModels = {
  Synth: mockSynth,
  User: mockUser
};

const synthController = proxyquire("../server/controllers/synth", {
  "../models": mockModels
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
    it("should return the correct synth object", async () => {
      const data = {
        name: "Test-synth",
        data: [],
        userId: 1
      };

      const response = httpMocks.createResponse();

      await synthController.create({ body: data }, response);
      const returnData = response._getData().dataValues;
      expect(returnData).to.be.a("object");
      expect(returnData).to.have.property("id");
      expect(returnData).to.have.property("name");
      expect(returnData).to.have.property("data");
      expect(returnData).to.have.property("slug");
      expect(returnData).to.have.property("createdAt");
      expect(returnData).to.have.property("updatedAt");
    });
    it("should create a slug based on the name", async () => {
      const data = {
        name: "Test Synth with Kebab Case",
        data: [],
        userId: 1
      };

      const response = httpMocks.createResponse();

      await synthController.create({ body: data }, response);
      const returnData = response._getData().dataValues;
      expect(returnData.slug).to.equal("test-synth-with-kebab-case");
    });
  });
  describe(".query()", () => {
    it("should return status 200", async () => {
      const data = {
        name: "Test-synth",
        data: [],
        userId: 1
      };

      const response = httpMocks.createResponse();

      await synthController.create({ body: data }, response);
      await synthController.query({ params: { name: "test-synth" } }, response);
      assert.equal(response.statusCode, 200);
    });
    it("should return the correct synth object", async () => {
      const data = {
        name: "Test-synth",
        data: [],
        userId: 1
      };

      const response = httpMocks.createResponse();

      await synthController.create({ body: data }, response);
      await synthController.query({ params: { name: "test-synth" } }, response);

      const returnData = response._getData()[0].dataValues;

      expect(returnData).to.be.a("object");
      expect(returnData).to.have.property("id");
      expect(returnData).to.have.property("name");
      expect(returnData).to.have.property("data");
      expect(returnData).to.have.property("slug");
      expect(returnData).to.have.property("createdAt");
      expect(returnData).to.have.property("updatedAt");
    });
  });
});
