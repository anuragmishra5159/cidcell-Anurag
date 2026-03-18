import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const SOCKET_URL = import.meta.env.VITE_API_URL.replace('/api', '');

    // Socket Connection Management
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (user && token) {
            const s = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'] });
            setSocket(s);

            s.on('online_users', (uIds) => setOnlineUsers(uIds.map(String)));
            s.on('user_online', (data) => setOnlineUsers(prev => [...new Set([...prev, String(data.userId)])]));
            s.on('user_offline', (data) => setOnlineUsers(prev => prev.filter(id => id !== String(data.userId))));

            return () => {
                s.disconnect();
                setSocket(null);
                setOnlineUsers([]);
            };
        } else if (!user) {
            setSocket(null);
            setOnlineUsers([]);
        }
    }, [user]); // Removed 'socket' dependency to prevent infinite loop

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
            return res.data; 
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Failed to login with Google');
        }
    };

    const logout = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        localStorage.removeItem('token');
        setUser(null);
        setOnlineUsers([]);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, setUser, loading, socket, onlineUsers }}>
            {children}
        </AuthContext.Provider>
    );
};
