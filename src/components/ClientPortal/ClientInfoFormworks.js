import React, { useState } from 'react';
import axios from 'axios';

function ClientInfoForm() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentMailingAddress, setCurrentMailingAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleSubmission = async (e) => {
    e.preventDefault();

    console.log('Submitting client information:', {
      firstName,
      middleName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      phoneNumber,
      socialSecurityNumber,
    });

    const formData = {
      firstName,
      middleName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      phoneNumber,
      socialSecurityNumber,
    };

    const apiUrl = 'http://localhost:5000/add-client';

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Response data:', response.data);
        setSubmissionMessage('Client information submitted successfully');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setCurrentMailingAddress('');
        setDateOfBirth('');
        setPhoneNumber('');
        setSocialSecurityNumber('');
      } else {
        console.error('HTTP error:', response.status);
        setSubmissionMessage('Error submitting client information. Please try again');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmissionMessage('Error submitting client information. Please try again');
    }
  };

  return (
    <div>
      <h2>Client Information Form</h2>
      <form onSubmit={(e) => handleSubmission(e)}>
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
        <button type="submit">Submit</button>
      </form>
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
}

export default ClientInfoForm;
