import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../style/App.css';

import {
  Register,
  Login,
  Profile,
  UserCheckout,
  Navbar,
  Cart,
  Search,
  Reviews,
  Footer,
  Home,
  ProductDetail,
  ProductListing
} from  '../components';
import { CartProvider } from '../CartContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const setAndStoreToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

    return (
      <CartProvider>
        <Router>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart token={token}/>} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/reviews/:productId" element={<Reviews />} />
              <Route path="/search" element={<Search />} />
              <Route path="/checkout" element={<UserCheckout token={token}/>} />
              <Route path="/profile" element={<Profile token={token}/>} />
              <Route path="/register" element={<Register setToken={setAndStoreToken}/>} />
              <Route path="/login" element={<Login setToken={setAndStoreToken}/>} />
            </Routes>
          <Footer />
        </Router>
      </CartProvider>
    );
}

export default App;