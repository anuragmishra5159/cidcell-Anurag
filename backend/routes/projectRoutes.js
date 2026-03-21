const express = require('express');
const router = express.Router();
const {
    submitProject,
    getActiveProjects,
    getMyProjects,
    getProjectById,
    getPendingForFaculty,
    getPendingForMentor,
    getPendingForAdmin,
    mentorReview,
    facultyReview,
    adminReview,
    joinProject,
    addMentorToProject,
    getAllProjects,
    deleteProject,
} = require('../controllers/projectController');
const { protect, admin, isFaculty, isMentor, isStudentOrMentor } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

// ── Public ──────────────────────────
router.get('/', readLimiter, getActiveProjects);

// ── Authenticated (order matters: specific paths before /:id) ──
router.get('/mine/all',       readLimiter, protect, getMyProjects);
router.get('/review/mentor',  readLimiter, protect, isMentor, getPendingForMentor);
router.get('/review/faculty', readLimiter, protect, isFaculty, getPendingForFaculty);
router.get('/review/admin',   readLimiter, protect, admin, getPendingForAdmin);
router.get('/all',            readLimiter, protect, admin, getAllProjects);

// Submit new project (student or mentor)
router.post('/', writeLimiter, protect, isStudentOrMentor, submitProject);

// Join a collaborative project
router.post('/:id/join', writeLimiter, protect, joinProject);

// Review actions
router.patch('/:id/mentor-review',  writeLimiter, protect, isMentor, mentorReview);
router.patch('/:id/faculty-review', writeLimiter, protect, isFaculty, facultyReview);
router.patch('/:id/admin-review',   writeLimiter, protect, admin, adminReview);
router.patch('/:id/add-mentor',     writeLimiter, protect, admin, addMentorToProject);

// Admin delete
router.delete('/:id', writeLimiter, protect, admin, deleteProject);

// ── Parameterized (MUST be last) ──
router.get('/:id', readLimiter, getProjectById);

module.exports = router;
