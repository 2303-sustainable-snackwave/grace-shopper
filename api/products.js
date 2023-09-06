const express = require('express');
const router = express.Router();
const { 
  ProductError
} = require('../errors');
const {
  getProductById,
  getAllProducts,
  searchProducts,
} = require('../db/models/products');


// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(new ProductError('There was an error retrieving the products.'));
  }
});

// GET /api/products/search
router.get('/search', async (req, res, next) => {
  try {
      const { query } = req.query;
      if (!query) {
          return res.status(400).json({ error: 'Query parameter is required' });
      }
      const products = await searchProducts(query);
      res.json(products);
  } catch (error) {
      next(new ProductError('There was an error searching for products.'));
  }
});

// GET /api/products/:productId
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);

    if (!product) {
      throw new ProductError('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(new ProductError('There was an error retrieving the product.'));
  }
});

module.exports = router;