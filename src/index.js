// File: src/index.js
// Place this file in your src directory

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/mobile/shared/variables.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);