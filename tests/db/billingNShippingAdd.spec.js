/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const { faker } = require('@faker-js/faker');
const {
  createBillingAddress,
  addBillingAddressToUser,
  getBillingAddressByUserId,
  createShippingAddress,
  addShippingAddressToUser,
  getShippingAddressByUserId,
  deleteShippingAddress,
  deleteBillingAddress,
  updateUserBillingAddress,
  updateUserShippingAddress,
} = require("../../db/models");
const { createFakeUser } = require("../helpers");

describe("Billing and Shipping Address Functions", () => {
  let testUserId;

  beforeAll(async () => {
    const fakeUser = await createFakeUser({ role: 'user' });
    testUserId = fakeUser.id;
  });

  describe("createBillingAddress", () => {
    it("should create a billing address", async () => {
      const fakeBillingAddressData = {
        street: "123 Main St",
        city: "Cityville",
        state: "State",
        postalCode: "12345",
        country: "Country"
      };

      const createdBillingAddress = await createBillingAddress(
        testUserId,
        fakeBillingAddressData.street,
        fakeBillingAddressData.city,
        fakeBillingAddressData.state,
        fakeBillingAddressData.postalCode,
        fakeBillingAddressData.country
      );

      expect(createdBillingAddress).toBeDefined();
      expect(createdBillingAddress.user_id).toBe(testUserId);
      expect(createdBillingAddress.street).toBe(fakeBillingAddressData.street);
    });
  });

  describe("addBillingAddressToUser", () => {
    it("should add billing addresses to user", async () => {
      const fakeBillingAddressList = [
        {
          street: "456 Elm St",
          city: "Townsville",
          state: "State",
          postalCode: "54321",
          country: "Country"
        },
      ];

      const addedBillingAddresses = await addBillingAddressToUser(
        testUserId,
        fakeBillingAddressList
      );

      expect(addedBillingAddresses).toHaveLength(fakeBillingAddressList.length);
    });

  });

  describe("getBillingAddressByUserId", () => {
    it("should get billing addresses by user ID", async () => {
      const billingAddresses = await getBillingAddressByUserId(testUserId);

      expect(billingAddresses).toBeDefined();
      expect(billingAddresses).toBeInstanceOf(Array);
    });

  });

  describe("createShippingAddress", () => {
    it("should create a shipping address", async () => {
      const fakeShippingAddressData = {
        street: "789 Oak St",
        city: "Villageville",
        state: "State",
        postalCode: "98765",
        country: "Country"
      };

      const createdShippingAddress = await createShippingAddress(
        testUserId,
        fakeShippingAddressData.street,
        fakeShippingAddressData.city,
        fakeShippingAddressData.state,
        fakeShippingAddressData.postalCode,
        fakeShippingAddressData.country
      );

      expect(createdShippingAddress).toBeDefined();
      expect(createdShippingAddress.user_id).toBe(testUserId);
      expect(createdShippingAddress.street).toBe(fakeShippingAddressData.street);
    });
  });

  describe("addShippingAddressToUser", () => {
    it("should add shipping addresses to user", async () => {
      const fakeShippingAddressList = [
        {
          street: "987 Maple St",
          city: "Forestville",
          state: "State",
          postalCode: "54321",
          country: "Country"
        },
      ];

      const addedShippingAddresses = await addShippingAddressToUser(
        testUserId,
        fakeShippingAddressList
      );

      expect(addedShippingAddresses).toHaveLength(fakeShippingAddressList.length);
    });
  });

  describe("getShippingAddressByUserId", () => {
    it("should get shipping addresses by user ID", async () => {
      const shippingAddresses = await getShippingAddressByUserId(testUserId);

      expect(shippingAddresses).toBeDefined();
      expect(shippingAddresses).toBeInstanceOf(Array);
    });
  });

 
  describe("deleteBillingAddress", () => {
    it("should delete a user's billing address", async () => {
      const billingAddress = await createBillingAddress(
        testUserId,
        "123 Main St",
        "Cityville",
        "State",
        "12345",
        "Country"
      );

      const isDeleted = await deleteBillingAddress(testUserId, billingAddress.id);

      expect(isDeleted).toBe(true);
    });
  });

  describe("deleteShippingAddress", () => {
    it("should delete a user's shipping address", async () => {
      const shippingAddress = await createShippingAddress(
        testUserId,
        "789 Oak St",
        "Villageville",
        "State",
        "98765",
        "Country"
      );

      const isDeleted = await deleteShippingAddress(testUserId, shippingAddress.id);

      expect(isDeleted).toBe(true);
    });
  });
});