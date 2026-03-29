const express = require('express');
const router = express.Router();
const {
    googleLogin,
    getProfile,
    updateProfile,
    previewEmailTemplate,
    previewLogo
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');

// Template & Logo Preview Routes
// ⚠️  GATED to development only — prevents info-leak in production.
if (process.env.NODE_ENV !== 'production') {
    router.get('/template-preview', previewEmailTemplate);
    router.get('/logo-preview', previewLogo);
}

// Google Authentication Route — strict limiter to prevent brute force
router.post('/google', authLimiter, googleLogin);

// Protected routes
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

module.exports = router;
