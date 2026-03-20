import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Send, Search, Users, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentorChat = () => {
    const { user, token } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    
    const API_URL = import.meta.env.VITE_API_URL;

    // Initialize socket connection
    useEffect(() => {
        if (!token) return;
        
        const newSocket = io(API_URL.replace('/api', ''), {
            auth: { token }
        });
        
        setSocket(newSocket);

        newSocket.on('receive_doubt_message', (message) => {
            setMessages(prev => [...prev, message]);
            // Update the lastMessage in the sessions list
            setSessions(prev => prev.map(s => 
                s._id === message.sessionId 
                    ? { ...s, lastMessage: message.content, updatedAt: message.timestamp } 
                    : s
            ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        });

        return () => newSocket.close();
    }, [API_URL, token]);

    // Fetch sessions
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

    // Fetch messages when a session is selected
    useEffect(() => {
        if (!activeSession) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${API_URL}/doubts/sessions/${activeSession._id}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchMessages();

        if (socket) {
            socket.emit('join_doubt_session', { sessionId: activeSession._id });
        }

        return () => {
            if (socket) {
                socket.emit('leave_doubt_session', { sessionId: activeSession._id });
            }
        };
    }, [activeSession, API_URL, token, socket]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            
            // Update session list and sort
            setSessions(prev => prev.map(s => 
                s._id === activeSession._id 
                    ? { ...s, lastMessage: savedMessage.content, updatedAt: savedMessage.timestamp } 
                    : s
            ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));

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

    const filteredSessions = sessions.filter(s => {
        const studentName = s.studentId?.username || '';
        return studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
               s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-bg min-h-screen pt-28 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Mobile back button & Profile banner */}
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => navigate('/mentor/dashboard')} 
                        className="p-3 bg-white border-3 border-primary shadow-neo-sm rounded-xl hover:-translate-x-1 hover:shadow-none transition-all"
                    >
                        <ArrowLeft size={20} className="text-primary" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-tight line-clamp-1">
                        Peer Learning Chat
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-200px)] min-h-[600px]">
                    
                    {/* Left Panel: Session List */}
                    <div className={`lg:col-span-4 bg-white border-4 border-primary rounded-neo shadow-neo flex flex-col overflow-hidden ${activeSession ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="p-4 border-b-4 border-primary bg-highlight-yellow/20">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search student or domain..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border-3 border-primary p-3 pl-10 text-xs md:text-sm font-bold shadow-neo-sm focus:outline-none focus:ring-0 focus:border-primary placeholder-gray-400"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto bg-white">
                            {filteredSessions.length === 0 ? (
                                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                                    <Users className="w-12 h-12 text-primary/20 mb-4" />
                                    <p className="text-[10px] font-black uppercase text-primary/40 leading-loose">No active sessions found.</p>
                                </div>
                            ) : (
                                filteredSessions.map(session => (
                                    <div 
                                        key={session._id} 
                                        onClick={() => setActiveSession(session)}
                                        className={`p-4 border-b-2 border-primary/10 cursor-pointer transition-colors ${activeSession?._id === session._id ? 'bg-highlight-yellow border-l-8 border-l-primary' : 'hover:bg-highlight-blue/10 border-l-8 border-l-transparent'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={session.studentId?.profilePicture || `https://ui-avatars.com/api/?name=${session.studentId?.username}&background=random`} 
                                                className="w-12 h-12 rounded-2xl border-3 border-primary shadow-neo-sm object-cover bg-white"
                                                alt="avatar"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-black text-primary truncate text-sm">{session.studentId?.username || 'Unknown Student'}</h3>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="bg-highlight-teal text-primary border-2 border-primary px-2 py-0.5 font-black uppercase text-[8px] shadow-neo-sm truncate">
                                                        {session.domain}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-gray-500 truncate mt-2">
                                                    {session.lastMessage || 'No messages yet...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Active Chat Window */}
                    <div className={`lg:col-span-8 bg-white border-4 border-primary rounded-neo shadow-neo flex flex-col overflow-hidden ${!activeSession ? 'hidden lg:flex' : 'flex'}`}>
                        {!activeSession ? (
                            <div className="flex-1 bg-bg flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-primary/20 m-4 rounded-2xl">
                                <MessageSquare className="w-16 h-16 text-primary/20 mb-6" />
                                <h2 className="text-xl font-black uppercase text-primary/40 tracking-tight">Select a conversation</h2>
                                <p className="text-xs font-bold text-primary/40 mt-2">Choose a student from the list to start guiding them.</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b-4 border-primary bg-white flex items-center justify-between shrink-0 h-20">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setActiveSession(null)}
                                            className="lg:hidden p-2 bg-bg border-2 border-primary rounded-xl shadow-neo-sm"
                                        >
                                            <ArrowLeft size={16} />
                                        </button>
                                        <img 
                                            src={activeSession.studentId?.profilePicture || `https://ui-avatars.com/api/?name=${activeSession.studentId?.username}&background=random`} 
                                            className="w-10 h-10 rounded-xl border-2 border-primary shadow-neo-sm"
                                            alt="avatar"
                                        />
                                        <div>
                                            <h3 className="font-black text-primary uppercase text-sm md:text-base leading-none tracking-tight">
                                                {activeSession.studentId?.username}
                                            </h3>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mt-1">
                                                Active Session
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="bg-bg border-2 border-primary/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-primary/60 shadow-neo-mini">
                                            Domain: {activeSession.domain}
                                        </span>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 bg-bg overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
                                    {messages.map((msg, i) => {
                                        const isSelf = msg.senderId === user._id;
                                        return (
                                            <div key={i} className={`flex w-full ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`
                                                    max-w-[85%] md:max-w-[70%] border-3 border-primary p-3 md:p-4 shadow-neo-sm
                                                    ${isSelf 
                                                        ? 'bg-highlight-yellow rounded-2xl rounded-br-none ml-auto' 
                                                        : 'bg-white rounded-2xl rounded-tl-none mr-auto'}
                                                `}>
                                                    <p className="text-sm md:text-base font-bold text-primary leading-relaxed whitespace-pre-wrap word-break">
                                                        {msg.content}
                                                    </p>
                                                    <div className={`mt-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${isSelf ? 'justify-end text-primary/60' : 'justify-start text-primary/40'}`}>
                                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t-4 border-primary bg-white shrink-0">
                                    <form onSubmit={handleSendMessage} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message here..."
                                            className="flex-1 bg-bg border-3 border-primary p-3 md:p-4 rounded-xl text-xs md:text-sm font-bold shadow-neo-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="bg-primary text-white border-3 border-primary px-6 rounded-xl flex items-center justify-center hover:bg-primary/90 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-neo transition-all disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-neo"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MentorChat;
