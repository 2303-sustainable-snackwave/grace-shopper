const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
require('dotenv').config();

router.use(bodyParser.json());

const {
    createOrder,
    updateOrder,
    deleteOrder
} = require('../db/models/orders');

const {
    getAllOrders
} = require('../db/models/orders');

// GET /api/orders
router.get('/', async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { customerId, orderDate, totalAmount } = req.body;
        const newOrder = await createOrder(customerId, orderDate, totalAmount);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order.' });
    }
});

// PATCH /api/orders/:orderId
router.patch('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { totalAmount } = req.body;
        const updateOrder = await updateOrder(orderId, totalAmount);
        res.json(updateOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order.' });
    }
});

// DELETE /api/orders/:orderId
router.delete('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        await deleteOrder(orderId);
        res.json({ message: 'Order deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order.' });
    }
});

module.exports = router;