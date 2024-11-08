// src/components/LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css'; // Import the CSS file for styling
import { API_KEY } from '../config';

function LoginForm({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrorMessage('Please fill in both email and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/v1/token', {
                method: 'POST',
                headers: {
                    'X-Apikey': API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.response.token;

                // Store the token in local storage
                localStorage.setItem('token', token);

                const userResponse = await fetch(`http://localhost:8000/api/v1/users/me`, {
                    method: 'GET',
                    headers: {
                        'X-Apikey': API_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    localStorage.setItem('username', userData.response.username);
                    localStorage.setItem('email', userData.response.email);
                    localStorage.setItem('user_id', userData.response.id);
                    alert(`Login successful! Welcome back, ${localStorage.getItem('username')}`);
                    onLoginSuccess();
                }
            } else {
                setErrorMessage('Invalid email or password. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="form-group">
                    <button type="submit" className="login-btn">Login</button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
