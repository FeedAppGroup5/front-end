import React, { useState } from 'react';
import './CreatePollComponent.css';

function CreatePollComponent() {
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState([{ caption: '' }]);

    // Function to add a new option
    const addOption = () => {
        setPollOptions([...pollOptions, { caption: '' }]);
    };

    // Function to remove an option
    const removeOption = (index) => {
        setPollOptions(pollOptions.filter((_, i) => i !== index));
    };

    // Function to handle poll submission
    const submitPoll = async () => {
        const pollData = {
            question: pollQuestion,
            voteOptions: pollOptions.map((option, index) => ({
                caption: option.caption,
                presentationOrder: index + 1,
                upvote: 0
            }))
        };

        try {
            const response = await fetch('http://localhost:8080/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pollData)
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Poll created successfully with ID: ${data.pollId}. Now refresh the page to vote.`);
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
                    />
                </div>

                <div className="options-section">
                    <h3>Options</h3>
                    {pollOptions.map((option, index) => (
                        <div key={index} className="option-item">
                            <input
                                type="text"
                                value={option.caption}
                                onChange={(e) => {
                                    const newOptions = [...pollOptions];
                                    newOptions[index].caption = e.target.value;
                                    setPollOptions(newOptions);
                                }}
                                placeholder={`Option ${index + 1}`}
                                className="option-input"
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
