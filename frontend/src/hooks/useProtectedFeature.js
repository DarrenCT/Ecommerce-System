import { useDevAuth } from '../context/DevAuthContext';

export const useProtectedFeature = () => {
  const { user, isAuthenticated } = useDevAuth();

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      // In development, this will always be true
      console.log('Development mode: Simulating authenticated user');
    }
    return callback();
  };

  return {
    user,
    isAuthenticated,
    requireAuth
  };
}; 