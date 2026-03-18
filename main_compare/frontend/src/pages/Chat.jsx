import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Send, 
  Search, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  Clock,
  User as UserIcon,
  MessageSquare,
  ArrowLeft,
  Users,
  Paperclip
} from 'lucide-react';

const Chat = () => {
    const { user, socket, onlineUsers } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('recent'); // 'recent', 'online', 'search'
    const [users, setUsers] = useState([]); 
    const [recentChats, setRecentChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMode, setMobileMode] = useState('list'); // 'list' or 'chat'
    
    const messagesContainerRef = useRef(null);
    const selectedUserRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const scrollToBottom = (instant = false) => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: instant ? 'auto' : 'smooth'
            });
        }
    };

    // Chat-specific socket listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (msg) => {
            const currentPartnerId = selectedUserRef.current?._id || selectedUserRef.current?.id;
            const msgSenderId = String(msg.senderId);
            const msgReceiverId = String(msg.receiverId);
            const currentUserId = String(user?.id || user?._id);

            if (String(currentPartnerId) === msgSenderId || (String(currentPartnerId) === msgReceiverId && msgSenderId === currentUserId)) {
                setMessages(prev => (prev.find(m => m._id === msg._id) ? prev : [...prev, msg]));
                setTimeout(() => scrollToBottom(), 50);
            }
            fetchRecentChats();
        });

        socket.on('user_typing', (data) => {
            if (String(data.userId) === String(selectedUserRef.current?._id || selectedUserRef.current?.id)) {
                setOtherUserTyping(true);
                setTimeout(() => scrollToBottom(), 50);
            }
        });

        socket.on('user_stop_typing', (data) => {
            if (String(data.userId) === String(selectedUserRef.current?._id || selectedUserRef.current?.id)) {
                setOtherUserTyping(false);
            }
        });

        socket.on('message_updated', (updatedMsg) => {
            setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
        });

        socket.on('message_deleted', (data) => {
            setMessages(prev => prev.map(m => m._id === data.messageId ? { ...m, isDeleted: true, text: 'This message was deleted' } : m));
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_typing');
            socket.off('user_stop_typing');
            socket.off('message_updated');
            socket.off('message_deleted');
        };
    }, [socket, user]);

    const fetchRecentChats = async () => {
        try {
            const res = await axios.get(`${API_URL}/messages/recent`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRecentChats(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const currentId = user?.id || user?._id;
            setUsers(res.data.filter(u => String(u._id) !== String(currentId)));
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (user) {
            fetchRecentChats();
            fetchAllUsers();
        }
    }, [user]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            const targetId = selectedUser._id || selectedUser.id;
            try {
                const res = await axios.get(`${API_URL}/messages/${targetId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMessages(res.data);
                setOtherUserTyping(false);
                setTimeout(() => scrollToBottom(true), 50);
            } catch (err) { console.error(err); }
        };
        fetchMessages();
    }, [selectedUser]);

    const selectConversation = (u) => {
        setSelectedUser(u);
        setMobileMode('chat');
    };

    const handleSendMessage = (e) => {
        e?.preventDefault();
        const text = newMessage.trim();
        if (!text || !selectedUser || !socket) return;
        const targetId = selectedUser._id || selectedUser.id;

        if (editingMessage) {
            socket.emit('edit_message', { messageId: editingMessage._id, newText: text }, (res) => {
                if(res?.success) {
                    setEditingMessage(null);
                    setNewMessage('');
                    setTimeout(() => scrollToBottom(), 50);
                }
            });
        } else {
            socket.emit('send_message', { receiverId: targetId, text }, (res) => {
                if (res?.success) {
                    setNewMessage('');
                    socket.emit('stop_typing', { receiverId: targetId });
                    setTimeout(() => scrollToBottom(), 50);
                }
            });
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!selectedUser || editingMessage || !socket) return;
        const targetId = selectedUser._id || selectedUser.id;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { receiverId: targetId });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('stop_typing', { receiverId: targetId });
        }, 2000);
    };

    const listToDisplay = (() => {
        if(activeTab === 'recent') return recentChats;
        if(activeTab === 'online') return users.filter(u => onlineUsers.includes(String(u._id)));
        return users.filter(u => u.username?.toLowerCase().includes(searchTerm.toLowerCase()));
    })();

    return (
        <div className="h-screen bg-bg pt-20 md:pt-32 flex flex-col overflow-hidden px-0 md:px-6 md:pb-6 font-body">
            <div className="flex-1 max-w-7xl mx-auto w-full flex bg-white border-b md:border-3 border-primary md:shadow-neo md:rounded-neo overflow-hidden">
                
                {/* SIDEBAR */}
                <div className={`${mobileMode === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r-3 border-primary bg-bg/20`}>
                    <div className="p-5 border-b-3 border-primary flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-black uppercase tracking-normal">Messages</h1>
                            <div className="w-10 h-10 bg-highlight-yellow border-2 border-primary shadow-neo-sm flex items-center justify-center rounded-xl">
                                <MessageSquare size={18} />
                            </div>
                        </div>

                        <div className="flex bg-primary/5 p-1 rounded-2xl">
                            {['recent', 'online', 'search'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        activeTab === tab ? 'bg-primary text-white shadow-neo-sm' : 'text-primary/60 hover:text-primary'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={16} />
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-highlight-yellow/40 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-bg/10">
                        {listToDisplay.map(u => {
                            const uId = String(u._id || u.id);
                            const isSelected = String(selectedUser?._id || selectedUser?.id) === uId;
                            return (
                                <button
                                    key={uId}
                                    onClick={() => selectConversation(u)}
                                    className={`w-full flex items-center gap-4 p-5 transition-all text-left border-2 rounded-2xl group ${
                                        isSelected ? 'bg-highlight-yellow border-primary shadow-neo-sm' : 'bg-white border-transparent hover:border-primary/20'
                                    }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`w-12 h-12 rounded-xl border-2 border-primary overflow-hidden flex items-center justify-center bg-white shadow-neo-sm`}>
                                            {u.profilePicture ? <img src={u.profilePicture} className="w-full h-full object-cover" alt="" /> : <UserIcon size={20} className="text-primary" />}
                                        </div>
                                        {onlineUsers.includes(uId) && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-primary rounded-full" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-xs font-black uppercase tracking-normal truncate">{u.username}</h3>
                                            {onlineUsers.includes(uId) && (
                                                <span className="shrink-0 bg-green-500 text-white border border-primary px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter shadow-neo-mini">Online</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold truncate text-primary/40 uppercase tracking-normal mt-1">
                                            {u.lastMessage || `${u.branch || 'Student'} • ${u.batch || '2024'}`}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CHAT WINDOW */}
                <div className={`${mobileMode === 'list' ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white overflow-hidden relative`}>
                    {selectedUser ? (
                        <>
                            <div className="px-8 py-5 border-b-3 border-primary flex items-center justify-between sticky top-0 bg-white z-20">
                                <div className="flex items-center gap-5">
                                    <button onClick={() => setMobileMode('list')} className="md:hidden p-2 text-primary border-2 border-primary rounded-xl hover:bg-highlight-yellow"><ArrowLeft size={18} /></button>
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-white border-2 border-primary flex items-center justify-center text-primary font-black shadow-neo-sm">
                                            {selectedUser.profilePicture ? <img src={selectedUser.profilePicture} className="w-full h-full object-cover" alt="" /> : <span>{selectedUser.username.charAt(0)}</span>}
                                        </div>
                                        {onlineUsers.includes(String(selectedUser._id || selectedUser.id)) && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-primary rounded-full shadow-neo-sm" />}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-normal leading-tight">{selectedUser.username}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">{selectedUser.branch || 'Member'}</p>
                                            <span className="w-1.5 h-1.5 bg-primary/10 rounded-full" />
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${onlineUsers.includes(String(selectedUser._id || selectedUser.id)) ? 'text-green-600' : 'text-primary/30'}`}>
                                                {onlineUsers.includes(String(selectedUser._id || selectedUser.id)) ? 'Active' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-8 py-12 space-y-12 bg-bg/10 custom-scrollbar">
                                {messages.map((msg) => {
                                    const isMe = String(msg.senderId) === String(user?.id || user?._id);
                                    return (
                                        <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}>
                                            <div className="max-w-[80%] flex items-end gap-4">
                                                {!isMe && <div className="w-8 h-8 rounded-lg bg-white border-2 border-primary shrink-0 flex items-center justify-center text-[10px] font-black shadow-neo-sm">{selectedUser.username.charAt(0)}</div>}
                                                <div className={`px-6 py-4 rounded-3xl border-3 border-primary shadow-neo-lg ${isMe ? 'bg-highlight-blue text-primary rounded-br-none' : 'bg-white text-primary rounded-bl-none'}`}>
                                                    <p className="text-sm font-bold leading-relaxed tracking-normal">{msg.text}</p>
                                                    <div className={`mt-3 flex items-center gap-2 text-[9px] font-black tracking-widest text-primary/40 ${isMe ? 'justify-end' : ''}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {otherUserTyping && (
                                    <div className="bg-white px-6 py-4 rounded-2xl border-2 border-primary shadow-neo-sm inline-flex gap-1.5 ml-12">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-white border-t-3 border-primary relative z-30">
                                {editingMessage && (
                                    <div className="absolute -top-12 left-0 right-0 h-10 bg-highlight-yellow border-y-2 border-primary flex items-center justify-between px-8 text-[10px] font-black uppercase">
                                        <span>Editing Message</span>
                                        <button onClick={() => { setEditingMessage(null); setNewMessage(''); }}><X size={16} /></button>
                                    </div>
                                )}
                                <form onSubmit={handleSendMessage} className="flex items-end gap-5 max-w-5xl mx-auto">
                                    <div className="flex-1 p-5 bg-bg border-3 border-primary rounded-[2rem] focus-within:bg-white focus-within:-translate-y-1 focus-within:shadow-neo transition-all">
                                        <textarea 
                                            value={newMessage}
                                            onChange={handleTyping}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                            placeholder="Write your message..."
                                            rows="1"
                                            className="w-full bg-transparent border-none outline-none text-sm font-bold tracking-normal leading-relaxed resize-none"
                                        />
                                    </div>
                                    <button type="submit" className="h-16 w-16 bg-highlight-teal border-3 border-primary shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center">
                                        <Send size={24} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-bg/10 relative">
                            <h2 className="text-3xl font-black uppercase tracking-normal mb-4 italic">Private Messaging</h2>
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 leading-loose">Select a peer to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:hidden h-20" />
        </div>
    );
};

export default Chat;
