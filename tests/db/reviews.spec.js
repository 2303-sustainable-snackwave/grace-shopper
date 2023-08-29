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
    describe("createReview", () => {
      it("should create a review", async () => {

        const user = await createFakeUser();
        const product = await createFakeBikeProduct();
        
        const fakeReviewData = {
          productId: product.id,
          userId: user.id,
          rating: 5,
          reviewText: "Great product!",
          reviewDate: new Date(),
        };
        
        const review = await createReview(fakeReviewData);
        
        expect(review.userId).toBe(user.id);
        expect(review.productId).toBe(product.id);
      });
    });
  
    describe("getAllReviews", () => {
      it("should get all reviews", async () => {
        
        const reviews = await getAllReviews();
  
        expect(Array.isArray(reviews)).toBe(true);
      });
    });
  
    describe("getReviewsByProduct", () => {
      it("should get reviews for a product", async () => {
        
        const product = await createFakeBikeProduct();
        await createFakeReviews(product.id, 3); 
        
        const reviews = await getReviewsByProduct(product.id);
  
        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBe(3);
      });
    });
  
    describe("updateReview", () => {
      it("should update a review", async () => {

        const user = await createFakeUser();
        const product = await createFakeBikeProduct();
        const reviews = await createFakeReviews(product.id, 1);
        
        const updatedReview = await updateReview({
          reviewId: reviews[0].id,
          rating: 4,
          reviewText: "Updated review text",
        });
  
        expect(updatedReview.userId).toBe(user.id);
        expect(updatedReview.productId).toBe(product.id);
        expect(updatedReview.rating).toBe(4);
      });
  
    });
  
    describe("deleteReview", () => {
      it("should delete a review", async () => {

        const product = await createFakeBikeProduct();
        const reviews = await createFakeReviews(product.id, 1); 
        
        const deletedReview = await deleteReview(reviews[0].id);
  
        expect(deletedReview.productId).toBe(product.id);
      });
    });
  });