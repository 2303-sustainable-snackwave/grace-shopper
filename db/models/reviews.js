const client = require("../client");

async function createReview({ productId, reviewName, reviewerEmail, reviewDate }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO Reviews (ProductId, ReviewName, reviewerEmail, reviewDate)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
            [productId, reviewName, reviewerEmail, reviewDate]
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
        FROM Reviews
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
        FROM Reviews 
        WHERE ProductID = $1
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


