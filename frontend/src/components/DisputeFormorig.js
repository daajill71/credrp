import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DisputeForm() {
  const { clientID } = useParams(); // Access URL parameters

  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    // You can fetch additional client details using the clientID if needed
    // For example:
    // const fetchClientDetails = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:5000/api/clients/${clientID}`);
    //     setClientName(response.data.name);
    //     // Set other client details if needed
    //   } catch (error) {
    //     console.error('Error fetching client details:', error);
    //   }
    // };
    // fetchClientDetails();
  }, [clientID]);

  const handleSubmission = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    console.log('Submitting dispute:', { clientID, clientName, description });

    const formData = {
      clientName,
      description,
    };

    // Define the URL of your backend API
    const apiUrl = `http://localhost:5000/api/disputes/${clientID}`;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // The request was successful
        console.log('Response data:', response.data);
        setSubmissionMessage('Dispute submitted successfully');
        setClientName('');
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
      <h2>Submit a Dispute</h2>
      <form onSubmit={(e) => handleSubmission(e)}>
        {/* ... (form fields) */}
        <button type="submit">Submit</button>
      </form>
      {submissionMessage && <p>{submissionMessage}</p>}
      {clientID && <p>Client ID from URL: {clientID}</p>}
    </div>
  );
}

export default DisputeForm;
