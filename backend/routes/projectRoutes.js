const express = require('express');
const router = express.Router();
const {
    getProjects,
    createProject,
    updateProject,
    approveProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, createProject); // Removed mandatory admin for creation

router.route('/:id')
    .put(protect, admin, updateProject)
    .delete(protect, admin, deleteProject);

router.patch('/:id/approve', protect, admin, approveProject);

module.exports = router;
