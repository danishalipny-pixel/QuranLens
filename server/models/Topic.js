const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
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
    titleUrdu: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Faith & Reflection', 'Ethics & Morality', 'Human Experience', 'Nature & Cosmos', 'Society & Justice'],
      default: 'Faith & Reflection',
    },
    icon: {
      type: String,
      default: 'Compass',
    },
    description: {
      type: String,
      required: true,
    },
    corePrinciples: [String],
    verses: [
      {
        surahNumber: Number,
        ayahNumber: Number,
        surahName: String,
        arabicPreview: String,
        translationPreview: String,
        themeConnection: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Topic', topicSchema);
