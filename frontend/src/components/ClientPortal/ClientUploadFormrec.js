import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ClientUploadForm = () => {
  // Step 1: Get the 'id' parameter from the URL
  const { id } = useParams();
  console.log('ID from URL:', id);

  // Step 2: Set up state for success message
  const [successMessage, setSuccessMessage] = useState(null);

  // Step 3: Create refs for file input elements
  const fileInputRefs = {
    driverLicense: useRef(null),
    mailingAddressProof: useRef(null),
    socialSecurityCard: useRef(null),
    otherDocument: useRef(null),
  };

  // Step 4: Log the fileInputRefs
  console.log('fileInputRefs:', fileInputRefs);

  // Step 5: Set up state to track selected files
  const [fileUploads, setFileUploads] = useState({
    driverLicense: null,
    mailingAddressProof: null,
    socialSecurityCard: null,
    otherDocument: null,
  });

  // Step 6: Function to handle file selection and update 'fileUploads' state
  const handleFileChange = (fieldName, e) => {
    const file = e.target.files[0];
    // Step 7: Log the selected file and file name
    console.log('Selected File:', file);
    console.log('File Name:', fieldName);
    setFileUploads((prevFileUploads) => ({
      ...prevFileUploads,
      [fieldName]: file,
    }));
  };

  // Step 8: Function to clear file selection for a specific document type
  const handleFileDelete = (fieldName) => {
    setFileUploads((prevFileUploads) => ({
      ...prevFileUploads,
      [fieldName]: null,
    }));
  };

  // Step 9: Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 10: Display an error message if 'id' is missing
    if (!id) {
      alert('Client ID is missing.');
      return;
    }

    try {
      // Step 11: Create FormData to append selected files
      const documentData = new FormData();

      for (const fieldName in fileUploads) {
        const file = fileUploads[fieldName];
        if (file) {
          documentData.append(fieldName, file);
        }
      }

      // Step 12: Log the request data before sending
      console.log('Request Data:', {
        clientId: id,
        documentData: documentData,
      });

      // Step 13: Pass the client's ID to the server
      documentData.append('clientId', id);

      // Step 14: Log the client ID being passed to the server
      console.log('Client ID sent to the server:', id);

      // Step 15: Send a POST request to the server with the documentData
      const documentResponse = await axios.post('http://localhost:5000/documents/upload', documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Step 16: Handle the server response
      if (documentResponse.status === 201) {
        setSuccessMessage('Documents submitted successfully');
        setTimeout(() => setSuccessMessage(null), 5000);

        // Step 17: Log documents sent to the backend
        console.log('Documents sent to the backend:', documentResponse.data);
      } else {
        console.error('Error uploading documents:', documentResponse.status);
        alert('Error uploading documents. Please try again.');
      }
    } catch (error) {
      // Step 18: Handle network errors
      console.error('Network error:', error);
      alert('Error. Please try again.');
    }
  };

  // Step 19: Set up an effect to clear the success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Step 20: Render the file upload form using JSX
  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Upload Proof of:</label>

          <div>
            <label>Driver's License:</label>
            {/* Step 21: Set up file input for Driver's License */}
            <input
              type="file"
              name="driverLicense"
              ref={fileInputRefs.driverLicense}
              onChange={(e) => handleFileChange('driverLicense', e)}
              required
            />
            {/* Step 22: Display delete button if a file is selected */}
            {fileUploads.driverLicense && (
              <div>
                <button type="button" onClick={() => handleFileDelete('driverLicense')}>
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Step 23: Repeat the code for other file inputs */}
          <div>
            <label>Proof of Mailing Address:</label>
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

        {/* Step 24: Submit button */}
        <button type="submit">Submit</button>
        {/* Step 25: Display success message */}
        {successMessage && <p>{successMessage}</p>}
        {/* Step 26: Display URL Parameter 'id' if present */}
        {id && <p>URL Parameter 'id': {id}</p>}
      </form>
    </div>
  );
};

export default ClientUploadForm;
