import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientEditDetailsForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    currentMailingAddress: '',
    dateOfBirth: '',
    phoneNumber: '',
    socialSecurityNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-client/_id'); // Replace '123456789' with the actual client ID
        const { data } = response;
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setError('Error fetching client details. Please try again.');
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/edit-client/_id', formData); // Replace '123456789' with the actual client ID
      if (response.status === 200) {
        setSuccessMessage('Client details updated successfully');
      } else {
        setError('Error updating client details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating client details:', error);
      setError('Error updating client details. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Edit Client Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="currentMailingAddress">Current Mailing Address</label>
          <input
            type="text"
            id="currentMailingAddress"
            name="currentMailingAddress"
            value={formData.currentMailingAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="socialSecurityNumber">Social Security Number</label>
          <input
            type="text"
            id="socialSecurityNumber"
            name="socialSecurityNumber"
            value={formData.socialSecurityNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default ClientEditDetailsForm;
