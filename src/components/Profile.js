// Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  
  useEffect(() => {
    // Fetch the user's profile data when the component mounts
    axios.get('/api/profile')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleEditClick = () => {
    setEditing(true);
    // Copy the user's data to the updatedUser state for editing
    setUpdatedUser({ ...user });
  };

  const handleSaveClick = () => {
    // Send a PUT request to update the user's profile
    axios.put('/api/profile', updatedUser)
      .then((response) => {
        setUser(response.data);
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating user profile:', error);
      });
  };

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        {editing ? (
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={updatedUser.firstName}
              onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={updatedUser.lastName}
              onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
            />
            {/* Add other editable fields here */}
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <div>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            {/* Display other user information here */}
            <button onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
