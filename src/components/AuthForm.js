import React, { useState } from 'react';
import './AuthForm.css';
import RegisterUserForm from './RegisterUserForm';
import LoginForm from './LoginForm';

function AuthForm() {
    // State to track whether we are showing the registration or login form. As default is the registering (true)
    const [isRegistering, setIsRegistering] = useState(true);

    // Toggle between registration and login forms
    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="auth-form-container">
            {isRegistering ? (
                <>
                    <RegisterUserForm />
                    <p className="toggle-text">
                        Already have an account?
                        <button className="toggle-button" onClick={toggleForm}>
                            Log In
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <LoginForm />
                    <p className="toggle-text">
                        Don't have an account yet?
                        <button className="toggle-button" onClick={toggleForm}>
                            Register
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}

export default AuthForm;
