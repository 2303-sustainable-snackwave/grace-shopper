const client = require("./client");

async function createOrder({ product, orderDate, totalAmount }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO Orders (Product, OrderDate, TotalAmount)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
            [product, orderDate, totalAmount]
        );

        return rows[0];
    } catch (error) {
        throw new Error('Could not create order: ' + error.message);
    }
}

async function getOrderById({ product, order, orderDate, totalAmount }) {
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM Orders
        WHERE Id = $1
        `,
            [product, order, orderDate, totalAmount]
        );

        return rows[0]
    } catch (error) {
        throw new Error('Could not locate order with Id: ' + error.message);
    }
}

async function createTotalAmount({ product, order }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO total_amount
        VALUES ($1, $2)
        RETURNING *;
    `,
            [product, order]
        );

        return rows[0]
    } catch (error) {
        throw new Error('Could not create total amount: ' + error.message);
    }
}

module.exports = {
    createOrder,
    getOrderById,
    createTotalAmount
}