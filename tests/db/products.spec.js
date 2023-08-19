/*

DO NOT CHANGE THIS FILE

*/
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const {
    createProducts,
    getProductById,
    getProductsWithoutOrders,
    getAllProducts,
    updateProduct,
    destroyProduct
  } = require("../../db/models");
const { createFakeBikeProduct } = require("../helpers");

describe('Product Database Functions', () => {
    describe('createProducts', () => {
        it('creates a bike product when called by an admin user', async () => {
            // Arrange: Generate random bike product data using the helper function
            const bikeProductData = await createFakeBikeProduct();
          
            // Act: Create the bike product using the createProducts function
            const createdBikeProduct = await createProducts(bikeProductData, adminUser.role);
          
            // Assert: Check if the bike product was created successfully
            expect(createdBikeProduct).toBeDefined();
            expect(createdBikeProduct.category).toBe(bikeProductData.category);
            expect(createdBikeProduct.brand).toBe(bikeProductData.brand);
            // Add more assertions for other bike-specific fields
        });
    });

});