const express = require('express');
const router = express.Router();
const { getProjectMessages } = require('../controllers/projectMessageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:projectId', protect, getProjectMessages);

module.exports = router;
