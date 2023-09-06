import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from '../api';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

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

    // Extract unique category names from products
    const categoryOptions = Array.from(new Set(products.map(product => product.category)));

    // Filter products based on the selected category
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Products</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
                {/* Category filter dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categoryOptions.map((categoryName, index) => (
                        <option key={index} value={categoryName}>
                            {categoryName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="row">
                {filteredProducts.map(product => (
                    <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                        <div className="card h-100">
                            <Link to={`/products/${product.id}`}>
                                <img className="card-img-top" src={product.imageurl} alt={product.name} />
                            </Link>
                            <div className="card-body">
                                <h4 className="card-title">
                                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                                </h4>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">Price: ${product.amount}</p>
                                <p className="card-text">Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
                                {product.category && <p className="card-text">Category: {product.category}</p>}
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