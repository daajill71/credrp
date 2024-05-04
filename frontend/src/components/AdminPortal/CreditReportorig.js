// Importing necessary modules
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importing useParams

// Define CreditReportForm component
const CreditReportForm = () => {
  const { _id } = useParams(); // Getting the _id from the URL
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState([]);

  // Function to handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle file upload and analysis
  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('creditReport', file);

      // Sending POST request to analyze the credit report
      const response = await axios.post(`http://localhost:5000/analyze-credit-report/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Updating analysisResult state with the response data
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error uploading credit report:', error);
    }
  };

  // Render CreditReportForm component
  return (
    <div>
      <h2>Upload Credit Report</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Analyze Credit Report</button>
      
      <h3>Analysis Result</h3>
      <ul>
        {/* Mapping over analysisResult and rendering list items */}
        {analysisResult.map((account, index) => (
          <li key={index}>
            {account.account}: {account.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Exporting CreditReportForm component
export default CreditReportForm;
