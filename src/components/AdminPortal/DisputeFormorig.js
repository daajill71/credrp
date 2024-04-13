import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DisputeForm() {
  // Get the client ID from the URL params
  const { id } = useParams();
  // State variables to store first name, last name, description, and submission message
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  // useEffect hook to fetch client name based on client ID
  useEffect(() => {
    // Define an async function to fetch client name
    const fetchClientName = async () => {
      try {
        // Log that we are fetching the client name for the given ID
        console.log('Fetching client name by ID:', id);
        // Send a GET request to fetch the first name
        const firstNameResponse = await axios.get(`http://localhost:5000/api/clients/${id}/firstName`);
        // Log the response data containing the first name
        console.log('First name response:', firstNameResponse.data);
        // Update the first name state with the fetched data
        setFirstName(firstNameResponse.data.firstName);

        // Send a GET request to fetch the last name
        const lastNameResponse = await axios.get(`http://localhost:5000/api/clients/${id}/lastName`);
        // Log the response data containing the last name
        console.log('Last name response:', lastNameResponse.data);
        // Update the last name state with the fetched data
        setLastName(lastNameResponse.data.lastName);

        // Log that client name has been successfully fetched
        console.log('Client name fetched successfully.');
      } catch (error) {
        // Log any errors that occur during the fetch process
        console.error('Error fetching client name:', error);
        // Log that there was an error fetching the client name
        console.log('Error fetching first and last name.');
      }
    };

    // Call the fetchClientName function when the component mounts or when the client ID changes
    fetchClientName();
  }, [id]); // Dependency array with 'id' ensures that the effect runs when 'id' changes

  // useEffect hook to update the document title with the fetched first and last names
  useEffect(() => {
    // Log that we are updating the document title
    console.log('Updating document title:', `${firstName} ${lastName} Disputes`);
    // Update the document title with the fetched first and last names
    document.title = `${firstName} ${lastName} Disputes`;
  }, [firstName, lastName]); // Dependency array with 'firstName' and 'lastName' ensures that the effect runs when either of them changes

  // Function to handle form submission
  const handleSubmission = async (e) => {
    e.preventDefault();
    // Prepare form data to be submitted
    const formData = {
      id,
      description,
    };

    const apiUrl = `http://localhost:5000/api/disputes/${id}`;

    try {
      // Send a POST request to submit the form data
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the submission was successful
      if (response.status >= 200 && response.status < 300) {
        // If successful, set a submission message indicating success
        setSubmissionMessage('Dispute submitted successfully');
        // Clear the description field
        setDescription('');
        // Hide the submission message after 5 seconds
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      } else {
        // If there was an HTTP error, log the status code
        console.error('HTTP error:', response.status);
        // Set a submission message indicating an error
        setSubmissionMessage('Error submitting dispute. Please try again');
        // Hide the submission message after 5 seconds
        setTimeout(() => {
          setSubmissionMessage('');
        }, 5000);
      }
    } catch (error) {
      // If there was a network error, log the error
      console.error('Network error:', error);
      // Set a submission message indicating an error
      setSubmissionMessage('Error submitting dispute. Please try again');
      // Hide the submission message after 5 seconds
      setTimeout(() => {
        setSubmissionMessage('');
      }, 5000);
    }
  };

  return (
    <div>
      {/* Display the client name as the heading */}
      <h2>{`${firstName} ${lastName} Disputes`}</h2>
      {/* Form to submit a dispute */}
      <form onSubmit={(e) => handleSubmission(e)}>
        <div>
          <label htmlFor="clientId">Client ID</label>
          {/* Display the client ID (read-only) */}
          <input type="text" id="clientId" value={id} readOnly />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          {/* Textarea to enter the dispute description */}
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {/* Button to submit the dispute */}
        <button type="submit">Submit</button>
      </form>
      {/* Display the submission message if it exists */}
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
}

export default DisputeForm;
