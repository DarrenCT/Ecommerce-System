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
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // Set token in axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Verify token with backend
                const response = await axios.get('http://localhost:5000/api/auth/verify');
                setUser(response.data.user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token verification failed:', error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5000/sign_in', credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during login'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
            const { token, user } = response.data;
            
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred during signup'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (updates) => {
        try {
            const response = await axios.patch('http://localhost:5000/api/auth/profile', updates, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An error occurred while updating profile'
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
