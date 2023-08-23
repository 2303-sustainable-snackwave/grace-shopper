if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const request = require("supertest");
const faker = require("faker");
const app = require("../../app");
const { 
  createFakeUserWithToken,
  createFakeProduct 
} = require("../helpers");
const {
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");
const { 
  UnauthorizedError,
  ProductNotFoundError,
  DuplicateProductError 
} = require("../../errors");

describe("/api/products", () => {

  describe("GET /api/products", () => {
    it("Returns a list of products", async () => {
      const { fakeUser } = await createFakeUserWithToken();
      const fakeProduct = await createFakeProduct("Cool Sneakers", "Best shoes ever.");

      const response = await request(app).get("/api/products");

      expectNotToBeError(response.body);

      expect(response.body).toContainEqual(expect.objectContaining(fakeProduct));
    });
  });

  describe("POST /api/products (*)", () => {
    it("Creates a new product", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();

      const productData = {
        name: "TOTALLY RADICAL BMX KNEESCRAPER 5000!",
        description: "Bloody knees sold seperately.",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .send(productData);

      expectNotToBeError(response.body);
      expect(response.body).toEqual(expect.objectContaining(productData));
    });
  });

  

});

