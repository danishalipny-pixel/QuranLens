const express = require('express');
const router = express.Router();
const { askTutor } = require('../controllers/aiController');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/ask', aiLimiter, askTutor);

module.exports = router;
