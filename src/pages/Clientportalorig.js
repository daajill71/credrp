// ClientPortal.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientInfoForm from '../components/ClientPortal/ClientInfoForm';
import ClientUploadForm from '../components/ClientPortal/ClientUploadForm';
import ClientUploadsOnlyForm from '../components/ClientPortal/ClientUploadsOnlyForm';

const ClientPortal = () => {
  return (
    <div>
      {/* Set up the React Router's Routes component to handle nested routes */}
      <Routes>
        {/* Route for the client information form */}
        <Route path="/client-info" element={<ClientInfoForm />} />
        
        {/* Route for the client upload form with a dynamic client ID parameter */}
        <Route path="/client-upload/:_id" element={<ClientUploadForm />} />
        
        {/* Route for a client uploads-only form */}
        <Route path="/client-uploadsonly" element={<ClientUploadsOnlyForm />} />
        
        {/* Default route (considered as the root route or other routes) */}
        <Route
          path="*"
          element={
            <>
              {/* Display the heading for the Client Portal */}
              <h2>Client Portal</h2>
              
              {/* Create navigation links using the Link component */}
              <nav>
                <ul>
                  {/* Link to the client information form */}
                  <li>
                    <Link to="/client-portal/client-info">Client Info Form</Link>
                  </li>
                  
                  {/* Link to the client uploads-only form */}
                  <li>
                    <Link to="/client-portal/client-uploadsonly">Client Uploads Only</Link>
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

export default ClientPortal;
