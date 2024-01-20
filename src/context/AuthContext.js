import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const token = localStorage.getItem('docuItToken');
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [UserData, setuserdata] = useState(null);
    const [ListFamily, setListFamily] = useState(null);
    const [FamilyMemberData, setFamilyMemberData] = useState(null);
    const [category, setcategory] = useState(null);
    const [sideBarCount, setSideBarCount] = useState(false);


    useEffect(() => {
        const checkSuccessFlags = () => {
            const deleteApiSuccess = localStorage.getItem('deleteApiSuccess') === 'true';
            const uploadApiSuccess = localStorage.getItem('uploadApiSuccess') === 'true';
            const shareApiSuccess = localStorage.getItem('shareApiSuccess') === 'true';
            const moveApiSuccess = localStorage.getItem('moveApiSuccess') === 'true';

            if (deleteApiSuccess || uploadApiSuccess || shareApiSuccess || moveApiSuccess) {
                setSideBarCount(true);
            } else {
                setSideBarCount(false);
            }
        };

        // Call the function on component mount
        checkSuccessFlags();
    }, []);

    const loginSuccess = async () => {
        setIsAuthenticated(true);
    }

    const logoutSuccess = () => {
        setIsAuthenticated(false);
    }

    const value = {
        UserData,
        ListFamily,
        setListFamily,
        category,
        setcategory,
        isAuthenticated,
        loginSuccess,
        logoutSuccess,
        setuserdata,
        FamilyMemberData,
        setFamilyMemberData,
        sideBarCount,
        setSideBarCount,
        countSuccess: () => setSideBarCount(true),
        countUnSuccess: () => setSideBarCount(false)

    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
