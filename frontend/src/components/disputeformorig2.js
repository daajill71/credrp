import React, { useState } from 'react';
import axios from 'axios';

function DisputeForm() {
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmission = async () => {
    
    // Prepare the data to be sent to the backend
    console.log('Submitting dispute:', { clientName, description });

    const formData = {
      clientName,
      description,
    };

    // Define the URL of your backend API
    const apiUrl = 'http://localhost:5000/api/disputes'; // Replace with your actual API endpoint

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // The request was successful (status code in the range 200-299).
        // Access response data:
        console.log('Response data:', response.data);
      } else {
        // Handle other status codes (e.g., 404, 500, etc.) if needed.
        console.error('HTTP error:', response.status);
      }
    } catch (error) {
      // Handle network errors (e.g., no internet connection, server unreachable, etc.).
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <h2>Submit a Dispute</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmission(); }}>
        <div>
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DisputeForm;
