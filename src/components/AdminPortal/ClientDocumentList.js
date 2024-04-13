import React from 'react';

const ClientDocumentList = ({ documents, onRemoveDocument }) => {
  return (
    <div>
      <h2>Uploaded Documents</h2>
      <ul>
        {documents.map((document, index) => (
          <li key={index}>
            {document.name} {/* Display the document name or other identifier */}
            <button onClick={() => onRemoveDocument(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientDocumentList;
