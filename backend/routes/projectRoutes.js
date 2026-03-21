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
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

router.route('/')
    .get(readLimiter, getProjects)
    .post(writeLimiter, protect, createProject);

router.route('/:id')
    .put(writeLimiter, protect, admin, updateProject)
    .delete(writeLimiter, protect, admin, deleteProject);

router.patch('/:id/approve', writeLimiter, protect, admin, approveProject);

module.exports = router;
