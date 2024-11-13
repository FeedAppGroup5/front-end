import React, { useState } from 'react';
import CreatePollComponent from './components/CreatePollComponent';
import VoteComponent from './components/VoteComponent';  // Import the VoteComponent
import './App.css';
import Header from './components/Header';
import Tabs from './components/Tabs';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';

function App() {

    // State to track the active tab
    const [activeItem, setActiveItem] = useState('Profile');
    const items = ['Profile', 'Polls'];

    // Default to false, assuming user is not logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleTabChange = (item) => {
        setActiveItem(item);
    };

    // Function to handle login - this can be passed to AuthForm to update the state
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Function to handle logout - passed to Profile component
    const handleLogout = () => {
        setIsAuthenticated(false);
    };


    const renderComponent = () => {
        switch (activeItem) {
            case 'Profile':
                return isAuthenticated ? (
                    <Profile onLogout={handleLogout} />
                ) : (
                    <AuthForm onLogin={handleLogin} />
                ); // Return Profile when that exists. Then we can have the login forms appear if not logged in.
            case 'Polls':
                return <><CreatePollComponent/> <VoteComponent/></> // Here return poll list, and creat poll can be a modal within that.
            default:
                return null;
        }
    }

    return (
        <div className="App">
            <Header headerText="Welcome to the Poll App"/>

            <Tabs items={items} activeItem={activeItem} onTabChange={handleTabChange}/>

            {/* Wrap main content in a div with class "content" */}
            <div className="content">
                {renderComponent()}
            </div>
            <footer>
                <div className="copyright">
                    Copyright © 2024 - Mikael Færøvik / Carla Miquel Blasco / Phillip Brat
                </div>
            </footer>

        </div>
    );
}

export default App;
