const express = require('express');
const router = express.Router();
const {
    getMembers,
    addMember,
    updateMember,
    removeMember,
    reorderMembers
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMembers)
    .post(protect, admin, addMember);

router.post('/reorder', protect, admin, reorderMembers);

router.route('/:id')
    .put(protect, admin, updateMember)
    .delete(protect, admin, removeMember);

module.exports = router;
