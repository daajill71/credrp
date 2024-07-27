import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreditReportForm = () => {
  const { _id } = useParams();
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState([]);

  useEffect(() => {
    console.log('Client ID:', _id);
  }, [_id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        console.error('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('creditReport', file);

      const response = await axios.post(`http://localhost:5000/analyze-credit-report/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Analysis Result:', response.data);
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error uploading credit report:', error);
    }
  };

  return (
    <div>
      <h2>Upload Credit Report</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Analyze Credit Report</button>
      
      <h3>Analysis Result</h3>
      {analysisResult.length > 0 ? (
        <ul>
          {analysisResult.map((item, index) => (
            <li key={index}>
              <strong>{item.keyword}</strong>: {item.account && (
                <div>
                  <div>Name: {item.account.name}</div>
                  <div>Number: {item.account.number}</div>
                  <div>Balance: {item.account.balance}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No analysis result available.</p>
      )}
    </div>
  );
};

export default CreditReportForm;
