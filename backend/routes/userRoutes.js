const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router(); // Handle potential namespace issues if any
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMentors
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

router.route('/')
    .get(readLimiter, protect, getUsers);

router.route('/mentors')
    .get(readLimiter, getMentors);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
