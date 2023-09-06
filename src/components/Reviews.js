import React, { useState, useEffect } from "react";
import { fetchReviewsByProductId, postReview } from "../api";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move the api call to api/index.js
  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await fetchReviewsByProductId(productId);
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId]);

  const handlePostReview = async () => {
    try {
      const newReview = await postReview({
        productId,
        userId: 1, // Replace this with the actual user ID after implementing UserAuth!
        rating,
        reviewText,
        reviewDate: new Date().toISOString(),
      });
      setReviews((prevReviews) => [...prevReviews, newReview]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5 reviews-section">
      <h3 className="mb-4">Reviews for Product {productId}</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="post-review mb-5">
        <h4 className="mb-3">Post a Review:</h4>

        <div className="mb-3">
          <label className="form-label">Rating:</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Review:</label>
          <textarea
            className="form-control"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Your review here..."
            rows="3"
          />
        </div>

        <button className="btn btn-primary" onClick={handlePostReview}>
          Post Review
        </button>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review card mb-3 p-3">
            <p className="mb-2">
              <strong>Rating:</strong> {review.rating} stars
            </p>
            <p className="mb-2">{review.reviewText}</p>
            <small className="text-muted">
              Posted on: {new Date(review.reviewDate).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;