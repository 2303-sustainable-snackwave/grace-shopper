import React, { useState } from 'react';
import { registerUser } from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await registerUser(username, password);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message || 'Unexpected error');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            {success ? (
                <div className="success-message">
                    Registration successful! <a href="/login">Login here</a>.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                    { /* Endpoint is for username, but we should be using email for login. We'll have to further tweak this! */ }
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit">Register</button>
                </form>
            )}
        </div>
    );
};

export default Register;