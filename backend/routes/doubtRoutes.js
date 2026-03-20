const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const DoubtSession = require('../models/DoubtSession');
const DoubtMessage = require('../models/DoubtMessage');

// Student: Create a new doubt session
router.post('/sessions', protect, async (req, res) => {
    try {
        const { mentorId, domain } = req.body;
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
router.get('/sessions', protect, async (req, res) => {
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

// Get messages for a session
router.get('/sessions/:id/messages', protect, async (req, res) => {
    try {
        const messages = await DoubtMessage.find({ sessionId: req.params.id }).sort('timestamp');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a message to a session
router.post('/sessions/:id/messages', protect, async (req, res) => {
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
