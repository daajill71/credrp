// Step 1: Import React and necessary components from React Router
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Step 1

// Step 2: Import the custom components for different portals
import ClientPortal from './components/Pages/ClientPortal'; // Step 2
import StaffPortal from './components/Pages/StaffPortal'; // Step 2
import AdminPortal from './components/Pages/AdminPortal'; // Step 2
import Homepage from './components/Homepage'; // Step 2

// Step 3: Define the main App component
function App() {
  return (
    <div className="App">
      {/* Step 4: Set up the Router component from React Router */}
      <Router>
        {/* Step 5: Display the header with the title */}
        <header className="App-header">
          <h1>Credit Repair Software</h1>
          {/* Step 6: Create navigation links using the Link component */}
          <nav>
            <ul>
              {/* Step 7: Link to the Client Portal */}
              <li><Link to="/client-portal">Client Portal</Link></li>
              
              {/* Step 8: Link to the Staff Portal */}
              <li><Link to="/staff-portal">Staff Portal</Link></li>
              
              {/* Step 9: Link to the Admin Portal */}
              <li><Link to="/admin-portal">Admin Portal</Link></li>
            </ul>
          </nav>
        </header>
        
        {/* Step 10: Set up the Routes component for handling different routes */}
        <main>
          <Routes>
            {/* Step 11: Route for the Client Portal */}
            <Route path="/client-portal" element={<ClientPortal />} />
            
            {/* Step 12: Route for the Staff Portal */}
            <Route path="/staff-portal" element={<StaffPortal />} />
            
            {/* Step 13: Route for the Admin Portal */}
            <Route path="/admin-portal" element={<AdminPortal />} />
            
            {/* Step 14: Default route for other paths */}
            <Route path="/*" element={<Homepage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

// Step 15: Export the App component as the default export
export default App;
