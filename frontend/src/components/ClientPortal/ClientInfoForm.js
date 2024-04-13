import React, { useState } from 'react';
import axios from 'axios';
import ClientUploadForm from './ClientUploadForm'; // Import the ClientUploadForm component
import { useNavigate } from 'react-router-dom';

function ClientInfoForm() {
  // Initialize state variables
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    currentMailingAddress: '',
    dateOfBirth: '',
    phoneNumber: '',
    socialSecurityNumber: '',
    _id: null // Placeholder for _id, will be updated later
  });

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [showClientUploadForm, setShowClientUploadForm] = useState(false); // State to control the visibility of the client upload form

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // Define the `handleSubmission` function
  const handleSubmission = async (e) => {
    e.preventDefault();

    // Log client information to console
    console.log('Submitting client information:', formData);

    // Define API URL
    const apiUrl = 'http://localhost:5000/add-client';

    try {
      // Send POST request to server
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle server response
      if (response.status >= 200 && response.status < 300) {
        // Update submission message
        setSubmissionMessage('Client information submitted successfully');

        // Set _id in the form data state
        const clientId = response.data.client._id;
        console.log('Client ID:', clientId); // Add this console log statement
        setFormData({ ...formData, _id: clientId });

        
        // Show the client upload form
        setShowClientUploadForm(true);
      } else {
        // Handle HTTP error
        console.error('HTTP error:', response.status);
        setSubmissionMessage('Error submitting client information. Please try again');
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
      setSubmissionMessage('Error submitting client information. Please try again');
    }
  };

  // Render JSX for the component
  return (
    <div>
      <h2>Client Information Form</h2>
      {!showClientUploadForm ? ( // Conditionally render the client info form based on the state
        <form onSubmit={(e) => handleSubmission(e)}>
          {/* Input fields for client information */}
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="middleName">Middle Name</label>
            <input
              type="text"
              id="middleName"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="currentMailingAddress">Current Mailing Address</label>
            <input
              type="text"
              id="currentMailingAddress"
              value={formData.currentMailingAddress}
              onChange={(e) => setFormData({ ...formData, currentMailingAddress: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="socialSecurityNumber">Social Security Number</label>
            <input
              type="text"
              id="socialSecurityNumber"
              value={formData.socialSecurityNumber}
              onChange={(e) => setFormData({ ...formData, socialSecurityNumber: e.target.value })}
              required
            />
          </div>
          {/* Button to submit the form */}
          <button type="submit">Submit</button>
        </form>
      ) : (
        <ClientUploadForm formData={formData} clientId={formData._id} /> // Pass clientId as a prop
      )}
      {/* Display submission message if available */}
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
}

// Export the component
export default ClientInfoForm;
