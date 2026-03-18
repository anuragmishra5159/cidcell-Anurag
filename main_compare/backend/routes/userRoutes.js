const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router(); // Handle potential namespace issues if any
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
