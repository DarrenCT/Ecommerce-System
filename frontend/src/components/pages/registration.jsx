import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data to backend:", { name, email, password, phoneNumber, address });
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        password,
        phoneNumber,
        address,
      });
      
      setSuccess(response.data.message);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setAddress('');
      navigate('/sign_in');
    } catch (error) {
      console.error('Registration error details:', error);
      setError(error.response?.data?.message || "An error occurred during registration.");
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12 bg-white p-16 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-5xl font-bold text-gray-900 mb-4">Sign Up</h2>
        </div>
        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xl font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amazon-light focus:border-amazon-light text-xl"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amazon-light focus:border-amazon-light text-xl"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amazon-light focus:border-amazon-light text-xl"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-xl font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amazon-light focus:border-amazon-light text-xl"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-xl font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amazon-light focus:border-amazon-light text-xl"
                rows="4"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-xl font-medium text-black bg-amazon-yellow hover:bg-amazon-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazon-light"
            >
              Register
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-lg text-red-600">{error}</p>}
        {success && <p className="mt-4 text-center text-lg text-green-600">{success}</p>}
        <p className="mt-4 text-center text-lg text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/sign_in')}
            className="font-medium text-amazon-light hover:text-amazon-dark cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;
