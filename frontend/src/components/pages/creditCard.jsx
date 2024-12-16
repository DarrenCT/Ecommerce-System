import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/DevAuthContext';

const CreditCard = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [creditCards, setCreditCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchCreditCards();
    }
  }, [isOpen, user]);

  const fetchCreditCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/user/${user.userId}`);
      setCreditCards(response.data.creditCards || []);
    } catch (err) {
      setError('Failed to fetch credit cards');
      console.error('Error fetching credit cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCard = async () => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/user/${user.userId}/credit-card`, newCard);
      await fetchCreditCards();
      setIsAddingCard(false);
      setNewCard({ cardNumber: '', expiryDate: '', cvv: '' });
    } catch (err) {
      setError('Failed to add credit card');
      console.error('Error adding credit card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/user/${user.userId}/credit-card/${cardId}`);
      await fetchCreditCards();
    } catch (err) {
      setError('Failed to delete credit card');
      console.error('Error deleting credit card:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              {/* Existing Cards */}
              {creditCards.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Cards</h3>
                  <div className="space-y-4">
                    {creditCards.map((card, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">•••• •••• •••• {card.cardNumber.slice(-4)}</p>
                          <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCard(card.cardId)}
                          className="text-red-600 hover:text-red-700 focus:outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Card */}
              {!isAddingCard ? (
                <button
                  onClick={() => setIsAddingCard(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add New Card
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Card</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={newCard.cardNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={newCard.expiryDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={newCard.cvv}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleAddCard}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Card
                      </button>
                      <button
                        onClick={() => setIsAddingCard(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
