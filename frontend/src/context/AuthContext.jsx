import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if token exists on load
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data.user);
                } catch (error) {
                    console.error("Token invalid", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const loginWithGoogle = async (idToken) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
                idToken,
            });

            console.log('Login successful:', res.data);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data; // Pass the entire response back so `isNewUser` can be read
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Failed to login with Google');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
