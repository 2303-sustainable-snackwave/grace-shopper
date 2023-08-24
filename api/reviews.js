const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const {
  createReview,
  getAllReviews,
  getReviewsByProduct,
} = require('../db/models/review');

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { productId, userId, rating, reviewText, reviewDate } = req.body;
    const newReview = await createReview({ productId, userId, rating, reviewText, reviewDate });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review.' });
  }
});

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await getReviewsByProduct(productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews for product.' });
  }
});

module.exports = router;