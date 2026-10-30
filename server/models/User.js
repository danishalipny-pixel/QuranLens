const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    readingHistory: [
      {
        surahNumber: Number,
        ayahNumber: Number,
        surahName: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    readingPreferences: {
      arabicFontSize: { type: Number, default: 28 },
      translationFontSize: { type: Number, default: 16 },
      showUrdu: { type: Boolean, default: true },
      showEnglish: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark', 'emerald'], default: 'emerald' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
