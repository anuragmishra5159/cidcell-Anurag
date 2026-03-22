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
    addMentorToProject,
    getAllProjects,
    deleteProject,
    updateContributorRole,
    updateContributorLevel,
} = require('../controllers/projectController');
const { protect, admin, isFaculty, isMentor, isStudentOrMentor, optionalProtect } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

// ── Public ──────────────────────────
router.get('/', readLimiter, optionalProtect, getActiveProjects);

// ── Authenticated (order matters: specific paths before /:id) ──
router.get('/mine/all',       readLimiter, protect, getMyProjects);
router.get('/review/mentor',  readLimiter, protect, isMentor, getPendingForMentor);
router.get('/review/faculty', readLimiter, protect, isFaculty, getPendingForFaculty);
router.get('/review/admin',   readLimiter, protect, admin, getPendingForAdmin);
router.get('/all',            readLimiter, protect, admin, getAllProjects);

// Submit new project (any authenticated user)
router.post('/', writeLimiter, protect, submitProject);

// Join route REMOVED — replaced by /api/join-requests system (Phase 1)

// Review actions
router.patch('/:id/mentor-review',  writeLimiter, protect, isMentor, mentorReview);
router.patch('/:id/faculty-review', writeLimiter, protect, isFaculty, facultyReview);
router.patch('/:id/admin-review',   writeLimiter, protect, admin, adminReview);
router.patch('/:id/add-mentor',     writeLimiter, protect, admin, addMentorToProject);

// Admin delete
router.delete('/:id', writeLimiter, protect, admin, deleteProject);

// Contributor roles & levels
router.patch('/:id/contributors/:userId/role', writeLimiter, protect, updateContributorRole);
router.patch('/:id/contributors/:userId/level', writeLimiter, protect, updateContributorLevel);

// ── Parameterized (MUST be last) ──
router.get('/:id', readLimiter, getProjectById);

module.exports = router;
