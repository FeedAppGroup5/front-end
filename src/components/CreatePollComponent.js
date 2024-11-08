import React, { useState } from 'react';
import './CreatePollComponent.css';
import { API_KEY } from "../config";

function CreatePollComponent() {
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState([{ content: '' }]);
    const [validTo, setValidTo] = useState(''); // State for valid_to date

    const addOption = () => {
        setPollOptions([...pollOptions, { content: '' }]);
    };

    const removeOption = (index) => {
        setPollOptions(pollOptions.filter((_, i) => i !== index));
    };

    const submitPoll = async () => {
        const userId = localStorage.getItem('user_id'); // Retrieve user ID from local storage
        const token = localStorage.getItem('token'); // Retrieve the token

        if (!token) {
            alert('User is not authenticated. Please log in.');
            return; // Exit if no token
        }

        const pollData = {
            question: pollQuestion,
            valid_to: validTo, // Use the date selected by the user
            user_id: userId,
            vote_options: pollOptions.map((option, index) => ({
                content: option.content,
                position: index + 1,
            }))
        };

        try {
            const response = await fetch('http://localhost:8000/api/v1/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Include token for authorization
                },
                body: JSON.stringify(pollData)
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Poll created successfully with ID: ${data.response.id}`);
                setPollQuestion(''); // Reset form fields
                setPollOptions([{ content: '' }]); // Reset options
                setValidTo(''); // Reset date
            } else {
                console.error('Error creating poll:', response.statusText);
                alert('Failed to create poll');
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            alert('Error creating poll');
        }
    };

    return (
        <div className="poll-container">
            <h1 className="app-title">Create a New Poll</h1>
            <form className="poll-form" onSubmit={(e) => { e.preventDefault(); submitPoll(); }}>
                <div className="form-group">
                    <label htmlFor="pollQuestion">Poll Question:</label>
                    <input
                        type="text"
                        id="pollQuestion"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Enter poll question.."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="validTo">Expiration Date:</label>
                    <input
                        type="date"
                        id="validTo"
                        value={validTo}
                        onChange={(e) => setValidTo(e.target.value)}
                        required
                    />
                </div>

                <div className="options-section">
                    <h3>Options</h3>
                    {pollOptions.map((option, index) => (
                        <div key={index} className="option-item">
                            <input
                                type="text"
                                value={option.content}
                                onChange={(e) => {
                                    const newOptions = [...pollOptions];
                                    newOptions[index].content = e.target.value;
                                    setPollOptions(newOptions);
                                }}
                                placeholder={`Option ${index + 1}`}
                                className="option-input"
                                required
                            />
                            {pollOptions.length > 1 && (
                                <button type="button" className="remove-btn" onClick={() => removeOption(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="actions">
                    <button type="button" className="add-btn" onClick={addOption}>
                        Add Option
                    </button>
                    <button type="submit" className="create-btn">
                        Create Poll
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePollComponent;
