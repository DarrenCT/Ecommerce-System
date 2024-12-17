import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DevAuthContext';

function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12 bg-white p-16 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-5xl font-bold text-gray-900 mb-4">Sign in</h2>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
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
                autoComplete="email"
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
                autoComplete="current-password"
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
              disabled={loading}
              className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-xl font-medium text-black bg-amazon-yellow hover:bg-amazon-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazon-light ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
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
