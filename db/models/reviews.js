const client = require("../client");

async function createReview({ productId, userId, rating, reviewText, reviewDate }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO product_reviews (product_id, user_id, rating, review_text, review_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
            [productId, userId, rating, reviewText, reviewDate]
        );

        return rows[0];
    } catch (error) {
        throw new Error('Could not create review: ' + error.message);
    }
}

async function getAllReviews() {
    try {
        const { rows } = await client.query(`
        SELECT pr.id, pr.rating, pr.review_text, pr.review_date, 
        u.name as reviewer_name, u.email as reviewer_email, 
        p.name as product_name 
        FROM product_reviews pr 
        INNER JOIN users u ON pr.user_id = u.id 
        INNER JOIN products p ON pr.product_id = p.id
        `);

        return rows;
    } catch (error) {
        console.error('Error fetching reviews:' + error.message);
        throw new Error('An error occurred while fetching reviews.');
    }
}

async function getReviewsByProduct(productId) {
    try {
        const { rows } = await client.query(`
        SELECT pr.id, pr.rating, pr.review_text, pr.review_date, 
        u.name as reviewer_name, u.email as reviewer_email 
        FROM product_reviews pr 
        INNER JOIN users u ON pr.user_id = u.id 
        WHERE pr.product_id = $1
        `,
            [productId]
        );

        return rows;
    } catch (error) {
        console.error('Error fetching reviews for product:' + error.message);
        throw new Error('An error occurred while fethcing reviews for the product.');
    }
}

async function updateReview({ reviewId, rating, reviewText }) {
    try {
        const { rows } = await client.query(`
        UPDATE product_reviews
        SET rating = $1, review_text = $2
        WHERE id = $3
        RETURNING *;
        `,
            [rating, reviewText, reviewId]
        );

        if (rows.length === 0) {
            throw new Error(`Review with id ${reviewId} not found.`);
        }

        return rows[0];
    } catch (error) {
        throw new Error('Could not update review: ' + error.message);
    }
}

async function deleteReview(reviewId) {
    try {
        const { rows } = await client.query(`
        DELETE FROM product_reviews
        WHERE id = $1
        RETURNING *;
        `,
            [reviewId]
        );

        if (rows.length === 0) {
            throw new Error(`Review with id ${reviewId} not found.`);
        }

        return rows[0];
    } catch (error) {
        throw new Error('Could not delete review: ' + error.message);
    }
}

module.exports = {
    createReview,
    getAllReviews,
    getReviewsByProduct,
    updateReview,
    deleteReview,
};