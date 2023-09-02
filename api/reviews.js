const express = require('express');
const router = express.Router();
const { verifyToken, isAuthorizedToUpdate } = require('./authMiddleware');
const { 
  ReviewValidationFailedError,
  ReviewError
} = require('../errors');
const {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} = require('../db/models/reviews');

// POST /api/reviews
router.post('/', verifyToken, async (req, res, next) => {
  try {
    
    const { productId, rating, reviewText } = req.body;

    const userId = req.user.userId; 

    const newReview = await createReview({
      productId,
      userId,
      rating,
      reviewText,
      reviewDate: new Date(), 
    });

    res.json(newReview);
  } catch (error) {
    next(new ReviewValidationFailedError('There was an error creating review'));
  }
});

// GET /api/reviews
router.get('/', async (req, res, next) => {
  try {
    const reviews = await getAllReviews();

    res.json(reviews);
  } catch (error) {
    next(new ReviewError('There was an error retrieving the reviews.'));
  }
});

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const productReviews = await getReviewsByProduct(productId);

    res.json(productReviews);
  } catch (error) {
    next(new ReviewError('There was an error retrieving reviews for this product.'));
  }
});

// GET /api/reviews/user/:userId
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userReviews = await getReviewsByUser(userId);

    res.json(userReviews);
  } catch (error) {
    next(new ReviewError('There was an error retrieving reviews for this user.'));
  }
});

// PATCH /api/reviews/:reviewId
router.patch('/:reviewId', verifyToken, isAuthorizedToUpdate, async (req, res, next) => {
  try {
    
    const { rating, reviewText } = req.body;
    const { reviewId } = req.params;

    const existingReview = await getReviewById(reviewId);

    if (!existingReview) {
      throw new ReviewError('Review not found.');
    }

    const updatedReview = await updateReview({
      reviewId,
      rating,
      reviewText,
    });

    res.json(updatedReview);
  } catch (error) {
    return next(new ReviewError('There was an error updating the review details.'));
  }
});

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', verifyToken, isAuthorizedToUpdate, async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const existingReview = await getReviewById(reviewId);

    if (!existingReview) {
      throw new ReviewError('Review not found.');
    }

    const deletedReview = await deleteReview(reviewId);

    if (!deletedReview) {
      throw new ReviewError('Error deleting the review.');
    }

    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    return next(new ReviewError('There was an error deleting the review.'));
  }
});

module.exports = router;
