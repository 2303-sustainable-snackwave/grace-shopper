const stripe = require('stripe')('SECRET_KEY'); // Replace secret_key
const client = require('./client');

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
  
  async function createOrderInDatabase({ sessionID, totalAmount, products }) {
    try {
      const { rows } = await client.query(
        `
        INSERT INTO orders (session_id, total_amount)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [sessionID, totalAmount]
      );
  
      const order = rows[0];
  
      
      for (const product of products) {
        await client.query(
          `
          INSERT INTO order_products (order_id, product_id)
          VALUES ($1, $2);
          `,
          [order.id, product.id]
        );
      }
  
      return order;
    } catch (error) {
      throw new Error('Could not create order in the database: ' + error.message);
    }
  }
  
  module.exports = {
    createCheckoutSession,
    createOrderInDatabase,
  };