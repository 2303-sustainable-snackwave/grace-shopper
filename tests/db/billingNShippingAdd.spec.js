/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const client = require("../../db/client");
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
const { createFakeUser, createFakeShippingAddress, createFakeBillingAddress } = require("../helpers");

describe("Billing and Shipping Address Functions", () => {
  let testUserId;

  beforeAll(async () => {
    const fakeUser = await createFakeUser();
    testUserId = fakeUser.id;
    console.log("fakeUser:", fakeUser);
  });

  describe("createBillingAddress", () => {
    xit("should create a billing address", async () => {
      const fakeBillingAddressData = {
        street: "123 Main St",
        city: "Cityville",
        state: "State",
        postalCode: "12345",
        country: "Country"
      };

      const createdBillingAddress = await createBillingAddress({
        userId: testUserId,
        street: fakeBillingAddressData.street,
        city: fakeBillingAddressData.city,
        state: fakeBillingAddressData.state,
        postalCode: fakeBillingAddressData.postalCode,
        country: fakeBillingAddressData.country
    });

      expect(createdBillingAddress).toBeDefined();
      expect(createdBillingAddress.user_id).toBe(testUserId);
      expect(createdBillingAddress.street).toBe(fakeBillingAddressData.street);
    });
  });

  describe("addBillingAddressToUser", () => {
    xit("should add billing addresses to user", async () => {
      const fakeBillingAddressList = [
        {
          street: "456 Elm St",
          city: "Townsville",
          state: "State",
          postalCode: "54321",
          country: "Country"
        },
      ];

      const addedBillingAddresses = await addBillingAddressToUser({ 
        userId: testUserId, 
        billingAddressList: fakeBillingAddressList,
      });

      expect(addedBillingAddresses).toHaveLength(fakeBillingAddressList.length);
    });

  });

  describe("getBillingAddressByUserId", () => {
    xit("should get billing addresses by user ID", async () => {
      const billingAddresses = await getBillingAddressByUserId(testUserId);

      expect(billingAddresses).toBeDefined();
      expect(billingAddresses).toBeInstanceOf(Array);
    });

  });

  describe("createShippingAddress", () => {
    xit("should create a shipping address", async () => {
      const fakeShippingAddressData = {
        street: "789 Oak St",
        city: "Villageville",
        state: "State",
        postalCode: "98765",
        country: "Country"
      };

      const createdShippingAddress = await createShippingAddress({
        userId: testUserId,
        street: fakeShippingAddressData.street,
        city: fakeShippingAddressData.city,
        state: fakeShippingAddressData.state,
        postalCode: fakeShippingAddressData.postalCode,
        country: fakeShippingAddressData.country
    });


      expect(createdShippingAddress).toBeDefined();
      expect(createdShippingAddress.user_id).toBe(testUserId);
      expect(createdShippingAddress.street).toBe(fakeShippingAddressData.street);
    });
  });

  describe("addShippingAddressToUser", () => {
    xit("should add shipping addresses to user", async () => {
      
      const fakeShippingAddressList = [
        {
          street: "987 Maple St",
          city: "Forestville",
          state: "State",
          postalCode: "54321",
          country: "Country"
        },
      ];

      const addedShippingAddresses = await addShippingAddressToUser({ 
        userId: testUserId, 
        shippingAddressList: fakeShippingAddressList,
      });

      expect(addedShippingAddresses).toHaveLength(fakeShippingAddressList.length);
    });
  });

  describe("getShippingAddressByUserId", () => {
    xit("should get shipping addresses by user ID", async () => {
      const shippingAddresses = await getShippingAddressByUserId(testUserId);

      expect(shippingAddresses).toBeDefined();
      expect(shippingAddresses).toBeInstanceOf(Array);
    });
  });

  describe('updateUserBillingAddress', () => {
    xit("should update a user's billing address", async () => {
      
      const fakeBillingAddress = await createFakeBillingAddress(testUserId);

      const updatedBillingAddress = await updateUserBillingAddress({
        userId: testUserId,
        addressId: fakeBillingAddress.id,
        updatedAddressData: {
          street: '456 Oak St',
          city: 'Cityville',
          state: 'New State',
          postalCode: '12345',
          country: 'Country',
        }
      });

      expect(updatedBillingAddress.street).toBe('456 Oak St');
      expect(updatedBillingAddress.city).toBe('Cityville');
      expect(updatedBillingAddress.state).toBe('New State');
      expect(updatedBillingAddress.postal_code).toBe('12345');
      expect(updatedBillingAddress.country).toBe('Country');
    });
  });

  describe('updateUserShippingAddress', () => {
    xit("should update a user's shipping address", async () => {
      
      const fakeShippingAddress = await createFakeShippingAddress(testUserId);
    
      const updatedShippingAddress = await updateUserShippingAddress({
        userId: testUserId,
        addressId: fakeShippingAddress.id,
        updatedAddressData: {
          street: '456 Oak St',
          city: 'Cityville',
          state: 'New State',
          postalCode: '12345',
          country: 'Country',
        }
      });
  
      expect(updatedShippingAddress.street).toBe('456 Oak St');
      expect(updatedShippingAddress.city).toBe('Cityville');
      expect(updatedShippingAddress.state).toBe('New State');
      expect(updatedShippingAddress.postal_code).toBe('12345');
      expect(updatedShippingAddress.country).toBe('Country');
    });
  });

  describe('deleteBillingAddress', () => {
    xit("should delete a user's billing address", async () => {

      const fakeBillingAddress = await createFakeBillingAddress(testUserId);

      const isDeleted = await deleteBillingAddress(fakeBillingAddress.id);
  
      expect(isDeleted).toBe(true);
  
      const billingAddresses  = await getBillingAddressByUserId(testUserId);
      expect(billingAddresses).toHaveLength(0);
    });
  
    xit('should throw an error when trying to delete a non-existent address', async () => {
      const userId = 1; 
      const addressId = 999; 
  
      await expect(deleteBillingAddress(userId, addressId)).rejects.toThrow();
    });
  });

  describe('deleteShippingAddress', () => {
    xit("should delete a user's shipping address", async () => {
      const fakeShippingAddress = await createFakeShippingAddress(testUserId);

      const isDeleted = await deleteShippingAddress(fakeShippingAddress.id);

      expect(isDeleted).toBe(true);

      const shippingAddresses  = await getShippingAddressByUserId(testUserId);
      expect(shippingAddresses).toHaveLength(0);
    });

    xit('should throw an error when trying to delete a non-existent address', async () => {
      const userId = 1; 
      const addressId = 999; 
  
      await expect(deleteShippingAddress(userId, addressId)).rejects.toThrow();
    });
  });

});