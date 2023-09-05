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
  Footer
} from  '../components';
import { CartProvider } from '../CartContext';

function App() {

    return (
      <CartProvider>
        <Router>
          <Navbar />
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/users/:username/checkout' element={<UserCheckout />} />
                <Route path='/reviews' element={<Reviews />} />
            </Routes>
          <Footer />
        </Router>
      </CartProvider>
    );
}

export default App;