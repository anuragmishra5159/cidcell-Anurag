const express = require('express');
const router = express.Router();
const { googleLogin, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');

// Google Authentication Route — strict limiter to prevent brute force
router.post('/google', authLimiter, googleLogin);

// Protected routes
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

module.exports = router;
