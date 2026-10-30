const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Surah = require('../models/Surah');
const ScienceTopic = require('../models/ScienceTopic');
const Topic = require('../models/Topic');
const Ayah = require('../models/Ayah');
const surahsData = require('../data/surahsData.json');
const scienceData = require('../data/scienceData.json');
const topicsData = require('../data/topicsData.json');
const sampleAyahsData = require('../data/sampleAyahsData.json');

dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quranlens';
  try {
    console.log(`Connecting to MongoDB at: ${uri}...`);
    await mongoose.connect(uri);
    console.log('MongoDB Connected. Seeding collections...');

    // Clear existing data
    await Surah.deleteMany({});
    await ScienceTopic.deleteMany({});
    await Topic.deleteMany({});
    await Ayah.deleteMany({});

    // Seed
    await Surah.insertMany(surahsData);
    console.log(`Inserted ${surahsData.length} Surahs.`);

    await ScienceTopic.insertMany(scienceData);
    console.log(`Inserted ${scienceData.length} Science Topics.`);

    await Topic.insertMany(topicsData);
    console.log(`Inserted ${topicsData.length} Thematic Topics.`);

    await Ayah.insertMany(sampleAyahsData);
    console.log(`Inserted ${sampleAyahsData.length} Detailed Sample Ayahs.`);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
