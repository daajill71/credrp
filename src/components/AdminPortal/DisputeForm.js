import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DisputeForm() {
  const { id } = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    const fetchClientName = async () => {
      try {
        const firstNameResponse = await axios.get(`http://localhost:5000/api/clients/${id}/firstName`);
        setFirstName(firstNameResponse.data.firstName);

        const lastNameResponse = await axios.get(`http://localhost:5000/api/clients/${id}/lastName`);
        setLastName(lastNameResponse.data.lastName);

        document.title = `${firstNameResponse.data.firstName} ${lastNameResponse.data.lastName} Disputes`; // Update document title
      } catch (error) {
        console.error('Error fetching client name:', error);
      }
    };

    fetchClientName();
  }, [id, firstName, lastName]); // Include firstName and lastName in the dependency array

  const handleSubmission = async (e) => {
    e.preventDefault();
    const formData = {
      id,
      description,
    };

    const apiUrl = `http://localhost:5000/api/disputes/${id}`;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setSubmissionMessage('Dispute submitted successfully');
        setDescription('');
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      } else {
        console.error('HTTP error:', response.status);
        setSubmissionMessage('Error submitting dispute. Please try again');
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmissionMessage('Error submitting dispute. Please try again');
      setTimeout(() => {
        setSubmissionMessage('');
      }, 5000);
    }
  };

  return (
    <div>
      <h2>{`${firstName} ${lastName} Disputes`}</h2>
      <form onSubmit={(e) => handleSubmission(e)}>
        <div>
          <label htmlFor="clientId">Client ID</label>
          <input type="text" id="clientId" value={id} readOnly />
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
