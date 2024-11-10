import { createContext, useContext, useState } from 'react';

const DevAuthContext = createContext();

export const DevAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = () => {
        setUser({
            id: 'dev-user-1',
            name: 'Development User',
            email: 'dev@example.com'
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <DevAuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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