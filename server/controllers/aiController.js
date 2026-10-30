const { askAITutor } = require('../services/openaiService');

// @desc    Ask AI Tutor
// @route   POST /api/ai/ask
exports.askTutor = async (req, res) => {
  try {
    const { query, mode, contextVerse } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or prompt for the AI tutor.',
      });
    }

    const result = await askAITutor({
      query: query.trim(),
      mode: mode || 'simple',
      contextVerse: contextVerse || null,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process AI tutor query. ' + error.message,
    });
  }
};
