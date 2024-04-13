import React from 'react';

function DisputeFormSubmission({ clientName, description, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add API calls here to send the form data to the backend
    onSubmit({ clientName, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}

export default DisputeFormSubmission;