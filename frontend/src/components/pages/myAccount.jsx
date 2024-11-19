import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAccount = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    password: '',
  });

  // Replace with actual userId (e.g., from auth context or route params)
  const userId = 'dev-user-1';

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUser(response.data);
        setFormData({
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || '',
          password: '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/user/${userId}`, formData);
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user data:', err);
      alert('Failed to update profile.');
    }
  };

  const handleAddCard = () => {
    alert('Redirecting to add credit card...');
    // Implement your credit card addition logic here
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber || 'Not provided'}</p>
          <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-4"
            onClick={handleAddCard}
          >
            Add Credit Card
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-4"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
