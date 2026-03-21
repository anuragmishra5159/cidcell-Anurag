import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../../components/ChatInterface';

const MentorChat = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [socket, setSocket] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const chatContainerRef = useRef(null);

    const scrollToBottom = (smooth = false) => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
            }
        }, 50);
    };
    
    const navigate = useNavigate();
    
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!token) return;
        const newSocket = io(API_URL.replace('/api', ''), { auth: { token } });
        setSocket(newSocket);

        newSocket.on('receive_doubt_message', (message) => {
            setMessages(prev => [...prev, message]);
            setSessions(prev => prev.map(s => 
                s._id === message.sessionId 
                    ? { ...s, lastMessage: message.content, updatedAt: message.timestamp } 
                    : s
            ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            
            scrollToBottom(true);
        });

        return () => newSocket.close();
    }, [API_URL, token]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get(`${API_URL}/doubts/sessions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSessions(res.data);
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            }
        };
        fetchSessions();
    }, [API_URL, token]);

    const fetchMessages = async (pageToLoad = 1) => {
        if (!activeSession) return;
        try {
            const res = await axios.get(`${API_URL}/doubts/sessions/${activeSession._id}/messages?page=${pageToLoad}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data.length < 20) setHasMore(false);
            else setHasMore(true);

            if (pageToLoad === 1) {
                setMessages(res.data);
                scrollToBottom(false);
            } else {
                setMessages(prev => [...res.data, ...prev]);
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    useEffect(() => {
        if (!activeSession) return;
        setPage(1);
        setHasMore(true);
        fetchMessages(1);

        if (socket) socket.emit('join_doubt_session', { sessionId: activeSession._id });
        return () => {
            if (socket) socket.emit('leave_doubt_session', { sessionId: activeSession._id });
        };
    }, [activeSession, socket]); // eslint-disable-line

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeSession) return;

        try {
            const res = await axios.post(`${API_URL}/doubts/sessions/${activeSession._id}/messages`, {
                content: newMessage,
                senderType: 'mentor'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const savedMessage = res.data;
            setMessages(prev => [...prev, savedMessage]);
            setNewMessage('');
            
            setSessions(prev => prev.map(s => 
                s._id === activeSession._id 
                    ? { ...s, lastMessage: savedMessage.content, updatedAt: savedMessage.timestamp } 
                    : s
            ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            
            scrollToBottom(true);

            if (socket) {
                socket.emit('send_doubt_message', {
                    sessionId: activeSession._id,
                    message: savedMessage
                });
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <ChatInterface 
            userType="mentor"
            user={user}
            sessions={sessions}
            activeSession={activeSession}
            setActiveSession={setActiveSession}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            chatContainerRef={chatContainerRef}
            onBack={() => navigate('/mentor/dashboard')}
            onLoadMore={loadMore}
            hasMore={hasMore}
        />
    );
};

export default MentorChat;
