import React, { useState } from 'react';

function DisputeForm() {
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add API calls here to send the form data to the backend
    console.log('Submitting dispute:', { clientName, description });
  };

  return (
    <div>
      <h2>Submit a Dispute</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default DisputeForm;
