import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const token = localStorage.getItem('docuItToken');
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [UserData, setuserdata] = useState(null);
    const [FamilyMemberData, setFamilyMemberData] = useState(null);
    const [category, setcategory] = useState(null);


    const loginSuccess = async () => {
        setIsAuthenticated(true);
    }

    const logoutSuccess = () => {
        setIsAuthenticated(false);
    }

    const value = {
        UserData,
        category,
        setcategory,
        isAuthenticated,
        loginSuccess,
        logoutSuccess,
        setuserdata,
        FamilyMemberData,
        setFamilyMemberData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
