const mongoose = require('mongoose');

const surahSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 114,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    englishName: {
      type: String,
      required: true,
      trim: true,
    },
    englishNameTranslation: {
      type: String,
      required: true,
      trim: true,
    },
    urduName: {
      type: String,
      default: '',
    },
    numberOfAyahs: {
      type: Number,
      required: true,
    },
    revelationType: {
      type: String,
      enum: ['Meccan', 'Medinan', 'Makki', 'Madani'],
      required: true,
    },
    revelationOrder: {
      type: Number,
    },
    description: {
      type: String,
      default: '',
    },
    audioUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Surah', surahSchema);
