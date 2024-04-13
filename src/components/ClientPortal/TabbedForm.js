// TabbedForm.js
import React, { useState } from 'react';
import ClientInfoForm from './ClientInfoForm';
import ClientUploadForm from './ClientUploadForm';

function TabbedForm() {
  const [activeTab, setActiveTab] = useState('clientInfo');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleTabChange('clientInfo')}>Client Information</button>
        <button onClick={() => handleTabChange('clientUpload')}>Client Upload</button>
      </div>
      {activeTab === 'clientInfo' && <ClientInfoForm />}
      {activeTab === 'clientUpload' && <ClientUploadForm />}
    </div>
  );
}

export default TabbedForm;
