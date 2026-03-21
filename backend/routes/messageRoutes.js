const express = require('express');
const router = express.Router();
const { getMessagesBetweenUsers, getRecentChats } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiters');

router.get('/recent', chatLimiter, protect, getRecentChats);
router.get('/:userId', chatLimiter, protect, getMessagesBetweenUsers);

module.exports = router;
