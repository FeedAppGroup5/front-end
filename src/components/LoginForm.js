import React, { useState } from 'react';
import './LoginForm.css'; // Import the CSS file for styling

function LoginForm() {
    // State to store the form data (email and password)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State to store error messages if the login fails
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle input changes in the form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Get the name and value of the input
        setFormData({
            ...formData, // Spread the existing formData
            [name]: value // Update the field with the new value
        });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission (which reloads the page and sends data to back-end)

        // Validate that both email and password fields are filled
        if (!formData.email || !formData.password) {
            setErrorMessage('Please fill in both email and password.');
            return;
        }

        // Try to handle the login process (sending data to the server)
        try {
            // Send a POST request to the login API endpoint
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData) // Send the form data as JSON
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                alert(`Login successful! Welcome back, ${data.username}`);
            } else {
                // If the login fails, set an error message
                setErrorMessage('Invalid email or password. Please try again.');
            }
        } catch (error) {
            // Catch and handle any errors during the login process
            setErrorMessage('Error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Email Input */}
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

                {/* Password Input */}
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

                {/* Display an error message if there's a login error */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {/* Submit Button */}
                <div className="form-group">
                    <button type="submit" className="login-btn">Login</button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
