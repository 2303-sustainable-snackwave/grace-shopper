import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../style/App.css';
// update imports as more components are finished!
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

    return (
      <CartProvider>
        <Router>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/reviews/:productId" element={<Reviews />} />
              <Route path="/search" element={<Search />} />
              <Route path="/checkout" element={<UserCheckout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          <Footer />
        </Router>
      </CartProvider>
    );
}

export default App;