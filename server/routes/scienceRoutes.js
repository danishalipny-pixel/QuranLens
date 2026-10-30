const express = require('express');
const router = express.Router();
const {
  getAllScienceTopics,
  getScienceTopicBySlug,
} = require('../controllers/scienceController');

router.get('/', getAllScienceTopics);
router.get('/:slug', getScienceTopicBySlug);

module.exports = router;
