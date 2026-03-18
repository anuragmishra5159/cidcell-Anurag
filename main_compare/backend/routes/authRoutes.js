const express = require('express');
const router = express.Router();
const { googleLogin, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Google Authentication Route
router.post('/google', googleLogin);

// Protected routes
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

module.exports = router;
