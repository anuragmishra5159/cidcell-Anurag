const Message = require('../models/Message');

// @desc    Get all messages between two users
// @route   GET /api/messages/:userId
// @access  Private
const getMessagesBetweenUsers = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get recent chats for current user
// @route   GET /api/messages/recent
// @access  Private
const getRecentChats = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
        })
        .sort({ createdAt: -1 })
        .populate('senderId', 'username profilePicture branch batch')
        .populate('receiverId', 'username profilePicture branch batch');

        // Extract unique conversation partners
        const partners = new Map();
        messages.forEach(msg => {
            const partner = String(msg.senderId._id) === String(currentUserId) ? msg.receiverId : msg.senderId;
            const partnerId = String(partner._id);
            
            if (!partners.has(partnerId)) {
                partners.set(partnerId, {
                    ...partner._doc,
                    lastMessage: msg.text,
                    lastMessageTime: msg.createdAt,
                    status: msg.status,
                    isSender: String(msg.senderId._id) === String(currentUserId)
                });
            }
        });

        res.json(Array.from(partners.values()));
    } catch (error) {
        console.error('Error fetching recent chats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMessagesBetweenUsers, getRecentChats };
