const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/', apiLimiter, globalSearch);

module.exports = router;
