if (typeof TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}
require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const {
  createFakeUserWithToken,
  createFakeProductLineItems,
} = require("../helpers");
const {
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");

describe("/api/checkout", () => {
  describe("POST /create-session", () => {
    xit("Creates a checkout session and returns session ID", async () => {
      const lineItems = await createFakeProductLineItems();
      const successUrl = "http://example.com/success";
      const cancelUrl = "http://example.com/cancel";

      const response = await request(app)
        .post("/api/checkout/create-session")
        .send({
          lineItems,
          successUrl,
          cancelUrl,
        });

      expectNotToBeError(response.body);
      expect(response.body).toHaveProperty("sessionId");
    });
  });

  describe("POST /success", () => {
    xit("Stores order data upon payment success", async () => {
      const sessionId = "fakeSessionId123"; // A mock.
      const totalAmount = 1500; // Example amount
      const products = await createFakeProductLineItems();

      const response = await request(app).post("/api/checkout/success").send({
        session_id: sessionId,
        total_amount: totalAmount,
        products,
      });

      expectNotToBeError(response.body);
      expect(response.body.order).toHaveProperty("sessionId", sessionId);
      expect(response.body.order).toHaveProperty("totalAmount", totalAmount);
      expect(response.body.order.products).toEqual(products);
    });
  });
});
