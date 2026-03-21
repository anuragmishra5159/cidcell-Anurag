import React from 'react';
import { Send, Search, Users, ArrowLeft, MessageSquare } from 'lucide-react';

export default function ChatInterface({
    userType,
    user,
    sessions,
    activeSession,
    setActiveSession,
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    searchQuery,
    setSearchQuery,
    chatContainerRef,
    onBack,
    onLoadMore,
    hasMore,
}) {
    const filteredSessions = sessions.filter(s => {
        const otherUser = userType === 'mentor' ? s.studentId : s.mentorId;
        const name = otherUser?.username || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-bg min-h-screen pt-28 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Mobile back button & Profile banner */}
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={onBack} 
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
                                    placeholder="Search..."
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
                                filteredSessions.map(session => {
                                    const otherUser = userType === 'mentor' ? session.studentId : session.mentorId;
                                    return (
                                    <div 
                                        key={session._id} 
                                        onClick={() => setActiveSession(session)}
                                        className={`p-4 border-b-2 border-primary/10 cursor-pointer transition-colors ${activeSession?._id === session._id ? 'bg-highlight-yellow border-l-8 border-l-primary' : 'hover:bg-highlight-blue/10 border-l-8 border-l-transparent'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={otherUser?.profilePicture || `https://ui-avatars.com/api/?name=${otherUser?.username}&background=random`} 
                                                className="w-12 h-12 rounded-2xl border-3 border-primary shadow-neo-sm object-cover bg-white"
                                                alt="avatar"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-black text-primary truncate text-sm">{otherUser?.username || 'Unknown User'}</h3>
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
                                )})
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Active Chat Window */}
                    <div className={`lg:col-span-8 bg-white border-4 border-primary rounded-neo shadow-neo flex flex-col overflow-hidden ${!activeSession ? 'hidden lg:flex' : 'flex'}`}>
                        {!activeSession ? (
                            <div className="flex-1 bg-bg flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-primary/20 m-4 rounded-2xl">
                                <MessageSquare className="w-16 h-16 text-primary/20 mb-6" />
                                <h2 className="text-xl font-black uppercase text-primary/40 tracking-tight">Select a conversation</h2>
                                <p className="text-xs font-bold text-primary/40 mt-2">Choose a {userType === 'mentor' ? 'student' : 'mentor'} from the list to start chatting.</p>
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
                                            src={(userType === 'mentor' ? activeSession.studentId : activeSession.mentorId)?.profilePicture || `https://ui-avatars.com/api/?name=${(userType === 'mentor' ? activeSession.studentId : activeSession.mentorId)?.username}&background=random`} 
                                            className="w-10 h-10 rounded-xl border-2 border-primary shadow-neo-sm"
                                            alt="avatar"
                                        />
                                        <div>
                                            <h3 className="font-black text-primary uppercase text-sm md:text-base leading-none tracking-tight">
                                                {(userType === 'mentor' ? activeSession.studentId : activeSession.mentorId)?.username}
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
                                <div ref={chatContainerRef} className="flex-1 bg-bg overflow-y-auto overflow-x-hidden p-4 md:p-6 flex flex-col gap-4 min-w-0">
                                    {hasMore && (
                                    <div className="flex justify-center mb-4">
                                        <button onClick={onLoadMore} className="bg-highlight-blue border-2 border-primary text-[10px] font-black uppercase px-4 py-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-neo-sm transition-all rounded-xl">
                                            Load Earlier
                                        </button>
                                    </div>
                                    )}

                                    {messages.map((msg, i) => {
                                        const isSelf = msg.senderType === userType || String(msg.senderId) === String(user?._id);
                                        return (
                                            <div key={msg._id || i} className={`flex w-full min-w-0 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`
                                                    relative max-w-[85%] md:max-w-[70%] border-3 border-primary p-3 md:p-4 shadow-neo-sm overflow-hidden
                                                    ${isSelf 
                                                        ? 'bg-highlight-yellow rounded-2xl rounded-br-none ml-auto' 
                                                        : 'bg-white rounded-2xl rounded-tl-none mr-auto'}
                                                `}>
                                                    <p className="text-sm md:text-base font-bold text-primary leading-relaxed whitespace-pre-wrap break-words break-all m-0">
                                                        {msg.content}
                                                    </p>
                                                    <div className={`mt-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${isSelf ? 'justify-end text-primary/60' : 'justify-start text-primary/40'}`}>
                                                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t-4 border-primary bg-white shrink-0">
                                    <form onSubmit={handleSendMessage} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message here..."
                                            className="flex-1 min-w-0 bg-white border-3 border-primary p-3 md:p-4 rounded-xl text-xs md:text-sm font-bold text-primary shadow-neo-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 transition-all"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="shrink-0 bg-primary text-white border-3 border-primary px-6 rounded-xl flex items-center justify-center hover:bg-primary/90 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-neo transition-all disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-neo"
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
}
