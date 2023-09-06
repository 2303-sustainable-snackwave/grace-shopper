import React from "react";
import { Link } from "react-router-dom";
import Search from './Search';

const Navbar = ({ token, logout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar-background">
      <span className="navbar-text custom-navbar-text">Cycle's-R-Us</span>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          {!token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
          {token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
              <button className="nav-link" onClick={logout}>Logout</button>
            </li>
            </>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/users/johndoe/checkout">
              Checkout
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              Cart
            </Link>
          </li>
        </ul>
        <div className="d-flex">
            <div className="navbar-search">
                <Search />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;