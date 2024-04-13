import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000'; // Define your API base URL

function DisputeList() {
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend API endpoint using the fetch API
    fetch(`${API_BASE_URL}/api/disputes`)
      .then((response) => {
        // Check if the response status is OK (status code 200)
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        // Parse the JSON response
        return response.json();
      })
      .then((data) => {
        // Set the disputes state with the data
        setDisputes(data);
        console.log('Data fetched successfully:', data); // Log successful response
      })
      .catch((error) => {
        setError(error); // Set the error state
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
            {disputes.map((dispute, index) => (
              <li key={index}>
                <strong>Client Name:</strong> {dispute.clientName}<br />
                <strong>Description:</strong> {dispute.description}
              </li>
            ))}
          </ul>
          {/* Add this code to display the fetched data */}
          <div>
            <h3>Fetched Data:</h3>
            <pre>{JSON.stringify(disputes, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisputeList;
