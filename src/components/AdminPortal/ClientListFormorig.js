import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/clientListStyles.css';

const ClientListForm = () => {
  const [clients, setClients] = useState([]);
  const [showClientDetails, setShowClientDetails] = useState(false); // State for pop-up visibility
  const [selectedClient, setSelectedClient] = useState(null); // State to store selected client
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/clients/list');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDisputeClick = (clientId) => {
    navigate(`/admin-portal/dispute/${clientId}`);
  };

  const handleDisplayDetails = (client) => {
    setSelectedClient(client); // Store selected client
    setShowClientDetails(true); // Show pop-up
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        // Send a request to delete the client
        await axios.delete(`http://localhost:5000/clients/${clientId}`);

        // Update the client list after deletion (optional)
        // Refetch the client list data or remove the deleted client from the current list
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleEditClient = (clientId) => {
    // Navigate to the edit client form page with the clientId
    navigate(`/admin-portal/edit-client/${clientId}`);
  };

  return (
    <div>
      <h2>Client List Form</h2>
      <table className="client-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date Added</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.clientId}>
              <td>{client.firstName}</td>
              <td>{client.lastName}</td>
              <td>{client.dateAdded}</td>
              <td>{client.startDate}</td>
              <td>{client.accountStatus}</td>
              <td>
                <button onClick={() => handleDisputeClick(client.clientId)}>Initiate Dispute</button>
                <button onClick={() => handleDisplayDetails(client)}><FaInfoCircle /></button>
                <button onClick={() => handleEditClient(client.clientId)}><FaEdit /></button>
                <button onClick={() => handleDeleteClient(client.clientId)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pop-up content */}
      {showClientDetails && (
        <div className="popup">
          <h3>Client Details</h3>
          <p>First Name: {selectedClient.firstName}</p>
          <p>Last Name: {selectedClient.lastName}</p>
          <p>Middle Name: {selectedClient.middleName}</p>
          <p>Current Mailing Address: {selectedClient.currentMailingAddress}</p>
          <p>Date of Birth: {selectedClient.dateOfBirth}</p>
          <p>Phone Number: {selectedClient.phoneNumber}</p>
          <p>Social Security Number: {selectedClient.socialSecurityNumber}</p>
          <p>Account Status: {selectedClient.accountStatus}</p>
          <button onClick={() => setShowClientDetails(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ClientListForm;
