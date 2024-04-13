import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters

function DisputeForm() {
  const { id } = useParams(); // Access URL parameters if needed

  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmission = async (e) => {
    e.preventDefault();

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
        setSubmissionMessage('Dispute submitted successfully'); // Set the success message
        setClientName(''); // Reset the form fields
        setDescription('');
        // Clear the message after 5 seconds
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      } else {
        // Handle other status codes (e.g., 404, 500, etc.) if needed.
        console.error('HTTP error:', response.status);
        setSubmissionMessage('Error submitting dispute. Please try again'); // Set an error message
        // Clear the error message after 5 seconds
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      }
    } catch (error) {
      // Handle network errors (e.g., no internet connection, server unreachable, etc.).
      console.error('Network error:', error);
      setSubmissionMessage('Error submitting dispute. Please try again'); // Set an error message
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setSubmissionMessage('');
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Submit a Dispute</h2>
      <form onSubmit={(e) => handleSubmission(e)}>
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
      {submissionMessage && <p>{submissionMessage}</p>}
      {id && <p>URL Parameter 'id': {id}</p>} {/* Display the URL parameter if present */}
    </div>
  );
}

export default DisputeForm;
