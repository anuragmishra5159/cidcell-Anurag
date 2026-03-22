const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

router.get('/', readLimiter, protect, getNotifications);
router.patch('/read-all', writeLimiter, protect, markAllAsRead);
router.patch('/:id/read', writeLimiter, protect, markAsRead);

module.exports = router;
