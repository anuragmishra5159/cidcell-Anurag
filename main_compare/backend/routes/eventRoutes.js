const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent
} = require('../controllers/eventController');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, admin, createEvent);

router.route('/:id')
    .get(optionalProtect, getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

router.post('/:id/register', protect, registerForEvent);

module.exports = router;
