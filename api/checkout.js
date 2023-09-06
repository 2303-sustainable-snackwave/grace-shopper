const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const { createCheckoutSession, createOrderInDatabase, getCartTotalAmount } = require("../db/models");
const { verifyToken } = require('./authMiddleware');

// Checkout payment-intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    const { userId, guestId } = req.user; 

    const totalAmount = await getCartTotalAmount({ userId, guestId });

    if (!Number.isInteger(totalAmount) || totalAmount < 1) {
      throw new Error('Invalid totalAmount');
    }

    // Create a PaymentIntent with the total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount, 
      currency: 'usd', 
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Could not create PaymentIntent' });
  }
});

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