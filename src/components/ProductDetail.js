import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { fetchProductById, createCart, fetchUserCart, addProductToCart } from "../api";

const ProductDetail = ({token}) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1


  const { productId } = useParams(); // Product detail is coming from the URL / make sure route is correct!
  console.log(productId);
  useEffect(() => {
    async function loadProduct() {
      try {
        const fetchedProduct = await fetchProductById(productId);
        console.log(fetchedProduct);
        setProduct(fetchedProduct);
      } catch (err) {
        setError("Error loading product details");
      }
    }

    loadProduct();
  }, [productId]);


  // Event handler to update quantity
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10); // Parse input value as an integer
    setQuantity(newQuantity);
  };

  const handleAddToCart = async (userId, guestId, productId, token) => {
    try {
      if (userId) {
        // If a user is logged in, fetch the user's cart
        const userCart = await fetchUserCart(userId, token);
  
        if (!userCart || !userCart.cart) {
          // Create a new cart for the user
          const cartId = await createCart( userId, null ); // Assuming guestId is null for a user
          // Add the product to the user's new cart
          await addProductToCart(userId, productId, token, cartId);
        } else {
          // Add the product to the user's existing cart
          await addProductToCart(userId, productId, token, userCart.cart.id);
        }
      } else if (guestId) {
        // If it's a guest, check for a guest cart
        const guestCart = await fetchUserCart(guestId, null);
  
        if (!guestCart || !guestCart.cart) {
          // Create a new cart for the guest
          const cartId = await createCart( null, guestId );
          // Add the product to the guest's new cart
          await addProductToCart(null, productId, null, cartId);
        } else {
          // Add the product to the guest's existing cart
          await addProductToCart(null, productId, null, guestCart.cart.id);
        }
      }
  
      // Optionally, you can show a success message or update the cart icon
      alert("Product added to cart successfully!");
    } catch (err) {
      setError("Error adding product to cart");
    }
  };
      
  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img-top"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/path/to/default/image.jpg';
          }}
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
          <div className="mt-3">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
            />
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;