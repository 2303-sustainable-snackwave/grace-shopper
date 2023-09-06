import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { registerUser } from '../api';

const Register = ({setToken}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(name, email, password, setToken, setMessage, setSuccess, setName, setEmail, setError);
      setName('');
      setEmail('');
      setPassword('');
      setPassConfirm('');
    } catch (error) {
      setError(error.message || 'Registration failed.');
    }
  };

  return (
    <div className="login-form">
      <h2>Create an Account</h2>
      <p className = "form-text">
        Already a user? Click <Link to="/login">here</Link>
      </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="name">First and Last Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="passConfirm">Confirm Password:</label>
            <input
              id="passConfirm"
              type="password"
              value={passConfirm}
              onChange={(e) => setPassConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
          {password !== passConfirm ? <p>Passwords do not match</p> : null}
        </form>
        {message ? <p>{message}</p> : null}
    </div>
  );
};

export default Register;