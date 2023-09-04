import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from '../api'; // Make sure correct route in cleanup

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Move API call in cleanup also make sure we're pulling the IMG!
    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await fetchAllProducts();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
            }
        }
        loadProducts();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Products</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                        <div className="card h-100">
                            <Link to={`/productdetails/${product.id}`}>
                                <img className="card-img-top" src={product.image} alt={product.name} />
                            </Link>
                            <div className="card-body">
                                <h4 className="card-title">
                                    <Link to={`/productdetails/${product.id}`}>{product.name}</Link>
                                </h4>
                                {/* We can adjust the list order in final build */}
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">Price: ${product.price}</p>
                                <p className="card-text">Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
                                <p className="card-text">Category: {product.category}</p>
                                <p className="card-text">Brand: {product.brand}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductListing;