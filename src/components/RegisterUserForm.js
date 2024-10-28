import React, { useState } from 'react'; // Importing React and the useState hook from React. to manage state in a functional component.
import './RegisterUserForm.css';
import { API_KEY } from '../config'

function RegisterUserForm({ onRegistrationSuccess }) {

    // Define a state variable 'formData' to hold the values of the form fields (username, email, password).
    // 'setFormData' to update this state.
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // state variable 'errorMessage' to hold error messages, if any, during the registration process.
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle changes in the input fields of the form.
    // 'e' is the event object that is triggered when the input value changes.
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Extract the name of the input field and its current value.

        // Update the 'formData' state. The spread operator (...) is used to copy existing formData.
        setFormData({
            ...formData,    // Copy the current formData state.
            [name]: value   // Update the field (username, email, or password) with the new value.
        });
    };

    // Function to handle form submission.
    // 'e' is the event object that is triggered when the form is submitted.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior, which would cause a page reload.

        // Validate that all form fields are filled out.
        if (!formData.username || !formData.email || !formData.password) {
            setErrorMessage('Please fill in all fields.');
            return; // Exit the function without proceeding further.
        }

        // Try to handle the registration process (sending data to the server).
        try {
            // Send a POST request to the registration API endpoint.
            const response = await fetch('http://localhost:8000/api/v1/users', {
                method: 'POST', // HTTP method is POST to submit new data.
                headers: {
                    'X-Apikey': API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData) // Convert the formData object to a JSON string and include it in the request body.
            });

            // Check if the request was successful (status code 200-299).
            if (response.ok) {
                const data = await response.json(); // Parse the response body as JSON.
                alert(`Registration successful! Welcome, ${data.response.username}`); // Display an alert to the user with their username.
                onRegistrationSuccess(); // Call the success callback
                setFormData({ username: '', email: '', password: '' }); // Clear form
            } else {
                // If the response is not OK (e.g., error status), show an error message.
                setErrorMessage('Failed to register. Try again.');
            }
        } catch (error) {
            // If there's an error during the fetch (e.g., network error), catch it and display an error message.
            setErrorMessage('Error occurred while registering.');
        }
    };


    return (
        <div className="register-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
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
                        placeholder="Enter password"
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="form-group">
                    <button type="submit" className="register-btn">Register</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterUserForm;
