const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('./authMiddleware');
const { 
  ProductError,
  ProductValidationFailedError
} = require('../errors');
const {
  createProducts,
  getProductById,
  getProductsWithoutOrders,
  getAllProducts,
  updateProduct,
  destroyProduct,
} = require('../db/models/products');


// POST /api/products
router.post('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const {
      category,
      brand,
      name,
      imageUrl,
      description,
      min_price,
      max_price,
      currency_code,
      amount,
      availability,
      total_inventory,
    } = req.body;

    const newProduct = await createProducts({
      category,
      brand,
      name,
      imageUrl,
      description,
      min_price,
      max_price,
      currency_code,
      amount,
      availability,
      total_inventory,
    });

    res.json(newProduct);
  } catch (error) {
    next(new ProductValidationFailedError('There was an error creating product'));
  }
});

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

// PATCH /api/products/:productId
router.patch('/products/:productId', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updatedFields = req.body;

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      throw new ProductError('Product not found');
    }

    const updatedProduct = await updateProduct({ productId, updatedFields });

    res.json(updatedProduct);
  } catch (error) {
    next(new ProductError('There was an error updating the product details.'));
  }
});

// DELETE /api/products/:productId
router.delete('/products/:productId', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      throw new ProductError('Product not found');
    }

    const deletedProduct = await destroyProduct(productId);

    if (!deletedProduct) {
      throw new ProductError('Error deleting the product');
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(new ProductError('There was an error deleting the product'));
  }
});

// GET /api/products/without-orders
router.get('/products/without-orders', async (req, res, next) => {
  try {
    
    const productsWithoutOrders = await getProductsWithoutOrders();

    if (!productsWithoutOrders) {
      throw new ProductError('No products without orders found.');
    }

    res.json(productsWithoutOrders);
  } catch (error) {
    next(new ProductError('There was an error retrieving products without orders.'));
  }
});

module.exports = router;
