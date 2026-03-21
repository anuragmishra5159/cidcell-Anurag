const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { writeLimiter, chatLimiter } = require('../middleware/rateLimiters');
const DoubtSession = require('../models/DoubtSession');
const DoubtMessage = require('../models/DoubtMessage');

// Student: Create a new doubt session (write — rate limited)
router.post('/sessions', writeLimiter, protect, async (req, res) => {
    try {
        const { mentorId, domain } = req.body;
        
        let existingSession = await DoubtSession.findOne({
            mentorId,
            studentId: req.user._id
        });

        if (existingSession) {
            return res.status(200).json(existingSession);
        }

        const newSession = await DoubtSession.create({
            mentorId,
            studentId: req.user._id,
            domain,
            status: 'open'
        });
        res.status(201).json(newSession);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get sessions for logged in user (Mentor or Student)
router.get('/sessions', chatLimiter, protect, async (req, res) => {
    try {
        const isMentor = req.user.userType === 'mentor';
        const query = isMentor ? { mentorId: req.user._id } : { studentId: req.user._id };
        const sessions = await DoubtSession.find(query)
            .populate('mentorId', 'username profilePicture department domainOfExpertise')
            .populate('studentId', 'username profilePicture branch batch')
            .sort({ updatedAt: -1 });
        res.status(200).json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update session status
router.put('/sessions/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const session = await DoubtSession.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(session);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get messages for a session (chat — high volume)
router.get('/sessions/:id/messages', chatLimiter, protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const messages = await DoubtMessage.find({ sessionId: req.params.id })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
            
        res.status(200).json(messages.reverse());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a message to a session (write — rate limited)
router.post('/sessions/:id/messages', writeLimiter, protect, async (req, res) => {
    try {
        const { content, senderType } = req.body;
        const newMessage = await DoubtMessage.create({
            sessionId: req.params.id,
            senderId: req.user._id,
            senderType,
            content
        });
        await DoubtSession.findByIdAndUpdate(req.params.id, { 
            lastMessage: content,
            updatedAt: Date.now()
        });
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
