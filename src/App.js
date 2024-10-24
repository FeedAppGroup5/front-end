import React, { useState } from 'react';
import CreatePollComponent from './components/CreatePollComponent';
import VoteComponent from './components/VoteComponent';  // Import the VoteComponent
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Tabs from './components/Tabs';
import AuthForm from './components/AuthForm';

function App() {

    const [activeItem, setActiveItem] = useState('Profile');
    const items = ['Profile', 'Polls', 'Auth'];

    const handleTabChange = (item) => {
        setActiveItem(item);
    }

    const renderComponent = () => {
        switch (activeItem) {
            case 'Profile':
                return null; // Here return Profile when that exists. Then we can have the login forms appear if not logged in.
            case 'Polls':
                return <><CreatePollComponent/> <VoteComponent/></> // Here return poll list, and creat poll can be a modal within that.

            case 'Auth':
                return <AuthForm/>

            default:
                return null;
        }
    }

    return (
        <div className="App">
            <Header headerText="Welcome to the Poll App" />

            <Tabs items={items} activeItem={activeItem} onTabChange={handleTabChange} />

            {renderComponent()}

            <Footer footerText="Copyright © 2024 - Mikael Færøvik / Carla Miquel Blasco / Phillip Brat" />
        </div>
    );
}

export default App;
