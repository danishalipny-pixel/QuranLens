const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    surahNumber: {
      type: Number,
      required: true,
    },
    ayahNumber: {
      type: Number,
      required: true,
    },
    surahName: {
      type: String,
      default: '',
    },
    arabicPreview: {
      type: String,
      default: '',
    },
    englishPreview: {
      type: String,
      default: '',
    },
    collectionName: {
      type: String,
      enum: ['Favorites', 'Study', 'Daily Reading', 'Science', 'Reflections', 'Custom'],
      default: 'Favorites',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ userId: 1, surahNumber: 1, ayahNumber: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
