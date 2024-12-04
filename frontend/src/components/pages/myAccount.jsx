import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/DevAuthContext';
import CreditCardModal from './creditCard';

const MyAccount = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    password: '',
  });
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);

  // Redirect immediately if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign_in');
    }
  }, [isAuthenticated, navigate]);

  // Helper function to get the value from a multilingual field
  const getMultilingualValue = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (Array.isArray(field)) {
      const defaultLang = field.find(f => f.language_tag === 'en') || field[0];
      return defaultLang?.value || '';
    }
    return field.value || '';
  };

  // Fetch user data and orders only if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const [userResponse, ordersResponse] = await Promise.all([
            axios.get(`http://localhost:5000/user/${user.userId}`),
            axios.get(`http://localhost:5000/api/orders/history?customerId=${user.userId}`)
          ]);

          setFormData({
            address: userResponse.data.address || '',
            phoneNumber: userResponse.data.phoneNumber || '',
            password: '',
          });

          setOrders(ordersResponse.data);
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch user data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Profile Information Section */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          {!isEditing && (
            <div className="space-x-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                onClick={() => setIsCreditCardModalOpen(true)}
              >
                Manage Payment Methods
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b md:border-b-0 pb-4 md:pb-0">
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{getMultilingualValue(user.name)}</p>
            </div>
            <div className="border-b md:border-b-0 pb-4 md:pb-0">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="border-b md:border-b-0 pb-4 md:pb-0">
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{formData.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{formData.address || 'Not provided'}</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order History Section */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {getMultilingualValue(item.product.item_name)} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit Card Modal */}
      {isCreditCardModalOpen && (
        <CreditCardModal
          onClose={() => setIsCreditCardModalOpen(false)}
          onSave={handleSaveCreditCard}
        />
      )}
    </div>
  );
};

export default MyAccount;
