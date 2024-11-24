import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DevAuthContext = createContext();

export const DevAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const auth = localStorage.getItem('auth');
        if (auth) {
            try {
                const { token, user } = JSON.parse(auth);
                // Set token in axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Verify token with backend
                const response = await axios.get('/api/auth/verify');
                setUser(user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token verification failed:', error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/sign_in', { email, password });
            const { token, user } = response.data;
            
            // Set token in axios headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            localStorage.setItem('auth', JSON.stringify({ token, user }));
            setUser(user);
            setIsAuthenticated(true);
            
            // Associate cart with user if it exists
            const cartId = localStorage.getItem('cartId');
            if (cartId) {
                try {
                    await cartService.associateWithUser(user.userId, cartId);
                } catch (error) {
                    console.error('Error associating cart with user:', error);
                }
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post('/api/signup', userData);
            const { token, user } = response.data;
            
            // Set token in axios headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            localStorage.setItem('auth', JSON.stringify({ token, user }));
            setUser(user);
            setIsAuthenticated(true);
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during signup'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (updates) => {
        try {
            const auth = JSON.parse(localStorage.getItem('auth') || '{}');
            const response = await axios.patch('/api/auth/profile', updates, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update profile'
            };
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DevAuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            login, 
            logout,
            signup,
            updateProfile,
            loading 
        }}>
            {children}
        </DevAuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(DevAuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a DevAuthProvider');
    }
    return context;
};
