import React from 'react';
//import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import './index.css';

const root = document.getElementById('root');
const rootContainer = createRoot(root); // Use createRoot from react-dom/client
rootContainer.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
