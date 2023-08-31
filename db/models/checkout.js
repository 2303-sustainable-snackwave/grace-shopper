const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const client = require('../client');

async function createCheckoutSession({ lineItems, successUrl, cancelUrl }) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  
    return session;
  } catch (error) {
    throw new Error('Could not create checkout session: ' + error.message);
  }
}
  
async function createOrderInDatabase({ sessionID, userID, orderDate, totalAmount,  billingAddressID, shippingAddressID, orderProducts }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO order_history (session_id, user_id, order_date, total_amount, billing_address_id, shipping_address_id, order_products)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [sessionID, userID, orderDate, totalAmount, billingAddressID, shippingAddressID, orderProducts]
    );

    return rows[0];
  } catch (error) {
    throw new Error('Could not create order in the database: ' + error.message);
  }
}
  
module.exports = {
  createCheckoutSession,
  createOrderInDatabase,
};
