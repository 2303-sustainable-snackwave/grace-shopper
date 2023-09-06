import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../api';

const Login = ({setToken}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password, setToken, setMessage, setEmail);
      setEmail("");
      setPassword("");
      navigate("/products");
    } catch (error) {
      setError(error.message || 'Login failed.');    }
  };


  return (
    <div className="login-container">
      <h2>Login</h2>
      <p className = "form-text">
        New User? Register <Link to="/register">here</Link>
      </p>
     
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            id="email"
            name="email"
            value={email}
            placeholder="Enter your username"
            minLength="8"
            maxLength="20"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            minLength="8"
            maxLength="20"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default Login;