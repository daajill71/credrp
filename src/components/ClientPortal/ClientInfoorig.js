import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClientInfoForm() {
  // Step 1: Initialize state variables
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentMailingAddress, setCurrentMailingAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Step 2: Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  // Step 3: Define the `handleSubmission` function
  const handleSubmission = async (e) => {
    e.preventDefault();

    // Step 3a: Log client information to console
    console.log('Submitting client information:', {
      firstName,
      middleName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      phoneNumber,
      socialSecurityNumber,
      _id: null // Placeholder for _id, will be updated later
    });

    // Step 3b: Create form data object
    const formData = {
      firstName,
      middleName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      phoneNumber,
      socialSecurityNumber,
    };

    // Step 3c: Define API URL
    const apiUrl = 'http://localhost:5000/add-client';

    try {
      // Step 3d: Send POST request to server
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Step 3e: Handle server response
      if (response.status >= 200 && response.status < 300) {
        // Step 3f: Update submission message
        setSubmissionMessage('Client information submitted successfully');

        // Step 3g: Update _id in the console log
        console.log('Submitting client information:', {
          ...formData,
          _id: response.data._id
        });

        // Step 3h: Navigate to `client-upload` page with client ID
        navigate(`/client-portal/client-upload/${response.data._id}`);
      } else {
        // Step 3i: Handle HTTP error
        console.error('HTTP error:', response.status);
        setSubmissionMessage('Error submitting client information. Please try again');
      }
    } catch (error) {
      // Step 3j: Handle network error
      console.error('Network error:', error);
      setSubmissionMessage('Error submitting client information. Please try again');
    }
  };

  // Step 4: Return JSX for the component
  return (
    <div>
      <h2>Client Information Form</h2>
      <form onSubmit={(e) => handleSubmission(e)}>
        {/* Input fields for client information */}
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            id="middleName"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="currentMailingAddress">Current Mailing Address</label>
          <input
            type="text"
            id="currentMailingAddress"
            value={currentMailingAddress}
            onChange={(e) => setCurrentMailingAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="socialSecurityNumber">Social Security Number</label>
          <input
            type="text"
            id="socialSecurityNumber"
            value={socialSecurityNumber}
            onChange={(e) => setSocialSecurityNumber(e.target.value)}
            required
          />
        </div>
        {/* Button to submit the form */}
        <button type="submit">Submit</button>
      </form>
      {/* Display submission message if available */}
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
}

// Step 5: Export the component
export default ClientInfoForm;
