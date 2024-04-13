// Import necessary dependencies from React and React Router
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import the components for each route from the Adminportal directory
import ClientListForm from '../components/AdminPortal/ClientListForm'; // Step 1
import DisputeForm from '../components/AdminPortal/DisputeForm'; // Step 1
import DisputeListForm from '../components/AdminPortal/DisputeList'; // Step 1


// Define the functional component AdminPortal
const AdminPortal = () => {
  return (
    <div>
      {/* Step 2: Display the heading for the Admin Portal */}
      <h2>Admin Portal</h2>

      {/* Step 3: Create navigation links using the Link component from React Router */}
      <nav>
        <ul>
          {/* Step 4: Link to the List of Clients Form */}
          <li><Link to="client-list"> List of Clients Form</Link></li>
          
          {/* Step 5: Link to the Dispute Form */}
          <li><Link to="dispute">Dispute Form</Link></li>
          
          {/* Step 6: Link to the Dispute List Form */}
          <li><Link to="dispute-list">Dispute List Form</Link></li>
        </ul>
      </nav>

      {/* Step 7: Use Routes component for handling nested routes */}
      <Routes>
        {/* Step 8: Route for the List of Clients Form */}
        <Route path="client-list" element={<ClientListForm />} />
        
        {/* Step 9: Route for the Dispute Form */}
        <Route path="dispute" element={<DisputeForm />} />
        
        {/* Step 10: Route for the Dispute List Form */}
        <Route path="dispute-list" element={<DisputeListForm />} />
      </Routes>
    </div>
  );
};

// Step 11: Export the AdminPortal component as the default export
export default AdminPortal;
