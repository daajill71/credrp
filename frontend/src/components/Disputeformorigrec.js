import React, { useState } from 'react';
function DisputeForm() {
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState(''); // State for submission message

  const handleSubmission = () => {
    // You can make API calls here to send the form data to the backend
    console.log('Submitting dispute:', { clientName, description });

    // Add your API call logic here to send data to the backend
    // For example, you can use fetch or axios to make the API call.
    // Make sure to include error handling and sending data to the server.
    // Then, you can clear the form input fields and show a submission message.
    // After successfully submitting, clear the form input fields

    // Simulate a successful submission message
    setSubmissionMessage('Dispute submitted successfully.');

    setClientName('');
    setDescription('');

    // Hide the submission message after a delay (e.g., 3 seconds)
    setTimeout(() => {
      setSubmissionMessage('');
    }, 3000); // 3000 milliseconds (3 seconds)
  };

  return (
    <div>
      <h2>Submit a Dispute</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmission(); }}>
        <div>
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
}

export default DisputeForm;