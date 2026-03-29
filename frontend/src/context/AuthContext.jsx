import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);       // initial auth check loading
    const [authLoading, setAuthLoading] = useState(false); // Google login in-progress
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);

    // Socket Connection Management
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (user && token && !socketRef.current) {
            const s = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket', 'polling'],
                reconnectionAttempts: 5,
                timeout: 10000,
            });

            socketRef.current = s;
            setSocket(s);

            s.on('connect', () => console.log('✅ WebSocket Connected'));
            s.on('connect_error', (err) => {
                console.error('❌ WebSocket Error:', err.message);
                if (err.message === 'xhr poll error') setOnlineUsers([]);
            });

            s.on('online_users', (uIds) => setOnlineUsers(uIds.map(String)));
            s.on('user_online', (data) => setOnlineUsers(prev => [...new Set([...prev, String(data.userId)])]));
            s.on('user_offline', (data) => setOnlineUsers(prev => prev.filter(id => id !== String(data.userId))));

            return () => {
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
    }, [user]);

    // Restore session on page load
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(res.data.user);
                } catch (error) {
                    console.error('Token invalid or expired, clearing session.');
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    /**
     * loginWithGoogle — posts Google idToken to backend, stores JWT, sets user.
     * Sets authLoading=true during the round-trip so the UI can show a spinner.
     */
    const loginWithGoogle = useCallback(async (idToken) => {
        setAuthLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/google`, { idToken });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return res.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to login with Google';
            console.error('Login error:', message);
            throw new Error(message);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
        }
        localStorage.removeItem('token');
        setUser(null);
        setOnlineUsers([]);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, setUser, loading, authLoading, socket, onlineUsers }}>
            {children}
        </AuthContext.Provider>
    );
};