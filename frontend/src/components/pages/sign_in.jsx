import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DevAuthContext';

function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/sign_in', { email, password });
      console.log('Login response:', response.data);
      const userData = response.data.user;
      login(userData);
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.response?.data?.message || 'An error occurred during sign-in.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12 bg-white p-16 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-5xl font-bold text-gray-900 mb-4">Sign in</h2>
        </div>
        <form className="mt-12 space-y-10" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
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
                placeholder="••••••••"
                className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amazon-light focus:border-amazon-light text-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-6 w-6 text-amazon-light focus:ring-amazon-light border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-4 block text-xl text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-xl">
              <span className="font-medium text-amazon-light hover:text-amazon-dark cursor-pointer">
                Lost Password?
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-xl font-medium text-black bg-amazon-yellow hover:bg-amazon-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazon-light"
            >
              Sign in
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-lg text-red-600">{error}</p>}
        {success && <p className="mt-4 text-center text-lg text-green-600">{success}</p>}
        <p className="mt-4 text-center text-lg text-gray-600">
          Not registered?{' '}
          <span
            onClick={() => navigate('/register')}
            className="font-medium text-amazon-light hover:text-amazon-dark cursor-pointer"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
