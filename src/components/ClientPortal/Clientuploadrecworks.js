import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ClientUploadForm = () => {
  const { id } = useParams(); // Add this line to get the 'id' parameter

  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRefs = {
    driverLicense: useRef(null),
    mailingAddressProof: useRef(null),
    socialSecurityCard: useRef(null),
    otherDocument: useRef(null),
  };
  const [fileUploads, setFileUploads] = useState({
    driverLicense: null,
    mailingAddressProof: null,
    socialSecurityCard: null,
    otherDocument: null,
  });

  const handleFileChange = (fieldName, e) => {
    const file = e.target.files[0];
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

    try {
      const documentData = new FormData();

      for (const fieldName in fileUploads) {
        const file = fileUploads[fieldName];
        if (file) {
          documentData.append(fieldName, file);
        }
      }

      const documentResponse = await axios.post('http://localhost:5000/documents/upload', documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (documentResponse.status === 201) {
        setSuccessMessage('Documents submitted successfully');
        setTimeout(() => setSuccessMessage(null), 5000);
        console.log('Documents uploaded successfully:', documentResponse.data);
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
            <label>Proof of mailing address:</label>
            <input
              type="file"
              name="mailingAddressProof"
              ref={fileInputRefs.mailingAddressProof}
              onChange={(e) => handleFileChange('mailingAddressProof', e)}
              required
            />
            {fileUploads.mailingAddressProof && (
              <div>
                <button type="button" onClick={() => handleFileDelete('mailingAddressProof')}>
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
            <label>Any other documents:</label>
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
        {id && <p>URL Parameter 'id': {id}</p>}
      </form>
    </div>
  );
};

export default ClientUploadForm;
