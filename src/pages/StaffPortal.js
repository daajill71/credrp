// StaffPortal.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientListForm from '../ClientListForm';
import DisputeForm from '../DisputeForm';
import DisputeListForm from '../DisputeList';

const StaffPortal = () => {
  return (
    <div>
      <h2>Staff Portal</h2>
      <nav>
        <ul>
          <li>
            <Link to="/admin/client-list"> List of Clients Form</Link>
          </li>
          <li>
            <Link to="/admin/dispute">Dispute Form</Link>
          </li>
          <li>
            <Link to="/admin/dispute-list">Dispute List Form</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/admin/client-list" element={<ClientListForm />} />
        <Route path="/admin/dispute" element={<DisputeForm />} />
        <Route path="/admin/dispute-list" element={<DisputeListForm />} />
      </Routes>
    </div>
  );
};

export default StaffPortal;
