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
      await registerUser(name, email, password, setToken, setMessage, setSuccess, setName, setEmail);
      setName('');
      setEmail('');
      setPassword('');
      setPassConfirm('');
      setSuccess(true);
      setMessage('Registration successful!');
    } catch (error) {
      setError(error.message || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        {success ? (
            <div className="success-message">
                Registration successful! <Link to="/login">Login here</Link>.
            </div>
        ) : (
        <form onSubmit={handleSubmit}>
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
        </form>
      )}
    </div>
  );
};

export default Register;