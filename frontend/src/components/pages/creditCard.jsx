import React from 'react';

const CreditCard = ({ isOpen, onClose, onSave }) => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    
    onSave({ cardNumber, expiryDate, cvv });
    onClose(); // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Add Credit Card</h2>
        <div className="mb-4">
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Expiry Date</label>
          <input
            type="text"
            value={expiryDate}
            placeholder="MM/YY"
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreditCard;
