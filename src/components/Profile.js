import React, { useState, useEffect } from 'react';
import './Profile.css';
import { API_KEY } from '../config';

function Profile({ onLogout }) {
    const [polls, setPolls] = useState([]);
    const [selectedPollId, setSelectedPollId] = useState('');
    const [editedPoll, setEditedPoll] = useState({ question: '', valid_to: '' });
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const loggedInUserId = localStorage.getItem('user_id'); // Retrieve user ID from local storage
        if (loggedInUserId) {
            setUserId(loggedInUserId);
        }
        fetchUserPolls(loggedInUserId);
    }, []);

    const fetchUserPolls = async (loggedInUserId) => {
        const token = localStorage.getItem('token'); // Retrieve the token

        if (!token) {
            alert('User is not authenticated. Please log in.');
            return; // Exit if no token
        }

        try {
            const response = await fetch('http://localhost:8000/api/v1/polls', {
                method: 'GET',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Include token for authorization
                }
            });
            if (response.ok) {
                const pollsData = await response.json();
                // Filter the polls to show only those created by the logged-in user
                const userPolls = pollsData.items.filter(poll => poll.user.id === loggedInUserId);
                setPolls(userPolls);
            } else {
                console.error('Failed to fetch polls:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const fetchPollToEdit = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token

        try {
            const response = await fetch(`http://localhost:8000/api/v1/polls/${selectedPollId}`, {
                method: 'GET',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Include token for authorization
                }
            });
            if (response.ok) {
                const pollData = await response.json();
                // Only set the poll data if the logged-in user owns the poll
                if (pollData.response.user.id === userId) {
                    setEditedPoll({
                        question: pollData.response.question,
                        valid_to: pollData.response.valid_to,
                    });
                } else {
                    alert('You can only edit your own polls');
                }
            } else {
                console.error('Failed to fetch poll details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching poll details:', error);
        }
    };

    const updatePoll = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token

        if (!selectedPollId) {
            alert('Please select a poll to edit.');
            return;
        }

        if (!editedPoll.question || !editedPoll.valid_to) {
            alert('Please fill in all the fields.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/polls/${selectedPollId}`, {
                method: 'PUT',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Include token for authorization
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: editedPoll.question,
                    valid_to: editedPoll.valid_to,
                }),
            });

            if (response.ok) {
                alert('Poll updated successfully.');
                fetchUserPolls(userId); // Refresh the list of polls after updating
                setSelectedPollId(''); // Reset selected poll ID
                setEditedPoll({ question: '', valid_to: '' }); // Reset edit form
            } else {
                console.error('Failed to update poll:', response.statusText);
                alert('Failed to update poll.');
            }
        } catch (error) {
            console.error('Error updating poll:', error);
            alert('Error occurred while updating the poll.');
        }
    };

    const deletePoll = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token

        if (!selectedPollId) {
            alert('Please select a poll to delete.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/v1/polls/${selectedPollId}`, {
                method: 'DELETE',
                headers: {
                    'X-Apikey': API_KEY,
                    'Authorization': `Bearer ${token}`, // Include token for authorization
                }
            });

            if (response.ok) {
                alert('Poll deleted successfully.');
                fetchUserPolls(userId); // Refresh the list of polls after deletion
                setSelectedPollId(''); // Reset selected poll ID
            } else {
                console.error('Failed to delete poll:', response.statusText);
                alert('Failed to delete poll.');
            }
        } catch (error) {
            console.error('Error deleting poll:', error);
            alert('Error occurred while deleting the poll.');
        }
    };

    return (
        <div className="profile-container">
            <h2>Welcome to Your Profile</h2>
            <div className="profile-details">
                <p><strong>Username:</strong> {localStorage.getItem('username')}</p>
                <p><strong>Email:</strong> {localStorage.getItem('email')}</p>
            </div>

            <div className="poll-edit-section">
                <label htmlFor="pollSelect">Select Poll to Edit:</label>
                <select
                    id="pollSelect"
                    value={selectedPollId}
                    onChange={(e) => {
                        setSelectedPollId(e.target.value);
                        fetchPollToEdit();
                    }}
                >
                    <option value="" disabled>Select a poll</option>
                    {polls.map((poll) => (
                        <option key={poll.id} value={poll.id}>
                            {poll.question}
                        </option>
                    ))}
                </select>

                {selectedPollId && (
                    <div className="edit-poll-form">
                        <h3>Edit Poll</h3>
                        <div className="form-group">
                            <label htmlFor="question">Poll Question:</label>
                            <input
                                type="text"
                                id="question"
                                value={editedPoll.question}
                                onChange={(e) => setEditedPoll({ ...editedPoll, question: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="validTo">Expiration Date:</label>
                            <input
                                type="date"
                                id="validTo"
                                value={editedPoll.valid_to}
                                onChange={(e) => setEditedPoll({ ...editedPoll, valid_to: e.target.value })}
                            />
                        </div>
                        <button onClick={updatePoll} className="update-btn">
                            Update Poll
                        </button>
                    </div>
                )}

                <button onClick={deletePoll} className="delete-btn">Delete Poll</button>
            </div>

            <button className="logout-btn" onClick={onLogout}>Log Out</button>
        </div>
    );
}

export default Profile;
