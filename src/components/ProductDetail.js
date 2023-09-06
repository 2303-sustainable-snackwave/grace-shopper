import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, createCart, fetchUserCart, addProductToCart } from "../api";

const ProductDetail = ({ token }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { productId } = useParams();

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

  const handleBackClick = () => {
    navigate('/products');
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async (userId, guestId, productId, token) => {
    try {
      if (userId) {
        const userCart = await fetchUserCart(userId, token);
  
        if (!userCart || !userCart.cart) {
          const cartId = await createCart(userId, null);
          await addProductToCart(userId, productId, token, cartId);
        } else {
          await addProductToCart(userId, productId, token, userCart.cart.id);
        }
      } else if (guestId) {
        const guestCart = await fetchUserCart(guestId, null);
  
        if (!guestCart || !guestCart.cart) {
          const cartId = await createCart(null, guestId);
          await addProductToCart(null, productId, null, cartId);
        } else {
          await addProductToCart(null, productId, null, guestCart.cart.id);
        }
      }
  
      alert("Product added to cart successfully!");
    } catch (err) {
      setError("Error adding product to cart");
    }
  };
      
  if (!product) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;

  return (
    <div style={{ marginBottom: '10px' }} className="container mt-5">
      <div className="card">
        <img
          src={product.imageurl}
          alt={product.name}
          className="card-img-top"
          onClick={() => setShowModal(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/path/to/default/image.jpg';
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Price: ${product.amount}</li>
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
      <button className="btn btn-primary mt-5" onClick={handleBackClick}>
        Back to Product Listing
      </button>
      <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <img src={product.imageurl} alt={product.name} className="img-fluid" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default ProductDetail;