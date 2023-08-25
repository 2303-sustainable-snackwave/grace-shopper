const client = require("../client");

async function getOrderByUserId(userId) {
    try {
        const { rows } = await client.query(`
        SELECT oh.id, oh.user_id, oh.order_date, oh.total_amount, 
        oh.shipping_address_id, oh.billing_address_id, oh.order_products
        FROM order_history oh
        INNER JOIN users u ON oh.user_id = u.id 
        WHERE oh.user_id = $1
        `,
            [userId]
        );
        

        return rows;
    } catch (error) {
        console.error('Error fetching reviews for product:' + error.message);
        throw new Error('An error occurred while fethcing reviews for the product.');
    }
}


module.exports = {
    getOrderByUserId
}