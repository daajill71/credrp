// ClientPortal.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TabbedForm from '../components/ClientPortal/TabbedForm';

const ClientPortal = () => {
  return (
    <div>
      {/* Set up the React Router's Routes component to handle nested routes */}
      <Routes>
        {/* Route for the tabbed form */}
        <Route path="/" element={<TabbedForm />} />
        
        {/* Route for the client upload form with a dynamic client ID parameter */}
        <Route path="/client-upload/:_id" element={<TabbedForm />} />
      </Routes>
    </div>
  );
};

export default ClientPortal;
