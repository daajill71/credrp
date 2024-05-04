import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DisputeForm() {
  // Extracting _id from URL params
  const { _id } = useParams();
  console.log('ID from URL:', _id);

  // State variables for client data, description, and submission message
  const [clientData, setClientData] = useState({ firstName: '', lastName: '' });
  const [description, setDescription] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Fetch client first and last names on component mount
  useEffect(() => {
    const fetchClientName = async () => {
      try {
        // Fetching first and last names concurrently using Promise.all
        const [firstNameResponse, lastNameResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/client/${_id}/firstName`),
          axios.get(`http://localhost:5000/api/client/${_id}/lastName`)
        ]);

        // Set client data with fetched first and last names
        setClientData({
          firstName: firstNameResponse.data.firstName,
          lastName: lastNameResponse.data.lastName
        });

        // Set document title if both first and last names are available
        if (firstNameResponse.data.firstName && lastNameResponse.data.lastName) {
          document.title = `${firstNameResponse.data.firstName} ${lastNameResponse.data.lastName} Disputes`;
        }
      } catch (error) {
        console.error('Error fetching client name:', error);
      }
    };

    fetchClientName();
  }, [_id]); // Dependency array to re-fetch data when _id changes

  // Handle form submission
  const handleSubmission = async (e) => {
    e.preventDefault();
    const formData = {
      _id,
      description,
    };

    const apiUrl = `http://localhost:5000/api/disputes/${_id}`;

    try {
      // Make POST request to submit dispute
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful submission
      if (response.status >= 200 && response.status < 300) {
        setSubmissionMessage('Dispute submitted successfully');
        setDescription('');
        // Clear submission message after 5 seconds
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      } else {
        // Handle HTTP error
        console.error('HTTP error:', response.status);
        setSubmissionMessage('Error submitting dispute. Please try again');
        // Clear submission message after 5 seconds
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
      setSubmissionMessage('Error submitting dispute. Please try again');
      // Clear submission message after 5 seconds
      setTimeout(() => {
        setSubmissionMessage('');
      }, 5000);
    }
  };

  // Render form and submission message
  return (
    <div>
      <h2>{clientData.firstName && clientData.lastName ? `${clientData.firstName} ${clientData.lastName} Disputes` : 'Loading...'}</h2>
     
      <form onSubmit={(e) => handleSubmission(e)}>
        <div>
          <label htmlFor="_id">Client ID</label>
          <input type="text" id="_id" value={_id} readOnly />
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
    </div>
  );
}

export default DisputeForm;
