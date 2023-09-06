const client = require("../client");
const ORDER_STATUSES = require('./orderStatus.js');

async function getAllOrders() {
  try {

    const query = `
      SELECT *
      FROM order_history;
    `;

    const result = await client.query(query);

    return result.rows;
  } catch (error) {
    throw new Error('Could not retrieve all orders: ' + error.message);
  }
}

async function getOrderByUserId(userId) {
  try {
    const { rows } = await client.query(`
      SELECT oh.id, oh.user_id, oh.order_date, oh.total_amount, 
      oh.shipping_address_id, oh.billing_address_id, oh.order_products, oh.status
      FROM order_history oh
      INNER JOIN users u ON oh.user_id = u.id 
      WHERE oh.user_id = $1
      `,
      [userId]
    );
        
    return rows;
  } catch (error) {
    throw new Error('Could not retrieve order history for user: ' + error.message);
  }
}

async function getOrderHistoryForProduct(productId) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM order_history
      WHERE $1 = ANY(order_products)
      `,
      [productId]
    );

    return rows;
  } catch (error) {
    throw new Error('Could not retrieve order history for product: ' + error.message);
  }
}

async function getOrderDetailsByOrderId(orderId) {
  try {
    const { rows } = await client.query(
      `
      SELECT oh.id AS order_id, oh.user_id, u.name, oh.order_date, 
          oh.total_amount, sa.address AS shipping_address, ba.address AS billing_address,
          oh.order_products, oh.status
      FROM order_history oh
      INNER JOIN users u ON oh.user_id = u.id 
      INNER JOIN shipping_addresses sa ON oh.shipping_address_id = sa.id
      INNER JOIN billing_addresses ba ON oh.billing_address_id = ba.id
      WHERE oh.id = $1
      `,
      [orderId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error('Could not retrieve order details: ' + error.message);
  }
}

async function getOrdersByDateRange({startDate, endDate}) {
  try {
    const { rows } = await client.query(
      `
      SELECT
        id,
        user_id,
        order_date,
        total_amount,
        shipping_address_id,
        billing_address_id,
        order_products,
        status
      FROM
        order_history
      WHERE
        order_date >= $1
        AND order_date <= $2;
      `,
      [startDate, endDate]
    );
;
    return rows;
  } catch (error) {
    throw new Error('Could not retrieve orders by date range: ' + error.message);
  }
}

async function getOrdersByStatus(status) {
  try {
    const query = `
      SELECT *
      FROM order_history
      WHERE status = $1;
    `;

    const values = [status];

    const { rows } = await client.query(query, values);

    return rows;
  } catch (error) {
    throw new Error('Error fetching orders by status: ' + error.message);
  }
}

async function updateOrdersByStatus(orderIds, newStatus) {
  try {
    if (!Object.values(ORDER_STATUSES).includes(newStatus)) {
      throw new Error('Invalid order status.');
    }

    const query = `
      UPDATE order_history
      SET status = $1
      WHERE id = ANY($2)
      RETURNING *;
    `;

    const values = [newStatus, orderIds];
    const { rows } = await client.query(query, values);

    return rows;
  } catch (error) {
    throw new Error('Could not update orders by status: ' + error.message);
  }
}

module.exports = {
  getAllOrders,
  getOrderByUserId,
  getOrderHistoryForProduct,
  getOrderDetailsByOrderId,
  getOrdersByDateRange,
  getOrdersByStatus,
  updateOrdersByStatus
}