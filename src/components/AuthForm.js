import React, { useState, useEffect } from 'react';
import './AuthForm.css';
import RegisterUserForm from './RegisterUserForm';
import LoginForm from './LoginForm';
import Profile from './Profile';
import { API_KEY } from '../config'; // Assuming API_KEY is required for API calls

function AuthForm() {
    const [isRegistering, setIsRegistering] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // If token exists, fetch user details
            fetchUserDetails(token);
        }
    }, []);

    const fetchUserDetails = async (token) => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/me', {
                method: 'GET',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUsername(userData.response.username);
                setEmail(userData.response.email);
                setIsLoggedIn(true); // Set the logged-in state
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleRegistrationSuccess = () => {
        setIsRegistering(false); // Switch to login form
    };

    const handleLoginSuccess = () => {
        setUsername(localStorage.getItem('username'));
        setEmail(localStorage.getItem('email'));
        setIsLoggedIn(true); // Set logged-in state
    };

    const handleLogout = () => {
        setUsername('');
        setEmail('');
        setIsLoggedIn(false);
        localStorage.removeItem('token'); // Ensure token is removed on logout
        localStorage.removeItem('username'); // Clear the username from local storage
        localStorage.removeItem('email'); // Clear the email from local storage
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="auth-form-container">
            {isLoggedIn ? (
                <Profile onLogout={handleLogout} />
            ) : isRegistering ? (
                <>
                    <RegisterUserForm onRegistrationSuccess={handleRegistrationSuccess} />
                    <p className="toggle-text">
                        Already have an account?
                        <button className="toggle-button" onClick={toggleForm}>
                            Log In
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                    <p className="toggle-text">
                        Don't have an account yet?
                        <button className="toggle-button" onClick={toggleForm}>
                            Register
                        </button>
                    </p>
                </>
            )}
            {username && <p>Welcome, {username}!</p>}
        </div>
    );
}

export default AuthForm;
