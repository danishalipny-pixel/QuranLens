const topicsData = require('../data/topicsData.json');
const Topic = require('../models/Topic');
const { isDBConnected } = require('../config/db');

// @desc    Get all thematic topics
// @route   GET /api/topics
exports.getAllTopics = async (req, res) => {
  try {
    const { category, search } = req.query;

    let topics = topicsData;

    if (isDBConnected()) {
      try {
        const dbTopics = await Topic.find({});
        if (dbTopics && dbTopics.length > 0) {
          topics = dbTopics;
        }
      } catch (e) {
        // Fallback to topicsData
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
          t.description.toLowerCase().includes(q) ||
          (t.titleUrdu && t.titleUrdu.includes(q))
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

// @desc    Get single topic by slug
// @route   GET /api/topics/:slug
exports.getTopicBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    let topic = topicsData.find((t) => t.slug === slug);

    if (!topic && isDBConnected()) {
      try {
        topic = await Topic.findOne({ slug });
      } catch (e) {
        // Fallback
      }
    }

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    res.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
