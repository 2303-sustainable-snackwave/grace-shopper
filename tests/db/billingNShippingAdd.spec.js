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
    const fakeUser = await createFakeUser({ role: 'user' });
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

      const addedBillingAddresses = await addBillingAddressToUser(
        testUserId,
        fakeBillingAddressList
      );

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

      const addedShippingAddresses = await addShippingAddressToUser(
        testUserId,
        fakeShippingAddressList
      );

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
    
      await addBillingAddressToUser(testUserId, [fakeBillingAddress]);
    
      const updatedBillingAddress = await updateUserBillingAddress(
        testUserId,
        fakeBillingAddress.id,
        {
          street: '456 Oak St',
          city: 'Cityville',
          state: 'New State',
          postalCode: '12345',
          country: 'Country',
        }
      );
  
  
      expect(updatedBillingAddress).toBeDefined();
      expect(updatedBillingAddress.street).toBe('456 Oak St');
      expect(updatedBillingAddress.city).toBe('Cityville');
  
      const retrievedBillingAddresses = await getBillingAddressByUserId(testUserId);
  
      expect(retrievedBillingAddresses.length).toBe(1);
      expect(retrievedBillingAddresses[0].street).toBe('456 Oak St');
      expect(retrievedBillingAddresses[0].city).toBe('Cityville');
    });
  });

  describe('updateUserShippingAddress', () => {
    xit("should update a user's shipping address", async () => {
      
      const fakeShippingAddress = await createFakeShippingAddress(testUserId);
    
      await addShippingAddressToUser(testUserId, [fakeShippingAddress]);
    
      const updatedShippingAddress = await updateUserShippingAddress(
        testUserId,
        fakeShippingAddress.id,
        {
          street: '456 Oak St',
          city: 'Cityville',
          state: 'New State',
          postalCode: '12345',
          country: 'Country',
        }
      );
  
      expect(updatedShippingAddress).toBeDefined();
      expect(updatedShippingAddress.street).toBe('456 Oak St');
      expect(updatedShippingAddress.city).toBe('Cityville');
  
      const retrievedShippingAddresses = await getShippingAddressByUserId(testUserId);
  
      expect(retrievedShippingAddresses.length).toBe(1);
      expect(retrievedShippingAddresses[0].street).toBe('456 Oak St');
      expect(retrievedShippingAddresses[0].city).toBe('Cityville');
    });
  });

  describe('deleteBillingAddress', () => {
    xit('should delete a user\'s billing address', async () => {
      const fakeBillingAddress = await createFakeBillingAddress(testUserId);
      await addBillingAddressToUser(testUserId, [fakeBillingAddress]);
      const result = await deleteBillingAddress(testUserId, fakeBillingAddress.id);
      expect(result).toBe(true);
  
      const addressQuery = await client.query(
        `SELECT * FROM billing_addresses WHERE id = $1`,
        [fakeBillingAddress.id]
      );
      const userBillingQuery = await client.query(
        `SELECT * FROM user_billing_addresses WHERE id = $1`,
        [fakeBillingAddress.id]
      );
  
      expect(addressQuery.rows.length).toBe(0);
      expect(userBillingQuery.rows.length).toBe(0);
    });
  
    xit('should throw an error when trying to delete a non-existent address', async () => {
      const userId = 1; 
      const addressId = 999; 
  
      await expect(deleteBillingAddress(userId, addressId)).rejects.toThrow();
    });
  
    xit('should throw an error when user doesn\'t have permission to delete the address', async () => {
      const userId = 2; 
      const addressId = 1; 
  
      await expect(deleteBillingAddress(userId, addressId)).rejects.toThrow();
    });
  });

  describe('deleteShippingAddress', () => {
    xit("should delete a user's shipping address", async () => {
      const fakeShippingAddress = await createFakeShippingAddress(testUserId);
      console.log("fakeShippingAddress:", fakeShippingAddress);

      await addShippingAddressToUser(testUserId, [fakeShippingAddress]);

      const result = await deleteShippingAddress(testUserId, fakeShippingAddress.id);
      console.log("Deletion result:", result);
  
      const addressQuery = await client.query(
        `SELECT * FROM shipping_addresses WHERE id = $1`,
        [fakeShippingAddress.id]
      );
      console.log("Address query result:", addressQuery.rows);
  
      const userShippingQuery = await client.query(
        `SELECT * FROM user_shipping_addresses WHERE id = $1`,
        [fakeShippingAddress.id]
      );
      console.log("User shipping query result:", userShippingQuery.rows);
  
      expect(result).toBe(true);
      expect(addressQuery.rows.length).toBe(0);
      expect(userShippingQuery.rows.length).toBe(0);
    });

    xit('should throw an error when trying to delete a non-existent address', async () => {
      const userId = 1; 
      const addressId = 999; 
  
      await expect(deleteShippingAddress(userId, addressId)).rejects.toThrow();
    });
  
    xit('should throw an error when user doesn\'t have permission to delete the address', async () => {
      const userId = 2; 
      const addressId = 1; 
  
      await expect(deleteShippingAddress(userId, addressId)).rejects.toThrow();
    });
  });

});