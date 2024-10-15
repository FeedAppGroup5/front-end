import React from 'react';
import CreatePollComponent from './components/CreatePollComponent';
import VoteComponent from './components/VoteComponent';  // Import the VoteComponent
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Welcome to the Poll App</h1>

            {/* Display the CreatePollComponent */}
            <CreatePollComponent />

            {/* Display the VoteComponent */}
            <VoteComponent />
        </div>
    );
}

export default App;
