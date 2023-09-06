const express = require('express');
const router = express.Router();
const { verifyToken, isAuthorizedToUpdate, isAdmin} = require('./authMiddleware');
const { 
  OrderHistoryError,
} = require('../errors');
const {
  getOrderByUserId,
  getOrderHistoryForProduct,
  getOrderDetailsByOrderId,
  getOrdersByDateRange
} = require('../db/models/orders');

// GET /api/orders/user/:userId
router.get('/user/:userId', verifyToken, isAuthorizedToUpdate, async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Retrieve orders for the specified user
    const orders = await getOrderByUserId(userId);

    if (!orders || orders.length === 0) {
      throw new OrderHistoryError('No orders found for this user.');
    }

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/product/:productId
router.get('/product/:productId', verifyToken, async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Retrieve orders that include the specified product
    const orders = await getOrderHistoryForProduct(productId);

    if (!orders || orders.length === 0) {
      throw new OrderHistoryError('No orders found for this product.');
    }

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:orderId
router.get('/:orderId', verifyToken, async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Retrieve order details by orderId
    const orderDetails = await getOrderDetailsByOrderId(orderId);

    if (!orderDetails) {
      throw new OrderHistoryError('Order not found.');
    }

    res.json({ orderDetails });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/by-date
router.get('/by-date', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query; 

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required query parameters.' });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ message: 'Invalid date format. Please provide valid date strings.' });
    }

    const ordersByDate = await getOrdersByDateRange(startDateObj, endDateObj);

    if (!ordersByDate) {
      throw new OrderHistoryError('No orders found within the specified date range.');
    }

    res.json({ ordersByDate });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
