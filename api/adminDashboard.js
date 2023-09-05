const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin} = require('./authMiddleware');
const {
    createProducts,
    getProductById,
    getProductsWithoutOrders,
    updateProduct,
    destroyProduct,
    createProductCategory,
    updateUser,
    updateOrdersByStatus,
    createProductCategory,
    deleteCategory,
    deleteUser,
    updateCategory
  } = require('../db/models');
const {
  ProductValidationFailedError,
  ProductError,
  OrderHistoryError,
  AuthenticationError,
  UserError,
  PermissionError
} = require('../errors');
const ORDER_STATUSES = require('./orderStatus.js');


router.use(isAdmin, verifyToken);

// Create a new product
router.post('/admin/products', async (req, res, next) => {
  try {
    const {
      category_id,
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

    const product = await createProducts({
      category_id,
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

    res.status(201).json(product);
  } catch (error) {
    next(new ProductValidationFailedError('There was an error creating the product: ' + error.message));
  }
});

// Edit an existing product
router.patch('/admin/products/:productId', async (req, res, next) => {
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

// Delete an existing product
router.delete('/admin/products/:productId', async (req, res, next) => {
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

// Get all products without orders
router.get('/admin/products/without-orders', async (req, res, next) => {
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

// Create a new category
router.post('/admin/categories', async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await createProductCategory(name);

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    next(new ProductValidationFailedError('There was an error creating the product category: ' + error.message));
  }
});

// Update a category by ID
router.patch('/admin/categories/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { newName } = req.body;

    const updatedCategory = await updateCategory(categoryId, newName);

    if (!updatedCategory) {
      throw new ProductError('Category not found');
    }

    res.json(updatedCategory);
  } catch (error) {
    next(new ProductError('There was an error updating category.'));
  }
});

// Delete a category by ID
router.delete('/admin/categories/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await deleteCategory(categoryId);

    if (!deletedCategory) {
        throw new ProductError('Category not found');
    }

    res.json(deletedCategory);
  } catch (error) {
    next(new ProductError('There was an error deleting category.'));
  }
});

// View and filter orders
router.get('/admin/orders', async (req, res, next) => {
  try {
    const orders = await getAllOrders();

    res.json(orders);
  } catch (error) {
    next(new OrderHistoryError('There was an error fetching orders.'));
  }
});

// Filter by order status
router.get('/admin/orders/:status', async (req, res, next) => {
  try {
    const { status } = req.params;

    const orders = await getOrdersByStatus(status);

    res.json(orders);
  } catch (error) {
    next(new OrderHistoryError('There was an error fetching orders.'));
  }
});

// Update order status
router.put('/admin/orders/:orderId/status', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const { newStatus } = req.body;

    if (!Object.values(ORDER_STATUSES).includes(newStatus)) {
      throw new OrderHistoryError('Order status not found');
    }

    const updatedOrder = await updateOrdersByStatus(orderId, newStatus);

    res.json(updatedOrder);
  } catch (error) {
    next(new OrderHistoryError('There was an error updating order status.'));
  }
});

// PATCH /admin/users/:userId/promote
router.patch('/admin/users/:userId/promote', async (req, res, next) => {
  try {
    const { userId: targetUserId } = req.params;
    const { is_admin: isAdminUpdate } = req.body;

    if (isAdminUpdate === true && targetUserId === req.user.userId) {
      throw new PermissionError('You do not have permission to change your own admin status.');
    }

    const updatedFields = {
      isAdmin: true, 
    };

    const updatedUser = await updateUser({ userId: targetUserId, updatedFields });

    delete updatedUser.password;

    res.json({ updatedUser });
  } catch (error) {
    next(new UserError('There was an error updating user.'));
  }
});

// Delete user account (admin action)
router.delete('/admin/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const deletedUser = await deleteUser(userId);

    if (deletedUser) {
      res.json({ message: 'User account deleted successfully' });
    } else {
      throw new AuthenticationError('User not found.');
    }
  } catch (error) {
    next(new UserError('There was an error deleting the user.'));
  }
});

module.exports = router;