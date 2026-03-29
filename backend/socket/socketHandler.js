const Message = require('../models/Message');
const User = require('../models/User');
const { onlineUsers } = require('./onlineStore');

const socketHandler = (io) => {
    return (socket) => {
        const userId = socket.user.id; // From middleware
        
        // Track connection
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);
        
        // Join personal room for private messaging
        socket.join(userId);
        
        // Send initial online list to the newly connected user only
        socket.emit('online_users', Array.from(onlineUsers.keys()));
        
        // ── Targeted user_online broadcast ────────────────────────────────────
        // We intentionally do NOT do io.emit('user_online') here — broadcasting
        // to ALL N connected sockets on every new connection creates an O(N²)
        // event flood with many concurrent users. Instead, each client can call
        // 'request_online_users' to refresh the list when they open a chat.
        // The existing online_users event on connect gives the full current list.

        // --- Private Chat Events ---

        socket.on('send_message', async (data, callback) => {
            try {
                const { receiverId, text } = data;
                if (!receiverId || !text) return;

                const newMessage = await Message.create({
                    senderId: userId,
                    receiverId,
                    text,
                    status: onlineUsers.has(String(receiverId)) ? 'delivered' : 'sent'
                });

                // Populate and format for frontend
                const populatedMessage = {
                    _id: newMessage._id,
                    senderId: userId,
                    receiverId,
                    text: newMessage.text,
                    createdAt: newMessage.createdAt,
                    status: newMessage.status,
                    isEdited: false,
                    isDeleted: false
                };

                // Emit to receiver and other sender sockets
                io.to(receiverId).emit('receive_message', populatedMessage);
                io.to(userId).emit('receive_message', populatedMessage);

                if (callback) callback({ success: true, data: populatedMessage });
            } catch (err) {
                console.error('Socket send_message error:', err);
                if (callback) callback({ success: false });
            }
        });

        socket.on('typing', (data) => {
            const { receiverId } = data;
            io.to(receiverId).emit('user_typing', { userId });
        });

        socket.on('stop_typing', (data) => {
            const { receiverId } = data;
            io.to(receiverId).emit('user_stop_typing', { userId });
        });

        socket.on('edit_message', async (data, callback) => {
            try {
                const { messageId, newText } = data;
                const message = await Message.findById(messageId);
                
                if (!message || String(message.senderId) !== userId) {
                    return callback && callback({ success: false, error: 'Unauthorized' });
                }

                message.text = newText;
                message.isEdited = true;
                await message.save();

                io.to(String(message.receiverId)).emit('message_updated', message);
                io.to(userId).emit('message_updated', message);

                if (callback) callback({ success: true });
            } catch (err) {
                if (callback) callback({ success: false });
            }
        });

        socket.on('delete_message', async (data, callback) => {
            try {
                const { messageId } = data;
                const message = await Message.findById(messageId);
                
                if (!message || String(message.senderId) !== userId) {
                    return callback && callback({ success: false });
                }

                message.isDeleted = true;
                message.text = "This message was deleted";
                await message.save();

                io.to(String(message.receiverId)).emit('message_deleted', { messageId });
                io.to(userId).emit('message_deleted', { messageId });

                if (callback) callback({ success: true });
            } catch (err) {
                if (callback) callback({ success: false });
            }
        });

        // --- Doubt Session Events ---
        socket.on('join_doubt_session', (data) => {
            const { sessionId } = data;
            if (sessionId) socket.join(`doubt_${sessionId}`);
        });

        socket.on('leave_doubt_session', (data) => {
            const { sessionId } = data;
            if (sessionId) socket.leave(`doubt_${sessionId}`);
        });

        socket.on('send_doubt_message', (data) => {
            // Expects complete message object from REST API
            const { sessionId, message } = data;
            socket.to(`doubt_${sessionId}`).emit('receive_doubt_message', message);
        });

        // --- Disconnect ---
        socket.on('disconnect', () => {
            const sockets = onlineUsers.get(userId);
            if (sockets) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    onlineUsers.delete(userId);
                    io.emit('user_offline', { userId });
                }
            }
        });
    };
};

// --- /project-chat Namespace ---
const setupProjectChatNamespace = (io, socketAuthMiddleware) => {
    const projectChatNsp = io.of('/project-chat');
    projectChatNsp.use(socketAuthMiddleware);

    projectChatNsp.on('connection', (socket) => {
        const userId = socket.user.id;

        socket.on('join_project_room', (data) => {
            const { projectId } = data;
            if (projectId) socket.join(`project_${projectId}`);
        });

        socket.on('leave_project_room', (data) => {
            const { projectId } = data;
            if (projectId) socket.leave(`project_${projectId}`);
        });

        socket.on('send_project_message', async (data, callback) => {
            try {
                const { projectId, text } = data;
                if (!projectId || !text) return;

                const ProjectMessage = require('../models/ProjectMessage');
                const newMessage = await ProjectMessage.create({
                    projectId,
                    senderId: userId,
                    text
                });

                const populatedMessage = await ProjectMessage.findById(newMessage._id)
                    .populate('senderId', 'username profilePicture');

                // Group-only broadcast — no private chat branch
                projectChatNsp.to(`project_${projectId}`)
                    .emit('receive_project_message', populatedMessage);

                if (callback) callback({ success: true, data: populatedMessage });
            } catch (err) {
                console.error('Project Message Error:', err);
                if (callback) callback({ success: false, error: err.message });
            }
        });

        socket.on('disconnect', () => {
            // Project namespace disconnect — no special cleanup needed
        });
    });

    return projectChatNsp;
};

module.exports = { socketHandler, setupProjectChatNamespace };
