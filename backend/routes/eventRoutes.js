const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validate');
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    createProposal,
    getMyProposals,
    getProposals,
    approveProposal,
    rejectProposal,
} = require('../controllers/eventController');
const { protect, admin, isFaculty, optionalProtect } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

router.route('/')
    .get(readLimiter, validate(schemas.paginationSchema), getEvents)
    .post(writeLimiter, protect, admin, validate(schemas.createEventSchema), createEvent);

// --- Proposal routes (must be ABOVE /:id wildcard) ---
router.post('/proposals',                         writeLimiter, protect, isFaculty, createProposal);
router.get('/my-proposals',                       protect, isFaculty, getMyProposals);
router.get('/proposals',                          protect, admin, getProposals);
router.patch('/proposals/:id/approve',            writeLimiter, protect, admin, approveProposal);
router.patch('/proposals/:id/reject',             writeLimiter, protect, admin, rejectProposal);

// --- Generic event routes ---
router.route('/:id')
    .get(readLimiter, optionalProtect, getEventById)
    .put(writeLimiter, protect, admin, updateEvent)
    .delete(writeLimiter, protect, admin, deleteEvent);

router.post('/:id/register', writeLimiter, protect, registerForEvent);

module.exports = router;

