import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/DevAuthContext';
import CreditCardModal from './creditCard';

const MyAccount = () => {
  const { user, isAuthenticated } = useAuth(); // Access authenticated user and auth state
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    password: '',
  });
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);

  // Redirect immediately if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign_in'); // Navigate to sign-in if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // Fetch user data only if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      console.log('Fetching data for userId:', user.userId);

      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/user/${user.userId}`);
          console.log('Fetched user data:', response.data);

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
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password;
      }

      const response = await axios.put(`http://localhost:5000/user/${user.userId}`, updatedData);
      console.log('Updated user data:', response.data);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user data:', err);
      alert('Failed to update profile.');
    }
  };

  const handleSaveCreditCard = async (creditCardData) => {
    try {
      const response = await axios.post(`http://localhost:5000/user/${user.userId}/credit-card`, creditCardData);
      console.log('Credit card added:', response.data);
      alert('Credit card added successfully!');
    } catch (err) {
      console.error('Error adding credit card:', err);
      alert('Failed to add credit card.');
    }
  };

  // Safeguard against `null` user object
  if (!user) {
    return null; // Render nothing while redirecting or if user data is unavailable
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {formData.phoneNumber || 'Not provided'}</p>
          <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-4"
            onClick={() => setIsCreditCardModalOpen(true)} // Open the credit card modal
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
              placeholder="Leave blank to keep the current password"
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

      {/* Credit Card Modal */}
      <CreditCardModal
        isOpen={isCreditCardModalOpen}
        onClose={() => setIsCreditCardModalOpen(false)}
        onSave={handleSaveCreditCard}
      />
    </div>
  );
};

export default MyAccount;
