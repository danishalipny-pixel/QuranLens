const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDBConnected } = require('../config/db');

// In-memory user store fallback if MongoDB is not connected
const memoryUsers = new Map([
  [
    'demo@quranlens.com',
    {
      _id: 'demo_user_1',
      id: 'demo_user_1',
      name: 'Demo Student',
      email: 'demo@quranlens.com',
      passwordHash: bcrypt.hashSync('demo1234', 10),
      role: 'user',
      readingHistory: [
        { surahNumber: 1, ayahNumber: 1, surahName: 'Al-Fatihah', timestamp: new Date() },
        { surahNumber: 21, ayahNumber: 30, surahName: 'Al-Anbiya', timestamp: new Date() },
      ],
      readingPreferences: {
        arabicFontSize: 28,
        translationFontSize: 16,
        showUrdu: true,
        showEnglish: true,
        theme: 'emerald',
      },
    },
  ],
  [
    'admin@quranlens.com',
    {
      _id: 'admin_user_1',
      id: 'admin_user_1',
      name: 'QuranLens Administrator',
      email: 'admin@quranlens.com',
      passwordHash: bcrypt.hashSync('admin1234', 10),
      role: 'admin',
      readingHistory: [],
      readingPreferences: {
        arabicFontSize: 28,
        translationFontSize: 16,
        showUrdu: true,
        showEnglish: true,
        theme: 'emerald',
      },
    },
  ],
]);

const generateToken = (id, email, name, role) => {
  return jwt.sign(
    { id, email, name, role },
    process.env.JWT_SECRET || 'quranlens_secure_jwt_secret_key_educational_platform_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: normalizedEmail.includes('admin') ? 'admin' : 'user',
      });

      const token = generateToken(user._id, user.email, user.name, user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          readingPreferences: user.readingPreferences,
        },
      });
    }

    // In-memory fallback
    if (memoryUsers.has(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newId = 'user_' + Date.now();
    const role = normalizedEmail.includes('admin') ? 'admin' : 'user';

    const newUser = {
      _id: newId,
      id: newId,
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      readingHistory: [],
      readingPreferences: {
        arabicFontSize: 28,
        translationFontSize: 16,
        showUrdu: true,
        showEnglish: true,
        theme: 'emerald',
      },
    };

    memoryUsers.set(normalizedEmail, newUser);
    const token = generateToken(newUser.id, newUser.email, newUser.name, newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        readingPreferences: newUser.readingPreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id, user.email, user.name, user.role);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          readingPreferences: user.readingPreferences,
        },
      });
    }

    // In-memory fallback
    const memUser = memoryUsers.get(normalizedEmail);
    if (!memUser) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, memUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(memUser.id, memUser.email, memUser.name, memUser.role);

    res.json({
      success: true,
      token,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        readingPreferences: memUser.readingPreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile & reading history
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user.id || req.user._id);
      if (user) {
        return res.json({
          success: true,
          data: user,
        });
      }
    }

    // Memory fallback
    const memUser = memoryUsers.get(req.user.email);
    if (memUser) {
      return res.json({
        success: true,
        data: memUser,
      });
    }

    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reading preferences
// @route   PUT /api/auth/preferences
exports.updatePreferences = async (req, res) => {
  try {
    const preferences = req.body;

    if (isDBConnected()) {
      const user = await User.findByIdAndUpdate(
        req.user.id || req.user._id,
        { readingPreferences: preferences },
        { new: true }
      );
      return res.json({ success: true, data: user.readingPreferences });
    }

    const memUser = memoryUsers.get(req.user.email);
    if (memUser) {
      memUser.readingPreferences = { ...memUser.readingPreferences, ...preferences };
      return res.json({ success: true, data: memUser.readingPreferences });
    }

    res.json({ success: true, data: preferences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
