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
    createReview,
    getAllReviews,
    getReviewsByProduct,
    updateReview,
    deleteReview
  } = require("../../db/models");
const { createFakeUser, createFakeBikeProduct, createFakeReviews } = require("../helpers");

describe("Review Functions", () => {
  let testUserId;

  beforeAll(async () => {
    const fakeUser = await createFakeUser({ role: 'user' });
    testUserId = fakeUser.id;
  });

  describe('createReview', () => {
    xit('creates a new review', async () => {

      const product = await createFakeBikeProduct();

      const reviewData = {
        productId: product.id,
        userId: testUserId, 
        rating: 5,
        reviewText: 'Awesome product!',
        reviewDate: new Date(),
      };

      const createdReview = await createReview(reviewData);

      expect(createdReview).toBeDefined();
      expect(createdReview.product_id).toBe(reviewData.productId);
      expect(createdReview.user_id).toBe(testUserId);
      expect(createdReview.rating).toBe(reviewData.rating);
      expect(createdReview.review_text).toBe(reviewData.reviewText);
      expect(createdReview.review_date).toEqual(reviewData.reviewDate);
    });
  });
  
    describe("getAllReviews", () => {
      xit("should get all reviews", async () => {
        
        const reviews = await getAllReviews();
  
        expect(Array.isArray(reviews)).toBe(true);
      });
    });
  
    describe("getReviewsByProduct", () => {
      xit("should get reviews for a product", async () => {
        
        const product = await createFakeBikeProduct();
        await createFakeReviews(product.id, testUserId, 3); 
        
        const reviews = await getReviewsByProduct(product.id);
  
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(3);
      });
    });
  
    describe("updateReview", () => {
      xit("should update a review", async () => {

        const product = await createFakeBikeProduct();
        const reviews = await createFakeReviews(product.id, testUserId, 1);

        const updatedReview = await updateReview({
          reviewId: reviews[0].id,
          rating: 4,
          reviewText: "Updated review text",
        });

        expect(updatedReview.user_id).toBe(testUserId);
        expect(updatedReview.product_id).toBe(product.id);
        expect(updatedReview.rating).toBe(4);
      });
  
    });
  
    describe("deleteReview", () => {
      xit("should delete a review", async () => {

        const product = await createFakeBikeProduct();
        const reviews = await createFakeReviews(product.id, testUserId, 1); 

        const deletedReview = await deleteReview(reviews[0].id);

        expect(deletedReview.product_id).toBe(product.id);
      });
    });
  });
  