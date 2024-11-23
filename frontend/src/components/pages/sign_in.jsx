import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DevAuthContext'; // Import the authentication context
import './sign_in.css';

function SignInPage() {
  const { login } = useAuth(); // Access the login function from context
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Send login data to the backend
        const response = await axios.post('http://localhost:5000/sign_in', { email, password });

        console.log('Login response:', response.data); // Debugging
        const userData = response.data.user; // Ensure `userId` is included
        login(userData); // Pass the full user data to the context

        // Navigate to the home page
        navigate('/');
    } catch (error) {
        console.error('Error during login:', error);
        setError(error.response?.data?.message || 'An error occurred during sign-in.');
    }
};


  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label>Your password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="checkbox-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot-password">Lost Password?</span>
          </div>
          <button type="submit">Login to your account</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <p className="create-account">
  Not registered?{' '}
  <span
    style={{ color: 'blue', cursor: 'pointer' }}
    onClick={() => navigate('/register')}
  >
    Create account
  </span>
</p>

      </div>
    </div>
  );
}

export default SignInPage;
