// ClientPortal.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientInfoForm from '../components/ClientInfoForm';
import ClientUploadForm from '../components/ClientPortal/ClientUploadForm';
import ClientUploadsOnlyForm from '../components/ClientPortal/ClientUploadsOnlyForm';

const ClientPortal = () => {
  return (
    <div>
      <h2>Client Portal</h2>
      <nav>
        <ul>
          <li>
            <Link to="client-info">Client Info Form</Link>
          </li>
          <li>
            <Link to="client-uploadsonly">Client Uploads Only</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="client-info" element={<ClientInfoForm />} />
        <Route path="client-upload/:id" element={<ClientUploadForm />} />
        <Route path="client-uploadsonly" element={<ClientUploadsOnlyForm />} />
      </Routes>
    </div>
  );
};

export default ClientPortal;
