const express = require('express');
const router = express.Router();
const { getMessagesBetweenUsers, getRecentChats } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recent', protect, getRecentChats);
router.get('/:userId', protect, getMessagesBetweenUsers);

module.exports = router;
