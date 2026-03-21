const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasksByProject,
    pickTask,
    submitPR,
    reviewTask,
} = require('../controllers/taskController');
const { protect, isMentor } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

router.post('/',                          writeLimiter, protect, isMentor, createTask);
router.get('/project/:projectId',         readLimiter, protect, getTasksByProject);
router.patch('/:id/pick',                 writeLimiter, protect, pickTask);
router.patch('/:id/submit-pr',            writeLimiter, protect, submitPR);
router.patch('/:id/review',               writeLimiter, protect, isMentor, reviewTask);

module.exports = router;
