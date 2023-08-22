
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
const { createFakeUser, createFakeBikeProduct } = require("../helpers");

describe('Product Database Functions', () => {
    describe('createProducts', () => {
        xit('creates a bike product when called by an admin user', async () => {
            
            const adminUser = await createFakeUser({ role: 'admin' });
            const bikeProductData = await createFakeBikeProduct();
          
            const createdBikeProduct = await createProducts(bikeProductData, adminUser.role);
          
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

        xit('throws an error if a non-admin user tries to create a product', async () => {
            const nonAdminUser = await createFakeUser({ role: 'user' });
            const bikeProductData = await createFakeBikeProduct();

            await expect(createProducts(bikeProductData, nonAdminUser)).rejects.toThrow('Only admin users can create products.');
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

            const adminUser = await createFakeUser({ role: 'admin' });
            const fakeBikeProduct = await createFakeBikeProduct(adminUser);

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
        xit('only an "admin" can update products', async () => {
            
            const fakeBikeProduct = await createFakeBikeProduct();

            await expect(
                updateProduct(
                  fakeBikeProduct.id, 
                  { description: 'super extra bike shocks'},
                  'user'
                  )
            ).rejects.toThrow('Only admin users can update products.');
        });

        xit('returns the updated product', async () => {
            
            const adminUser = await createFakeUser({ role: 'admin' });
            const fakeBikeProduct = await createFakeBikeProduct();

            const updatedProduct = await updateProduct(fakeBikeProduct.id, { name: 'New Name' }, adminUser.role);

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct.id).toBe(fakeBikeProduct.id);
            expect(updatedProduct.name).toBe('New Name');
        });

        xit('does not update fields that are not passed in', async () => {
            
            const adminUser = await createFakeUser({ role: 'admin' });
            const fakeBikeProduct = await createFakeBikeProduct();

            const updatedProduct = await updateProduct(fakeBikeProduct.id, { name: 'New Name' }, adminUser.role);

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct.id).toBe(fakeBikeProduct.id);
            expect(updatedProduct.category).toBe(fakeBikeProduct.category);
        });

        xit('throws an error if product ID does not exist', async () => {
            
            const adminUser = await createFakeUser({ role: 'admin' });

            await expect(
                updateProduct(-1, { name: 'New Name' }, adminUser.role)
            ).rejects.toThrow('Could not update product: Product with ID -1 not found.');
        });
    });

    describe('destroyProduct', () => {
        xit('throws an error if a non-admin user tries to delete a product', async () => {
            
            const user = await createFakeUser({ role: 'user' });
    
            await expect(destroyProduct(1, user.role)).rejects.toThrow("Only admin users can delete products.");
        });
    
        xit('removes product from database, and returns it', async () => {
            
            const adminUser = await createFakeUser({ role: 'admin' });
            const bikeProduct = await createFakeBikeProduct();

            const deletedProduct = await destroyProduct(bikeProduct.id, adminUser.role);

            expect(deletedProduct).toBeDefined();
            expect(deletedProduct.id).toBe(bikeProduct.id);
    
            const retrievedProduct = await getProductById(bikeProduct.id);
            expect(retrievedProduct).toBeNull();
        });
    
        // xit('removes the product from associated orders', async () => {
            
        //     const adminUser = await createFakeUser({ role: 'admin' });
    
        //     const bikeProduct = await createFakeBikeProduct(adminUser);
    
        //     const fakeOrder = await createFakeOrder([bikeProduct]);
    
        //     await destroyProduct(bikeProduct.id, adminUser.role);
    
        //     const ordersWithoutProduct = await getProductsWithoutOrders();
        //     expect(ordersWithoutProduct).toContainEqual(fakeOrder);
        // });
    });
});
