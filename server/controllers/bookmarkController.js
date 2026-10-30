const Bookmark = require('../models/Bookmark');
const Note = require('../models/Note');
const { isDBConnected } = require('../config/db');

// In-memory fallback stores
const memoryBookmarks = [];
const memoryNotes = [];

// @desc    Get all user bookmarks
// @route   GET /api/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (isDBConnected()) {
      const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: bookmarks.length, data: bookmarks });
    }

    const userBookmarks = memoryBookmarks.filter((b) => b.userId === userId);
    res.json({ success: true, count: userBookmarks.length, data: userBookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or toggle bookmark
// @route   POST /api/bookmarks
exports.addBookmark = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { surahNumber, ayahNumber, surahName, arabicPreview, englishPreview, collectionName, notes } = req.body;

    if (!surahNumber || !ayahNumber) {
      return res.status(400).json({ success: false, message: 'Surah and Ayah numbers are required' });
    }

    if (isDBConnected()) {
      const existing = await Bookmark.findOne({ userId, surahNumber, ayahNumber });
      if (existing) {
        await Bookmark.deleteOne({ _id: existing._id });
        return res.json({ success: true, action: 'removed', message: 'Bookmark removed' });
      }

      const bookmark = await Bookmark.create({
        userId,
        surahNumber,
        ayahNumber,
        surahName,
        arabicPreview,
        englishPreview,
        collectionName: collectionName || 'Favorites',
        notes: notes || '',
      });

      return res.status(201).json({ success: true, action: 'added', data: bookmark });
    }

    const idx = memoryBookmarks.findIndex(
      (b) => b.userId === userId && b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );

    if (idx !== -1) {
      memoryBookmarks.splice(idx, 1);
      return res.json({ success: true, action: 'removed', message: 'Bookmark removed' });
    }

    const newBookmark = {
      _id: 'bm_' + Date.now(),
      userId,
      surahNumber,
      ayahNumber,
      surahName: surahName || `Surah ${surahNumber}`,
      arabicPreview: arabicPreview || '',
      englishPreview: englishPreview || '',
      collectionName: collectionName || 'Favorites',
      notes: notes || '',
      createdAt: new Date(),
    };

    memoryBookmarks.push(newBookmark);
    res.status(201).json({ success: true, action: 'added', data: newBookmark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:id
exports.deleteBookmark = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id || req.user._id;

    if (isDBConnected()) {
      await Bookmark.findOneAndDelete({ _id: id, userId });
      return res.json({ success: true, message: 'Bookmark deleted successfully' });
    }

    const idx = memoryBookmarks.findIndex((b) => b._id === id && b.userId === userId);
    if (idx !== -1) {
      memoryBookmarks.splice(idx, 1);
    }
    res.json({ success: true, message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user personal notes
// @route   GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (isDBConnected()) {
      const notes = await Note.find({ userId }).sort({ updatedAt: -1 });
      return res.json({ success: true, count: notes.length, data: notes });
    }

    const userNotes = memoryNotes.filter((n) => n.userId === userId);
    res.json({ success: true, count: userNotes.length, data: userNotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add personal note
// @route   POST /api/notes
exports.addNote = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { surahNumber, ayahNumber, title, content, tags } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Note content is required' });
    }

    if (isDBConnected()) {
      const note = await Note.create({
        userId,
        surahNumber,
        ayahNumber,
        title: title || '',
        content,
        tags: tags || [],
      });
      return res.status(201).json({ success: true, data: note });
    }

    const newNote = {
      _id: 'note_' + Date.now(),
      userId,
      surahNumber,
      ayahNumber,
      title: title || '',
      content,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryNotes.push(newNote);
    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
