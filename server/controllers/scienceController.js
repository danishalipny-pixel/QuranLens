const scienceData = require('../data/scienceData.json');
const ScienceTopic = require('../models/ScienceTopic');
const { isDBConnected } = require('../config/db');

// @desc    Get all science topics
// @route   GET /api/science
exports.getAllScienceTopics = async (req, res) => {
  try {
    const { category, search } = req.query;

    let topics = scienceData;

    if (isDBConnected()) {
      try {
        const dbTopics = await ScienceTopic.find({});
        if (dbTopics && dbTopics.length > 0) {
          topics = dbTopics;
        }
      } catch (e) {
        // Fallback to scienceData
      }
    }

    let filtered = [...topics];

    if (category && category !== 'All') {
      filtered = filtered.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.scientificConcept.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single science topic by slug
// @route   GET /api/science/:slug
exports.getScienceTopicBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    let topic = scienceData.find((t) => t.slug === slug);

    if (!topic && isDBConnected()) {
      try {
        topic = await ScienceTopic.findOne({ slug });
      } catch (e) {
        // Fallback
      }
    }

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Science topic not found' });
    }

    res.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
