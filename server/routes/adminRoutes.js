const express = require('express');
const router = express.Router();
const { getStats, getContentList } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);
router.get('/content', getContentList);

module.exports = router;
