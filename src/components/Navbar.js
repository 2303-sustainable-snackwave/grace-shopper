import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { fetchCurrentUser } from '../api';

const Navbar = ({ token, logout }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch the current user's information and set the isAdmin state
    if (token) {
      fetchCurrentUser(token)
        .then((currentUser) => {
          setIsAdmin(currentUser.is_admin);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    }
  }, [token]);

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
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
          {token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  onClick={logout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </a>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admindash">
                    Admin Dash
                  </Link>
                </li>
              )}
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