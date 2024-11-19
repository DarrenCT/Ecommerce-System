import React, { useState } from 'react';
import axios from 'axios';
import './registration.css';
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
    <div className="registration-container">
      <div className="registration-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              title="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              title="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              title="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              title="Enter your phone number"
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              title="Enter your address"
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
}

export default RegistrationPage;
