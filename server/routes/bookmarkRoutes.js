const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  addBookmark,
  deleteBookmark,
  getNotes,
  addNote,
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:id', deleteBookmark);

router.get('/notes', getNotes);
router.post('/notes', addNote);

module.exports = router;
