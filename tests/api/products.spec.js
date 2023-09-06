if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
require("dotenv").config();
const request = require("supertest");
const { faker } = require('@faker-js/faker');
const app = require("../../app");
const { 
  createFakeUserWithToken,
  createFakeBikeProduct 
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

describe("Product API Routes", () => {
  describe("POST /api/products", () => {
    xit('should create a new product', async () => {
      const { fakeUser, token } = await createFakeUserWithToken("Jan Smith", "jan@example.com", true);
      
      const newProduct = {
        category: 'Electronics',
        brand: 'Example Brand',
        name: 'Example Product',
        imageUrl: 'https://example.com/product-image.jpg',
        description: 'A sample product description.',
        min_price: 99.99,
        max_price: 199.99,
        currency_code: 'USD',
        amount: 10.5,
        availability: true,
        total_inventory: 100,
      };
  
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct);
  
      expect(response.status).toBe(200);
  
      expect(response.body).toHaveProperty('id');
      expect(response.body.category).toBe(newProduct.category);
      expect(response.body.brand).toBe(newProduct.brand);
      expect(response.body.name).toBe(newProduct.name);
    });

    xit('non-admin cannot create product', async () => {
    
      const { fakeUser, token } = await createFakeUserWithToken("John Doe", "john@example.com", false);
      console.log("fake user data", fakeUser, token);

      const newProduct = {
        category: 'Electronics',
        brand: 'Example Brand',
        name: 'Example Product',
        imageUrl: 'https://example.com/product-image.jpg',
        description: 'A sample product description.',
        min_price: 99.99,
        max_price: 199.99,
        currency_code: 'USD',
        amount: 10.5,
        availability: true,
        total_inventory: 100,
      };
  
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct);
        console.log("Response:", response.status, response.body); 

      expect(response.status).toBe(403);
  
      expect(response.body).toHaveProperty('error', 'You do not have permission to access this feature.');
    });
  });

  describe("GET /api/products", () => {
    xit("should retrieve a list of products", async () => {
      const product1 = await createFakeBikeProduct();
      const product2 = await createFakeBikeProduct();

      const response = await request(app)
        .get('/api/products')
        .expect(200); 
  
      expect(Array.isArray(response.body)).toBe(true); 
      expect(response.body.length).toBeGreaterThan(0); 
      // For example, if each product has a 'name' property:
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe("GET /api/products/:productId", () => {
    xit("should retrieve a product by ID", async () => {
      
      const product1 = await createFakeBikeProduct();
      const product2 = await createFakeBikeProduct();
 
      const response = await request(app).get(`/api/products/${product1.id}`);
  
      expect(response.status).toBe(200);
  
      expect(response.body).toHaveProperty("id", product1.id);
      expect(response.body).toHaveProperty("name"); 
    });
  
    xit("should handle product not found error", async () => {
      
      const nonExistentProductId = 999;
  
      const response = await request(app).get(`/api/products/${nonExistentProductId}`);
  
      expect(response.status).toBe(404);
  
      expect(response.body).toHaveProperty("error", "There was an error retrieving the product.");
    });
  });

  describe("PATCH /api/products/:productId", () => {
    xit("should update a product successfully", async () => {
      const { fakeUser, token } = await createFakeUserWithToken("Jan Smith", "jan@example.com", true);
      console.log('fake user data', fakeUser, token);

      const product1 = await createFakeBikeProduct();
      console.log('fake product data', product1);

      const updatedProduct = {
        id: product1.id,
        name: "Updated Product Name",
        description: "Updated product description",
      };
  
      console.log('Before making the request');
      const response = await request(app)
        .patch(`/api/products/${product1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct);
      console.log('After making the request');

      // Check if the response status is 200 OK
      expect(response.status).toBe(200);
  
      // Check if the response body contains the updated product
      expect(response.body).toHaveProperty("name", updatedProduct.name);
      expect(response.body).toHaveProperty("description", updatedProduct.description);
      // Add assertions for other updated fields here
    });
  
    // xit("should handle product not found error when updating", async () => {
    //   // Choose a productId that does not exist in your database
    //   const nonExistentProductId = 999; // Replace with a non-existent product ID
  
    //   // Replace with an updated product object
    //   const updatedProduct = {
    //     // Include the fields you want to update
    //     name: "Updated Product Name",
    //     description: "Updated product description",
    //     // Add other updated fields here
    //   };
  
    //   // Make a PATCH request to update a non-existent product
    //   const response = await request(app)
    //     .patch(`/api/products/${nonExistentProductId}`)
    //     .send(updatedProduct);
  
    //   // Check if the response status is 404 Not Found
    //   expect(response.status).toBe(404);
  
    //   // Check if the response contains an error message indicating that the product was not found
    //   expect(response.body).toHaveProperty("error", "Product not found");
  
    //   // Customize the error message and error details according to your implementation
    // });
  
    // xit("should handle validation errors when updating", async () => {
    //   // Replace with an existing product ID from your database
    //   const existingProductId = 1; // Replace with an existing product ID
  
    //   // Replace with an invalid update object (e.g., missing required fields)
    //   const invalidUpdate = {
    //     // Missing required fields
    //     // Adjust this object to simulate validation errors
    //   };
  
    //   // Make a PATCH request with an invalid update object
    //   const response = await request(app)
    //     .patch(`/api/products/${existingProductId}`)
    //     .send(invalidUpdate);
  
    //   // Check if the response status is 422 Unprocessable Entity
    //   expect(response.status).toBe(422);
  
    //   // Check if the response contains an error message indicating validation errors
    //   expect(response.body).toHaveProperty("error", "Validation failed");
  
    //   // Customize the error message and error details according to your validation rules
    // });
  });
});