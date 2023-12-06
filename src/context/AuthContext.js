import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const token = localStorage.getItem('docuItToken')
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const loginSuccess = async () => {
        setIsAuthenticated(true);
    }

    const logoutSuccess = () => {
        setIsAuthenticated(false);
    }

    const value = {
        isAuthenticated,
        loginSuccess,
        logoutSuccess
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
