const express = require('express');
const router = express.Router();
const { createCheckoutSession, createOrderInDatabase } = require("../db/models/checkout");

// Checkout session
router.post('/create-session', async (req, res, next) => {
    try {
        const { lineItems, successUrl, cancelUrl } = req.body;

        const session = await createCheckoutSession({ lineItems, successUrl, cancelUrl });

        res.json({ sessionId: session.id });
    } catch (error) {
        next(error);
    }
});

// Payment success

router.post('/success', async (req, res, next) => {
    try {
        const { session_id, total_amount, products } = req.body;
        const order = await createOrderInDatabase({ sessionId: session_id, totalAmount: total_amount, products });

        res.json({ order });
    } catch (error) {
        next(error);
    }
});

module.exports = router;