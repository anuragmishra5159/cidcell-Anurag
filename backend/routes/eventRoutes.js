const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validate');
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent
} = require('../controllers/eventController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

router.route('/')
    .get(readLimiter, validate(schemas.paginationSchema), getEvents)
    .post(writeLimiter, protect, admin, validate(schemas.createEventSchema), createEvent);

router.route('/:id')
    .get(readLimiter, optionalProtect, getEventById)
    .put(writeLimiter, protect, admin, updateEvent)
    .delete(writeLimiter, protect, admin, deleteEvent);

router.post('/:id/register', writeLimiter, protect, registerForEvent);

module.exports = router;
