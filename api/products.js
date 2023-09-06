const express = require('express');
const router = express.Router();
const { 
  ProductError
} = require('../errors');
const {
  getProductById,
  getAllProducts,
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
