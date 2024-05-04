import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const ClientUploadForm = ({ formData }) => {
  const { _id } = formData;
  console.log('ID from ClientInfoForm:', _id);

  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRefs = {
    driverLicense: useRef(null),
    proofOfMailingAddress: useRef(null),
    socialSecurityCard: useRef(null),
    otherDocument: useRef(null),
  };

  console.log('fileInputRefs:', fileInputRefs);

  const [fileUploads, setFileUploads] = useState({
    driverLicense: null,
    proofOfMailingAddress: null,
    socialSecurityCard: null,
    otherDocument: null,
  });

  const handleFileChange = (fieldName, e) => {
    const file = e.target.files[0];
    console.log('Selected File:', file);
    console.log('File Name:', fieldName);
    setFileUploads((prevFileUploads) => ({
      ...prevFileUploads,
      [fieldName]: file,
    }));
  };

  const handleFileDelete = (fieldName) => {
    setFileUploads((prevFileUploads) => ({
      ...prevFileUploads,
      [fieldName]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!_id) {
      alert('Client ID is missing.');
      return;
    }

    try {
      const documentData = new FormData();

      documentData.append('clientId', _id);

      for (const fieldName in fileUploads) {
        const file = fileUploads[fieldName];
        if (file) {
          documentData.append(fieldName, file);
        }
      }

      console.log('Request Data:', {
        clientId: _id,
        documentData: documentData,
      });

      const documentResponse = await axios.post('http://localhost:5000/documents/upload', documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (documentResponse.status === 201) {
        setSuccessMessage('Documents submitted successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
        console.log('Documents sent to the backend:', documentResponse.data);
        // Redirect to client profile page after successful submission
        window.location.href = `/client-portal/profile/${_id}`;
      } else {
        console.error('Error uploading documents:', documentResponse.status);
        alert('Error uploading documents. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Error. Please try again.');
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Upload Proof of:</label>

          <div>
            <label>Driver's License:</label>
            <input
              type="file"
              name="driverLicense"
              ref={fileInputRefs.driverLicense}
              onChange={(e) => handleFileChange('driverLicense', e)}
              required
            />
            {fileUploads.driverLicense && (
              <div>
                <button type="button" onClick={() => handleFileDelete('driverLicense')}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div>
            <label>Proof of Mailing Address:</label>
            <input
              type="file"
              name="proofOfMailingAddress"
              ref={fileInputRefs.proofOfMailingAddress}
              onChange={(e) => handleFileChange('proofOfMailingAddress', e)}
              required
            />
            {fileUploads.proofOfMailingAddress && (
              <div>
                <button type="button" onClick={() => handleFileDelete('proofOfMailingAddress')}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div>
            <label>Social Security Card:</label>
            <input
              type="file"
              name="socialSecurityCard"
              ref={fileInputRefs.socialSecurityCard}
              onChange={(e) => handleFileChange('socialSecurityCard', e)}
              required
            />
            {fileUploads.socialSecurityCard && (
              <div>
                <button type="button" onClick={() => handleFileDelete('socialSecurityCard')}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div>
            <label>Any Other Documents:</label>
            <input
              type="file"
              name="otherDocument"
              ref={fileInputRefs.otherDocument}
              onChange={(e) => handleFileChange('otherDocument', e)}
              required
            />
            {fileUploads.otherDocument && (
              <div>
                <button type="button" onClick={() => handleFileDelete('otherDocument')}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <button type="submit">Submit</button>
        {successMessage && <p>{successMessage}</p>}
        {_id && <p>'id': {_id}</p>}
      </form>
    </div>
  );
};

export default ClientUploadForm;
