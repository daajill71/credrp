import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios';

const ClientListForm = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

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

  const handleDisputeClick = (clientID) => {
    // Redirect to the DisputeForm page with the clientID and client's first name as parameters
    navigate(`/admin-portal/dispute/${clientID}`);
  };

  return (
    <div>
      <h2>Client List Form</h2>
      <form>
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Mailing Address</th>
              <th>Date of Birth</th>
              <th>Phone Number</th>
              <th>Social Security Number</th>
              <th>Account Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.clientId}>
                <td>{client.clientId}</td>
                <td>{client.firstName}</td>
                <td>{client.middleName}</td>
                <td>{client.lastName}</td>
                <td>{client.currentMailingAddress}</td>
                <td>{client.dateOfBirth}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.socialSecurityNumber}</td>
                <td>{client.accountStatus}</td>
                <td>
                  <button onClick={() => handleDisputeClick(client.clientId)}>
                    Initiate Dispute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default ClientListForm;
