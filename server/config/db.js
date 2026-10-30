const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quranlens';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Fail fast if no local mongo running
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Notice: MongoDB connection failed (${error.message}). QuranLens will operate with built-in high-performance in-memory seed data & live Quran APIs.`);
    return false;
  }
};

const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
