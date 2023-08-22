import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://credrp-backend.onrender.com'; // Define your API base URL

function DisputeList() {
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API endpoint
    axios.get(`${API_BASE_URL}/disputes`) // Use the base URL and specific endpoint
      .then((response) => {
        setDisputes(response.data);
        console.log('Data fetched successfully:', response.data); // Log successful response
      })
      .catch((error) => {
        setError(error); // Set the error state
        console.error('Error fetching data:', error);
        if (error.response) {
          console.log('Error response details:', error.response);
          console.log('Error status details:', error.response.status);
          console.log('Error response data:', error.response.data);
        }
      });
  }, []);

  return (
    <div>
      <h2>Dispute List</h2>
      {error ? (
        <div>
          <p>Error occurred while fetching data:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <ul>
          {disputes.map((dispute) => (
            <li key={dispute._id}>
              <strong>Client Name:</strong> {dispute.clientName}<br />
              <strong>Description:</strong> {dispute.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DisputeList;
