import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const DisputeList = () => {
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API endpoint using Axios
    axios.get(`${API_BASE_URL}/api/disputes`)
      .then((response) => {
        const data = response.data;
        setDisputes(data);
        console.log('Data fetched successfully:', data);
      })
      .catch((error) => {
        setError(error);
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Dispute List</h2>
      {error ? (
        <div>
          <p>Error occurred while fetching data:</p>
          <pre>{error.message}</pre>
        </div>
      ) : (
        <div>
          <ul>
            {disputes.map((dispute) => (
              <li key={dispute.id}> {/* Assuming each dispute has a unique 'id' */}
                <strong>Client Name:</strong> {dispute.clientName}<br />
                <strong>Description:</strong> {dispute.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DisputeList;
