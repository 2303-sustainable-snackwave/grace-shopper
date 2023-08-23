const client = require("../client");

async function createReview({ id, productId, userId, rating, reviewText, reviewDate }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO reviews (id, ProductId, userId, rating, reviewText, reviewDate)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,
            [id, productId, userId, rating, reviewText, reviewDate]
        );

        return rows[0];
    } catch (error) {
        throw new Error('Could not create review: ' + error.message);
    }
}

async function getAllReviews() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM reviews
        `);

        return rows;
    } catch (error) {
        throw new Error('Error fetching reviews: ' + error.message);
    }
}

async function getReviewsByProduct(productId) {
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM reviews 
        WHERE productID = $1
        `,
            [productId]
        );

        return rows;
    } catch (error) {
        throw new Error('Error fetching reviews for product: ' + error.message);
    }
}

module.exports = {
    createReview,
    getAllReviews,
    getReviewsByProduct,
};


