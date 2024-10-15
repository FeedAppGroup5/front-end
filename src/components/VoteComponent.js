import React, { useState, useEffect } from 'react';
import './VoteComponent.css';

function VoteComponent() {
    const [polls, setPolls] = useState([]);
    const [selectedPollId, setSelectedPollId] = useState(null);
    const [selectedPoll, setSelectedPoll] = useState(null);

    // Fetch all polls when component mounts
    useEffect(() => {
        fetchAllPolls();
    }, []);

    const fetchAllPolls = async () => {
        try {
            const response = await fetch('http://localhost:8080/polls');
            if (response.ok) {
                const polls = await response.json();
                setPolls(polls);
            } else {
                console.error('Failed to fetch polls:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const fetchSelectedPoll = async (pollId) => {
        try {
            const response = await fetch(`http://localhost:8080/polls/${pollId}`);
            if (response.ok) {
                const poll = await response.json();
                setSelectedPoll(poll);
            } else {
                console.error('Failed to fetch poll:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching poll:', error);
        }
    };

    const upvote = async (option) => {
        const voteData = {
            voteOption: {
                caption: option.caption,
                presentationOrder: option.presentationOrder,
                upvote: option.upvote
            },
            publishedAt: new Date().toISOString()
        };

        try {
            const response = await fetch(`http://localhost:8080/votes/${selectedPoll.pollId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voteData)
            });

            if (response.ok) {
                option.upvote += 1;
                alert(`Vote cast successfully! There are now ${option.upvote} votes for ${option.caption}.`);
            } else {
                console.error('Failed to cast vote:', response.statusText);
            }
        } catch (error) {
            console.error('Error casting vote:', error);
        }
    };

    return (
        <div>
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
                    <option value="" disabled>Select Poll</option>
                    {polls.map(poll => (
                        <option key={poll.pollId} value={poll.pollId}>{poll.question}</option>
                    ))}
                </select>
            </div>

            {selectedPoll && (
                <>
                    <h3>Poll id: {selectedPoll.pollId}</h3>
                    <blockquote>{selectedPoll.question}</blockquote>
                    <ul>
                        {selectedPoll.voteOptions.map((option, index) => (
                            <li key={index}>
                                <div className="option">{option.caption}</div>
                                <div className="buttons">
                                    <button className="upvote" onClick={() => upvote(option)}>vote</button>
                                </div>
                                <span>{option.upvote} Votes</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default VoteComponent;
