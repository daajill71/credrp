import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
//import { ObjectId } from 'bson'; // Import ObjectId from the 'bson' library
import '../../styles/clientListStyles.css';

const ClientListForm = () => {
  const [clients, setClients] = useState([]);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
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

  // Function to check if a string is a valid MongoDB ObjectId
  //const isValidObjectId = (id) => {
    //try {
      //return ObjectId.isValid(id);
    //} catch (error) {
      //return false;
    //}
 // };

  const handleDisputeClick = (_id) => {
    navigate(`/admin-portal/dispute/${_id}`);
  };

  const handleDisplayDetails = (client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const handleEditClient = (client) => {
    setEditClient(client);
    setEditFirstName(client.firstName);
    setEditLastName(client.lastName);
  };

  const handleSubmitEdit = async () => {
    try {
      const updatedClient = { ...editClient, firstName: editFirstName, lastName: editLastName };
      await axios.put(`http://localhost:5000/edit-client/${editClient.clientId}`, updatedClient);
      // Update the client list after editing
      // Refetch the client list data or update the client details in the current list
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error editing client:', error);
    }

    setEditClient(null);
    setEditFirstName('');
    setEditLastName('');
  };

  const handleDeleteClient = async (clientId) => {
    //if (!isValidObjectId(clientId)) {
      //console.error('Invalid client ID');
      //return; // Exit function if client ID is invalid
    //}

    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`http://localhost:5000/delete-client/${clientId}`);
        // Update the client list after deletion
        // Refetch the client list data or remove the deleted client from the current list
        setClients(clients.filter((client) => client.clientId !== clientId));
      } catch (error) {
        console.error(`Error deleting client with ID ${clientId}:`, error);
      }
    }
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
            <tr key={client._id}>
              <td>{client.firstName}</td>
              <td>{client.lastName}</td>
              <td>{client.dateAdded}</td>
              <td>{client.createdAt}</td>
              <td>{client.accountStatus}</td>
              <td>
                <button onClick={() => handleDisputeClick(client._id)}>Initiate Dispute</button>
                <button onClick={() => handleDisplayDetails(client)}><FaInfoCircle /></button>
                <button onClick={() => handleEditClient(client)}><FaEdit /></button>
                <button onClick={() => handleDeleteClient(client.clientId)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Client Details Pop-up */}
      {editClient && (
        <div className="popup">
          <h3>Edit Client Details</h3>
          <div className="input-group">
            <label htmlFor="editFirstName">First Name:</label>
            <input
              type="text"
              id="editFirstName"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="editLastName">Last Name:</label>
            <input
              type="text"
              id="editLastName"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
            />
          </div>
          <button onClick={handleSubmitEdit}>Save</button>
          <button onClick={() => setEditClient(null)}>Cancel</button>
        </div>
      )}

      {/* Client Details Pop-up */}
      {showClientDetails && (
        <div className="popup">
          <h3>Client Details</h3>
          <p>First Name: {selectedClient.firstName}</p>
          <p>Last Name: {selectedClient.lastName}</p>
          <button onClick={() => setShowClientDetails(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ClientListForm;
