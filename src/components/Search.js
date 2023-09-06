import React, { useState } from "react";
import { searchProducts } from "../api";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const products = await searchProducts(searchQuery);
      setResults(products);
      setError(null);
    } catch (err) {
      setError("Error fetching search results");
      setResults([]);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <div className="dropdown-results">
          <ul className="search-results">
            {results.map((product) => (
              <li key={product.id}>
                <Link to={`/products/${product.id}`} onClick={clearSearch}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>
                    Price: {product.min_price} - {product.max_price}{" "}
                    {product.currency_code}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;