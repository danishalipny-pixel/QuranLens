const mongoose = require('mongoose');

const scienceTopicSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Hydrology & Earth',
        'Astronomy & Cosmology',
        'Biology & Embryology',
        'Geology & Topography',
        'Atmosphere & Physics',
        'Zoology & Ecology',
      ],
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    summary: {
      type: String,
      required: true,
    },
    scientificConcept: {
      type: String,
      required: true,
    },
    modernScientificExplanation: {
      type: String,
      required: true,
    },
    quranReferences: [
      {
        surahNumber: Number,
        ayahNumber: Number,
        surahName: String,
        arabicText: String,
        englishTranslation: String,
        urduTranslation: String,
        possibleReflection: String,
      },
    ],
    scientificSources: [
      {
        name: String,
        publisher: String,
        url: String,
        year: String,
      },
    ],
    keyFacts: [String],
    confidenceLevel: {
      type: String,
      enum: ['High Parallels in Observable Phenomena', 'Conceptual Reflection', 'Thematic Sign'],
      default: 'Conceptual Reflection',
    },
    disclaimer: {
      type: String,
      default:
        'Educational and reflective perspective. Quranic verses are divine signs of reflection and guidance, not formal empirical science treatises. Scientific consensus develops over time.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ScienceTopic', scienceTopicSchema);
