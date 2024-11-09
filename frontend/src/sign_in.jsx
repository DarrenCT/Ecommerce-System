
import React, { useState } from 'react';
import axios from 'axios';
import './registration.css';

function SignInPage() {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending sign-in data to backend:", { email, password });
    try {
      const response = await axios.post('/login', { email, password });
      setSuccess(response.data.message);
      setError('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during sign-in.");
      setSuccess('');
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Forgot Password Section */}
        <p onClick={() => setShowForgotPassword(!showForgotPassword)} style={{ color: '#5062ff', cursor: 'pointer', marginTop: '10px' }}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
}

export default SignInPage;