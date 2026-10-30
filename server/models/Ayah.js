const mongoose = require('mongoose');

const wordByWordSchema = new mongoose.Schema(
  {
    word: String,
    transliteration: String,
    english: String,
    urdu: String,
    grammar: String,
  },
  { _id: false }
);

const scientificPerspectiveSchema = new mongoose.Schema(
  {
    hasConnection: {
      type: Boolean,
      default: false,
    },
    concept: {
      type: String,
      default: '',
    },
    modernExplanation: {
      type: String,
      default: '',
    },
    sources: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    possibleReflection: {
      type: String,
      default: '',
    },
    educationalNotice: {
      type: String,
      default:
        'Educational reflection only. Quranic verses invite contemplation and are not technical science textbooks.',
    },
  },
  { _id: false }
);

const ayahSchema = new mongoose.Schema(
  {
    surahNumber: {
      type: Number,
      required: true,
    },
    ayahNumber: {
      type: Number,
      required: true,
    },
    arabicText: {
      type: String,
      required: true,
    },
    englishTranslation: {
      type: String,
      required: true,
    },
    englishSource: {
      type: String,
      default: 'Sahih International',
    },
    urduTranslation: {
      type: String,
      required: true,
    },
    urduSource: {
      type: String,
      default: 'Fateh Muhammad Jalandhry',
    },
    wordByWord: [wordByWordSchema],
    context: {
      surahContext: String,
      historicalBackground: String,
    },
    tafsir: {
      source: {
        type: String,
        default: 'Tafsir Ibn Kathir (Abridged)',
      },
      content: String,
    },
    simpleExplanation: {
      type: String,
      default: '',
    },
    scientificPerspective: scientificPerspectiveSchema,
    realWorldExample: {
      type: String,
      default: '',
    },
    lifeLessons: [String],
    reflectionQuestion: {
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

ayahSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true });

module.exports = mongoose.model('Ayah', ayahSchema);
