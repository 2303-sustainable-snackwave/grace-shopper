import React, { useState } from 'react';
import { searchProducts } from '../api';
import { Link } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSearch = async () => {
        setLoading(true);
        try {
            const products = await searchProducts(query);
            setResults(products);
            setError(null);
        } catch (err) {
            setError('Error fetching search results');
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <div className="search-container">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul className="search-results">
                {results.map(product => (
                    <li key={product.id}>
                        <Link to={`/products/${product.id}`}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: {product.min_price} - {product.max_price} {product.currency_code}</p>
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Search;