import React from 'react';
import './Profile.css';
import { API_KEY } from '../config';

function Profile({ onLogout}) {
    // Function to handle the logout process
    const handleLogout = async () => {
        try {
            // Retrieve the token from local storage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No user token found');
                return;
            }

            // Send a DELETE request to the API endpoint to log the user out
            const response = await fetch('http://localhost:8000/api/v1/token', {
                method: 'DELETE',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                }
            });

            if (response.ok) {
                // Remove the token from local storage on successful logout
                localStorage.removeItem('token');
                localStorage.removeItem('username'); // Clear the username from local storage
                localStorage.removeItem('email'); // Clear the email from local storage
                alert('You have been logged out successfully');
                onLogout(); // Call the onLogout function to update the parent component's state
            } else {
                console.error('Failed to log out:', response.statusText);
                alert('Failed to log out ${token}');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error occurred while logging out. Please try again.');
        }
    };
    return (
        <div className="profile-container">
            <h2>Welcome to Your Profile</h2>
            <div className="profile-details">
                <p><strong>Username:</strong> {localStorage.getItem('username')} </p>
                <p><strong>Email:</strong> {localStorage.getItem('email')}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default Profile;
