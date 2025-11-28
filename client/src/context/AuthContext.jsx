import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Here you would typically have an endpoint to verify the token and get user data
            // For this project, we'll decode it (this is insecure for production)
            // or just assume the presence of a token means logged in.
            // Let's store the username from local storage for simplicity.
            const username = localStorage.getItem('username');
            setUser({ token, username });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('username', userData.username);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setUser(null);
    };

    const authContextValue = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
