// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional global styles
import App from './App'; // Main app component

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root') // 'root' is the ID of the root div in index.html
);