import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const SOCKET_URL = API_URL.replace('/api', '');

    // Socket Connection Management
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (user && token && !socketRef.current) {
            console.log('🔌 Connecting to WebSocket at:', SOCKET_URL);
            const s = io(SOCKET_URL, { 
                auth: { token }, 
                transports: ['websocket', 'polling'],
                reconnectionAttempts: 5,
                timeout: 10000
            });
            
            socketRef.current = s;
            setSocket(s);

            s.on('connect', () => console.log('✅ WebSocket Connected'));
            s.on('connect_error', (err) => {
                console.error('❌ WebSocket Connection Error:', err.message);
                if (err.message === 'xhr poll error') {
                    // This happens if the backend doesn't support websockets or is down
                    setOnlineUsers([]);
                }
            });

            s.on('online_users', (uIds) => setOnlineUsers(uIds.map(String)));
            s.on('user_online', (data) => setOnlineUsers(prev => [...new Set([...prev, String(data.userId)])]));
            s.on('user_offline', (data) => setOnlineUsers(prev => prev.filter(id => id !== String(data.userId))));

            return () => {
                console.log('🔌 Disconnecting WebSocket');
                s.disconnect();
                socketRef.current = null;
                setSocket(null);
                setOnlineUsers([]);
            };
        } else if (!user && socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setOnlineUsers([]);
        }
    }, [user, SOCKET_URL]); // Stable URL and User dependency

    // Check if token exists on load
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const res = await axios.get(`${apiUrl}/auth/profile`, {
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
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${apiUrl}/auth/google`, {
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