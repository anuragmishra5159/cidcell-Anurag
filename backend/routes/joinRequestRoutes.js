const express = require('express');
const router = express.Router();
const {
    submitJoinRequest,
    getProjectJoinRequests,
    getMyRequestStatus,
    acceptJoinRequest,
    rejectJoinRequest,
} = require('../controllers/joinRequestController');
const { protect } = require('../middleware/authMiddleware');
const { readLimiter, writeLimiter } = require('../middleware/rateLimiters');

// Student submits a join request
router.post('/', writeLimiter, protect, submitJoinRequest);

// Creator views join requests for their project
router.get('/project/:projectId', readLimiter, protect, getProjectJoinRequests);

// Student checks their own request status
router.get('/my-status/:projectId', readLimiter, protect, getMyRequestStatus);

// Creator accepts a request
router.patch('/:requestId/accept', writeLimiter, protect, acceptJoinRequest);

// Creator rejects a request
router.patch('/:requestId/reject', writeLimiter, protect, rejectJoinRequest);

module.exports = router;
