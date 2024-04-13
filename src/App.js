// Import necessary dependencies from React and React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import the custom components for different portals
import ClientPortal from './pages/ClientPortal'; // Remove file extension
import AdminPortal from './pages/AdminPortal'; // Remove file extension

// Define the main App component
function App() {
  return (
    <div className="App">
      {/* Set up the Router component from React Router */}
      <Router>
        {/* Set up the Routes component for handling different routes */}
        <main>
          <Routes>
            {/* Route for the Client Portal */}
            <Route path="/client-portal/*" element={<ClientPortal />} />

            {/* Route for the Admin Portal */}
            <Route path="/admin-portal/*" element={<AdminPortal />} />

            {/* Default route (considered as the root route or other routes) */}
            <Route
              path="*"
              element={
                <>
                  {/* Display the header with the title */}
                  <header className="App-header">
                    <h1>Credit Repair Software</h1>
                    {/* Create navigation links using the Link component */}
                    <nav>
                      <ul>
                        {/* Link to the Client Portal */}
                        <li>
                          <Link to="/client-portal">Client Portal</Link>
                        </li>

                        {/* Link to the Admin Portal */}
                        <li>
                          <Link to="/admin-portal">Admin Portal</Link>
                        </li>
                      </ul>
                    </nav>
                  </header>

                  {/* Other content (e.g., additional routes) can go here */}
                </>
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

// Render the App component into the root element
export default App;
