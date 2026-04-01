import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import ChatSidebar from '../components/chat/ChatSidebar';
import DirectMessagePanel from '../components/chat/DirectMessagePanel';
import DoubtSessionPanel from '../components/chat/DoubtSessionPanel';
import ProjectChatPanel from '../components/chat/ProjectChatPanel';
import { MessageSquare } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function ChatHub() {
  const { user, socket, onlineUsers } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  // Sidebar data
  const [conversations, setConversations] = useState({
    dmUsers: [],
    doubtSessions: [],
    projects: []
  });
  const [unreadCounts, setUnreadCounts] = useState({ dms: {}, projects: {} });
  const [loading, setLoading] = useState(true);

  // Active panel state
  // type: 'dm' | 'doubt' | 'project' | null
  // id: the userId / sessionId / projectId
  const [activePanel, setActivePanel] = useState({ type: null, id: null, data: null });

  // Fetch sidebar data
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/chat/unread-counts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCounts(res.data);
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchConversations();
      fetchUnreadCounts();
    }
  }, [token, fetchConversations, fetchUnreadCounts]);

  // Listen for real-time messages to update unread counts
  useEffect(() => {
    if (!socket) return;

    const handleDM = (msg) => {
      // If the DM is not for the currently active panel, bump unread
      if (activePanel.type !== 'dm' || activePanel.id !== msg.senderId?._id) {
        setUnreadCounts(prev => ({
          ...prev,
          dms: {
            ...prev.dms,
            [msg.senderId?._id || msg.senderId]: (prev.dms[msg.senderId?._id || msg.senderId] || 0) + 1
          }
        }));
      }
    };

    socket.on('receive_message', handleDM);
    return () => socket.off('receive_message', handleDM);
  }, [socket, activePanel]);

  // Mark as read when opening a conversation
  const handleSelectConversation = useCallback(async (type, id, data) => {
    setActivePanel({ type, id, data });

    // Mark DM or project as read
    if (type === 'dm' || type === 'project') {
      try {
        await axios.patch(`${API}/chat/mark-read`, { type, id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCounts(prev => {
          const bucket = type === 'dm' ? 'dms' : 'projects';
          const updated = { ...prev[bucket] };
          delete updated[id];
          return { ...prev, [bucket]: updated };
        });
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  }, [token]);

  // Render the active panel
  const renderPanel = () => {
    if (!activePanel.type) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-6 p-8 text-center animate-fade-in-up">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl">
              <MessageSquare size={40} className="text-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-[0.3em]">Neural Link Standby</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-[280px] leading-loose">
              Select a secure communication channel from the sidebar to establish a connection.
            </p>
          </div>
        </div>
      );
    }

    switch (activePanel.type) {
      case 'dm':
        return (
          <DirectMessagePanel
            recipientId={activePanel.id}
            recipientData={activePanel.data}
            onBack={() => setActivePanel({ type: null, id: null, data: null })}
          />
        );
      case 'doubt':
        return (
          <DoubtSessionPanel
            sessionId={activePanel.id}
            sessionData={activePanel.data}
            onBack={() => setActivePanel({ type: null, id: null, data: null })}
          />
        );
      case 'project':
        return (
          <ProjectChatPanel
            projectId={activePanel.id}
            projectData={activePanel.data}
            onBack={() => setActivePanel({ type: null, id: null, data: null })}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center font-bold text-primary animate-pulse">
        Loading Chat Hub...
      </div>
    );
  }

  return (
    <div className="bg-bg h-screen pt-20 flex overflow-hidden selection:bg-accent/30">
      {/* Background Decorative patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-glow-accent rounded-full rounded-full"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-glow-magenta rounded-full rounded-full"></div>
      </div>

      <div className={`${activePanel.id ? 'hidden md:flex' : 'flex'} contents`}>
        <ChatSidebar
          conversations={conversations}
          unreadCounts={unreadCounts}
          activePanel={activePanel}
          onSelect={handleSelectConversation}
          userType={user?.userType}
          currentUserId={user?._id}
          onlineUsers={onlineUsers}
        />
      </div>
      <div className={`flex-1 flex flex-col h-[calc(100vh-80px)] backdrop-blur-md relative z-10 ${!activePanel.id ? 'hidden md:flex' : 'flex'}`}>
        {renderPanel()}
      </div>
    </div>
  );
}
