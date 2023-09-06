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
    destroyProduct,
    getOrderHistoryForProduct,
  } = require("../../db/models");
const { createFakeBikeProduct, createFakeOrderWithProduct } = require("../helpers");

describe('Product Database Functions', () => {
  describe('createProducts', () => {
    xit('creates a bike product', async () => {
            
      const bikeProductData = await createFakeBikeProduct();
          
      const createdBikeProduct = await createProducts(bikeProductData);
          
        expect(createdBikeProduct).toBeDefined();
        expect(createdBikeProduct.category).toBe(bikeProductData.category);
        expect(createdBikeProduct.brand).toBe(bikeProductData.brand);
        expect(createdBikeProduct.name).toBe(bikeProductData.name);
        expect(createdBikeProduct.description).toBe(bikeProductData.description);
        expect(createdBikeProduct.min_price).toStrictEqual(bikeProductData.min_price);
        expect(createdBikeProduct.currency_code).toBe(bikeProductData.currency_code);
        expect(createdBikeProduct.amount).toBe(bikeProductData.amount);
        expect(createdBikeProduct.availability).toBe(bikeProductData.availability);
        expect(createdBikeProduct.total_inventory).toBe(bikeProductData.total_inventory);
      });
  });

  describe('getAllProducts', () => {
    xit('selects and returns an array of all products', async () => {
      const numProducts = 11;
        for (let i = 0; i < numProducts; i++) {
          await createFakeBikeProduct();
        }

      const allProducts = await getAllProducts();

      expect(allProducts.length).toBe(numProducts);
    });
  });

  describe('getProductById', () => {
    xit('retrieves a product with the given ID', async () => {

      const fakeBikeProduct = await createFakeBikeProduct();

      const retrievedProduct = await getProductById(fakeBikeProduct.id);

      expect(retrievedProduct).toBeDefined();
      expect(retrievedProduct.id).toBe(fakeBikeProduct.id);
    });

    xit('returns null if no product exists with the provided ID', async () => {
      const nonExistingProduct = await getProductById(-1);

      expect(nonExistingProduct).toBeNull();
    });
  });

  describe('updateProduct', () => {
    xit('returns the updated product', async () => {
            
      const fakeBikeProduct = await createFakeBikeProduct();
        
      const updatedProductData = {
        productId: fakeBikeProduct.id,
        updatedFields: {
        name: 'New Name',
        },
      }; 
            
      const updatedProduct = await updateProduct(updatedProductData);
        
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.id).toBe(fakeBikeProduct.id); 
      expect(updatedProduct.name).toBe(updatedProductData.updatedFields.name); 
    });

    xit('does not update fields that are not passed in', async () => {
            
      const fakeBikeProduct = await createFakeBikeProduct();

      const updatedProductData = {
        productId: fakeBikeProduct.id,
        updatedFields: {
        name: 'New Name',
        },
      }; 
              
      const updatedProduct = await updateProduct(updatedProductData);

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.id).toBe(fakeBikeProduct.id);
      expect(updatedProduct.category).toBe(fakeBikeProduct.category);
    });

    xit('throws an error if product ID does not exist', async () => {
      const nonExistingProductId = 9999;
      const updatedFields = {
        name: 'New Name',
        description: 'New Description',
        // ...other properties
      };
        
      expect.assertions(1);
        
      try {
        await updateProduct({ productId: nonExistingProductId, updatedFields });
      } catch (error) {
        expect(error.message).toMatch(`Product with ID ${nonExistingProductId} not found.`);
      }
    });
  });

  describe('destroyProduct', () => {
    xit('removes product from database, and returns it', async () => {
          
      const bikeProduct = await createFakeBikeProduct();

      const deletedProduct = await destroyProduct(bikeProduct.id);

      expect(deletedProduct).toBeDefined();
      expect(deletedProduct.id).toBe(bikeProduct.id);
    
      const retrievedProduct = await getProductById(bikeProduct.id);
      expect(retrievedProduct).toBeNull();
    });
    
    // it('removes the product from associated orders', async () => {
    //     // Create a fake product and associated orders
    //     const fakeProduct = await createFakeBikeProduct();
    //     const fakeOrder1 = await createFakeOrderWithProduct(fakeProduct.id);
    //     const fakeOrder2 = await createFakeOrderWithProduct(fakeProduct.id);
    //     console.log("fake order data", fakeOrder1);
        
    //     // Delete the product
    //     const deletedProduct = await destroyProduct(fakeProduct.id);
        
    //     // Expect the deleted product to be defined
    //     expect(deletedProduct).toBeDefined();
        
    //     // Fetch the orders to verify that the product is removed
    //     const ordersAfterDeletion = await getOrderHistoryForProduct(fakeProduct.id);
        
    //     // Expect that no orders contain the deleted product ID
    //     ordersAfterDeletion.forEach(order => {
    //       expect(order.order_products).not.toContain(fakeProduct.id);
    //     });
    //   });
  });
});