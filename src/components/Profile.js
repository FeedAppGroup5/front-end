import React, { useState, useEffect } from 'react';
import './Profile.css';
import { API_KEY } from '../config';

function Profile({ onLogout }) {
    const [polls, setPolls] = useState([]);
    const [selectedPollId, setSelectedPollId] = useState('');

    useEffect(() => {
        fetchUserPolls();
    }, []);

    const fetchUserPolls = async () => {
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
                // Assuming the API returns only the polls created by the logged-in user
                setPolls(pollsData.items);
            } else {
                console.error('Failed to fetch polls:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
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
                fetchUserPolls(); // Refresh the list of polls after deletion
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
                <p><strong>Username:</strong> {localStorage.getItem('username')} </p>
                <p><strong>Email:</strong> {localStorage.getItem('email')}</p>
            </div>
            <div className="poll-delete-section">
                <label htmlFor="pollSelect">Select Poll to Delete:</label>
                <select
                    id="pollSelect"
                    value={selectedPollId}
                    onChange={(e) => setSelectedPollId(e.target.value)}
                >
                    <option value="" disabled>Select a poll</option>
                    {polls.map(poll => (
                        <option key={poll.id} value={poll.id}>{poll.question}</option>
                    ))}
                </select>
                <button onClick={deletePoll} className="delete-btn">Delete Poll</button>
            </div>
            <button className="logout-btn" onClick={onLogout}>
                Log Out
            </button>
        </div>
    );
}

export default Profile;
