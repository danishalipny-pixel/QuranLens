const express = require('express');
const router = express.Router();
const {
  getAllSurahs,
  getSurahById,
  getAyahDetail,
} = require('../controllers/surahController');

router.get('/', getAllSurahs);
router.get('/:id', getSurahById);
router.get('/ayahs/:surah/:ayah', getAyahDetail);

module.exports = router;
