// Import necessary dependencies from React and React Router
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import the components for each route from the Adminportal directory
import ClientListForm from '../components/AdminPortal/ClientListForm';
import DisputeForm from '../components/AdminPortal/DisputeForm';
import CreditReportForm from '../components/AdminPortal/CreditReportForm';
import DisputeListForm from '../components/AdminPortal/DisputeList';

// Define the functional component AdminPortal
const AdminPortal = () => {
  return (
    <div>
      {/* Set up the React Router's Routes component to handle nested routes */}
      <Routes>
        {/* Route for the List of Clients Form */}
        <Route path="/client-list" element={<ClientListForm />} />

        {/* Route for the Dispute Form */}
        <Route path="/dispute/:_id" element={<DisputeForm />} />

        {/* Route for the Credit Report Form */}
        <Route path="/analysis/:_id" element={<CreditReportForm />} />

        {/* Route for the Dispute List Form */}
        <Route path="/dispute-list" element={<DisputeListForm />} />

        {/* Default route (considered as the root route or other routes) */}
        <Route
          path="*"
          element={
            <>
              {/* Display the heading for the Admin Portal */}
              <h2>Admin Portal</h2>

              {/* Create navigation links using the Link component from React Router */}
              <nav>
                <ul>
                  {/* Link to the List of Clients Form */}
                  <li>
                    <Link to="/admin-portal/client-list">List of Clients Form</Link>
                  </li>
                  

                  {/* Link to the Dispute List Form */}
                  <li>
                    <Link to="/admin-portal/dispute-list">Dispute List Form</Link>
                  </li>
                </ul>
              </nav>
            </>
          }
        />
      </Routes>
    </div>
  );
};

// Export the AdminPortal component as the default export
export default AdminPortal;
