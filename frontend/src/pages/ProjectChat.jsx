import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, Send, Users, Info, MessageSquare } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function ProjectChat() {
  const { id } = useParams();
  const { user, socket } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('group'); // 'group' or userId
  const [filter, setFilter] = useState('ALL'); 
  const messagesEndRef = useRef(null);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projRes = await axios.get(`${API}/projects/${id}`);
        setProject(projRes.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProject();
  }, [id, user]);

  // Fetch messages when tab changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!project) return;
      try {
        let query = '';
        if (activeTab !== 'group') {
          query = `?chatType=private&recipientId=${activeTab}`;
        }
        const msgRes = await axios.get(`${API}/project-messages/${id}${query}`, authHeaders());
        setMessages(msgRes.data);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [id, activeTab, project]);

  // Socket setup
  useEffect(() => {
    if (socket && user) {
      socket.emit('join_project_room', { projectId: id });

      const handleReceiveMsg = (msg) => {
        if (msg.chatType === 'private') {
           const isRelevant = 
             (msg.senderId._id === activeTab && msg.recipientId === user._id) || 
             (msg.senderId._id === user._id && msg.recipientId === activeTab);
           if (activeTab !== 'group' && isRelevant) {
             setMessages(prev => [...prev, msg]);
           }
        } else if (activeTab === 'group') {
           setMessages(prev => [...prev, msg]);
        }
      };

      socket.on('receive_project_message', handleReceiveMsg);

      return () => {
        socket.emit('leave_project_room', { projectId: id });
        socket.off('receive_project_message', handleReceiveMsg);
      };
    }
  }, [socket, id, user, activeTab]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const payload = { 
      projectId: id, 
      text: newMessage,
      chatType: activeTab === 'group' ? 'group' : 'private',
      recipientId: activeTab === 'group' ? null : activeTab
    };

    socket.emit('send_project_message', payload, (response) => {
      if (!response.success) {
        console.error("Failed to send message", response.error);
      }
    });

    setNewMessage('');
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center font-bold text-primary animate-pulse">
        Loading Chat Room...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h2 className="text-2xl font-black text-primary mb-4">Project Not Found</h2>
        <Link to="/projects" className="text-blue-600 font-bold hover:underline italic">Return to Projects</Link>
      </div>
    );
  }

  // Combine creator, contributors, and mentors for DM list
  const isCreator = project.createdBy?._id === user?._id;
  const isContributor = project.contributors?.some(c => (c.userId?._id || c.userId) === user?._id);
  const isProjectMentor = project.mentors?.some(m => (m.userId?._id || m.userId) === user?._id);

  if (!isCreator && !isContributor && !isProjectMentor) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h2 className="text-2xl font-black text-red-600 mb-4 uppercase">Access Denied</h2>
        <p className="text-slate-600 mb-4">You are not a member of this project.</p>
        <Link to={`/projects/${id}`} className="text-blue-600 font-bold hover:underline italic flex items-center justify-center gap-2">
          <ChevronLeft size={16} /> Return to Project
        </Link>
      </div>
    );
  }

  const teamMembers = [
    { ...project.createdBy, role: 'Creator' },
    ...project.mentors.map(m => ({ ...m.userId, role: 'Mentor' })),
    ...project.contributors.map(c => ({ ...c.userId, role: c.role || 'Contributor' }))
  ].filter(member => member && member._id !== user._id);

  const filteredMembers = teamMembers.filter(member => {
    if (filter === 'ALL') return true;
    const type = member.userType?.toUpperCase();
    if (filter === 'ADMIN') return type === 'ADMIN' || type === 'HOD';
    return type === filter;
  });

  const activeMember = activeTab !== 'group' ? teamMembers.find(m => m._id === activeTab) : null;

  return (
    <div className="bg-bg min-h-screen pt-20 flex">
      {/* Sidebar for DMs */}
      <div className="w-20 md:w-64 bg-white border-r-3 border-primary flex flex-col shrink-0">
        <div className="p-4 border-b-2 border-primary">
          <Link to={`/projects/${id}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft size={16} /> <span className="hidden md:inline">Back</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <button 
            onClick={() => setActiveTab('group')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border-2 mb-2 ${activeTab === 'group' ? 'bg-highlight-purple border-primary shadow-neo-sm' : 'border-transparent hover:border-slate-200'}`}
          >
            <div className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center text-primary shrink-0">
              <Users size={18} />
            </div>
            <div className="hidden md:block text-left">
              <p className="font-black text-xs text-primary uppercase">Group Chat</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">General</p>
            </div>
          </button>
          
          <div className="hidden md:block mt-4 mb-2">
            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase px-2 mb-2">Filters</p>
            <div className="flex flex-wrap gap-1 px-2">
              {['ALL', 'ADMIN', 'FACULTY', 'MENTOR', 'STUDENT'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded text-[8px] font-black transition-all border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-primary'}`}
                >
                  {f === 'FACULTY' ? 'FECULTY' : f}
                </button>
              ))}
            </div>
          </div>

          <p className="hidden md:block text-[9px] font-black tracking-widest text-slate-400 uppercase mt-4 mb-2 px-2">Direct Messages</p>
          
          {filteredMembers.map(member => (
            <button 
              key={member._id}
              onClick={() => setActiveTab(member._id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border-2 mb-1 ${activeTab === member._id ? 'bg-highlight-blue border-primary shadow-neo-sm' : 'border-transparent hover:border-slate-200'}`}
              title={member.username}
            >
              <img 
                src={member.profilePicture || `https://ui-avatars.com/api/?name=${member.username}`} 
                alt={member.username}
                className="w-10 h-10 rounded-full border-2 border-primary object-cover shrink-0"
              />
              <div className="hidden md:block text-left overflow-hidden">
                <p className="font-black text-[10px] text-primary uppercase truncate">{member.username}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{member.role}</p>
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   <p className="text-[8px] font-black text-highlight-blue uppercase truncate italic">{member.userType === 'faculty' ? 'FECULTY' : member.userType}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="bg-white px-4 sm:px-8 py-4 flex items-center justify-between border-b-2 border-primary shadow-sm shrink-0">
          <div>
            <h1 className="font-black text-xl text-primary uppercase leading-tight flex items-center gap-2">
              {activeTab === 'group' ? (
                <><Users size={18} className="text-highlight-purple" /> {project.title}</>
              ) : (
                <><MessageSquare size={18} className="text-highlight-blue" /> {activeMember?.username}</>
              )}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {activeTab === 'group' ? 'Project Team Chat' : `Private Message · ${activeMember?.role}`}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <Info size={48} className="mb-4 opacity-50" />
              <p className="font-black uppercase tracking-widest text-sm">No messages yet</p>
              <p className="text-xs font-bold italic mt-2">
                {activeTab === 'group' ? 'Start the conversation with your team.' : 'Say hello.'}
              </p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderId?._id === user?._id;
              return (
                <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <img 
                      src={msg.senderId?.profilePicture || `https://ui-avatars.com/api/?name=${msg.senderId?.username}`} 
                      alt={msg.senderId?.username}
                      className="w-8 h-8 rounded-full border-2 border-primary object-cover shadow-neo-sm shrink-0 mt-1"
                    />

                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest px-1">
                        {isMe ? 'You' : msg.senderId?.username}
                      </span>
                      <div className={`
                        px-4 py-3 border-2 border-primary shadow-neo-sm relative
                        ${isMe ? 'bg-highlight-green rounded-2xl rounded-tr-none' : 'bg-white rounded-2xl rounded-tl-none'}
                      `}>
                        <p className="text-sm font-medium text-slate-800 break-words">{msg.text}</p>
                        <span className="text-[9px] font-bold text-slate-400 mt-2 block opacity-70">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="bg-white border-t-2 border-primary p-4 shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={activeTab === 'group' ? "Type a message to the team..." : `Message ${activeMember?.username}...`}
              className="flex-1 bg-slate-50 border-2 border-primary rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:shadow-neo transition-all"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-12 h-12 bg-primary text-white border-2 border-primary rounded-xl flex items-center justify-center shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
