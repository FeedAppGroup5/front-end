import React, { useState, useEffect } from 'react';
import './VoteComponent.css';
import { API_KEY } from "../config";

function VoteComponent() {
    const [polls, setPolls] = useState([]);
    const [selectedPollId, setSelectedPollId] = useState(''); // Start with an empty string
    const [selectedPoll, setSelectedPoll] = useState(null);

    useEffect(() => {
        fetchAllPolls();
    }, []);

    const fetchAllPolls = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token

        if (!token) {
            alert('User is not authenticated. Please log in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/v1/polls', {
                method: 'GET',
                headers: {
                    'X-Apikey': API_KEY,
                }
            });
            if (response.ok) {
                const pollsData = await response.json();
                setPolls(pollsData.items); // Adjust based on the API structure
                setSelectedPollId(''); // Reset selected poll ID when fetching polls
            } else {
                console.error('Failed to fetch polls:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const fetchSelectedPoll = async (pollId) => {
        const token = localStorage.getItem('token'); // Retrieve the token

        try {
            const response = await fetch(`http://localhost:8000/api/v1/polls/${pollId}`, {
                method: 'GET',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Only logged in users can vote
                }
            });
            if (response.ok) {
                const pollData = await response.json();
                setSelectedPoll(pollData.response);
            } else {
                console.error('Failed to fetch poll:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching poll:', error);
        }
    };

    const upvote = async (optionId) => {
        const token = localStorage.getItem('token'); // Retrieve the token
        const voteData = {
            vote_option_id: optionId // Sending the ID of the option to vote
        };

        try {
            const response = await fetch(`http://localhost:8000/api/v1/polls/${selectedPollId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Only logged in users can vote
                },
                body: JSON.stringify(voteData)
            });

            if (response.ok) {
                const voteResponse = await response.json();
                alert(`Vote cast successfully for ${voteResponse.response.vote_option.content}!`);
                // Optionally, refresh the poll details to show updated vote counts
                fetchSelectedPoll(selectedPollId);
            } else {
                // Check for the "User already voted in this poll" error
                const errorResponse = await response.json();
                if (errorResponse.validation_errors) {
                    const voteError = errorResponse.validation_errors.find(error => error.message === "User already voted in this poll.");
                    if (voteError) {
                        alert("User already voted in this poll.");
                    }
                }
                console.error('Failed to cast vote:', response.statusText);
            }
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    };

    return (
        <div className="vote-container">
            <h2>Select a Poll</h2>
            <div>
                <label htmlFor="pollSelect">Choose a poll:</label>
                <select
                    id="pollSelect"
                    value={selectedPollId}
                    onChange={(e) => {
                        setSelectedPollId(e.target.value);
                        fetchSelectedPoll(e.target.value);
                    }}
                >
                    <option value="" disabled>Select a poll</option> {/* Default option */}
                    {polls.map(poll => (
                        <option key={poll.id} value={poll.id}>{poll.question}</option> // Poll question as option
                    ))}
                </select>
            </div>

            {selectedPoll && (
                <>
                    <h3>Poll: {selectedPoll.question}</h3>
                    <div className="options-container">
                        {selectedPoll.vote_options.map((option) => (
                            <div key={option.id} className="option-item">
                                <span className="option">{option.content}</span>
                                <button className="upvote" onClick={() => upvote(option.id)}>Vote</button>
                                <span>{option.votes_count} Votes</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default VoteComponent;
