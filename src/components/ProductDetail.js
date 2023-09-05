import React, { useState, useEffect } from "react";
import { fetchProductById } from "../api"; // Need the API call!

const ProductDetail = (props) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const { productId } = props.match.params; // Product detail is coming from the URL / make sure route is correct!

  useEffect(() => {
    async function loadProduct() {
      try {
        const fetchedProduct = await fetchProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError("Error loading product details");
      }
    }

    loadProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Price: ${product.price}</li>
            <li className="list-group-item">
              Available: {product.isAvailable ? "Yes" : "No"}
            </li>
            <li className="list-group-item">Category: {product.category}</li>
            <li className="list-group-item">Brand: {product.brand}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;