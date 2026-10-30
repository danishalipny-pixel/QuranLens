const surahsData = require('../data/surahsData.json');
const scienceData = require('../data/scienceData.json');
const topicsData = require('../data/topicsData.json');
const sampleAyahsData = require('../data/sampleAyahsData.json');

// @desc    Global search across Surahs, Ayahs, Science, and Topics
// @route   GET /api/search
exports.globalSearch = (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        query: '',
        results: {
          surahs: [],
          ayahs: [],
          science: [],
          topics: [],
        },
      });
    }

    const query = q.toLowerCase().trim();

    // 1. Search Surahs
    const matchedSurahs = surahsData
      .filter(
        (s) =>
          s.englishName.toLowerCase().includes(query) ||
          s.name.includes(query) ||
          (s.urduName && s.urduName.includes(query)) ||
          s.englishNameTranslation.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.number.toString() === query
      )
      .slice(0, 8);

    // 2. Search Ayahs in rich sample database
    const matchedAyahs = sampleAyahsData
      .filter(
        (a) =>
          a.arabicText.includes(query) ||
          a.englishTranslation.toLowerCase().includes(query) ||
          a.urduTranslation.includes(query) ||
          (a.simpleExplanation && a.simpleExplanation.toLowerCase().includes(query)) ||
          (a.scientificPerspective?.concept &&
            a.scientificPerspective.concept.toLowerCase().includes(query))
      )
      .slice(0, 10);

    // 3. Search Science topics
    const matchedScience = scienceData
      .filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.scientificConcept.toLowerCase().includes(query) ||
          s.summary.toLowerCase().includes(query) ||
          s.modernScientificExplanation.toLowerCase().includes(query) ||
          s.keyFacts.some((f) => f.toLowerCase().includes(query))
      )
      .slice(0, 6);

    // 4. Search Thematic topics
    const matchedTopics = topicsData
      .filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.titleUrdu && t.titleUrdu.includes(query)) ||
          t.description.toLowerCase().includes(query) ||
          t.corePrinciples.some((p) => p.toLowerCase().includes(query))
      )
      .slice(0, 6);

    // Filter by type if specified
    const results = {};
    if (!type || type === 'all' || type === 'surahs') results.surahs = matchedSurahs;
    if (!type || type === 'all' || type === 'ayahs') results.ayahs = matchedAyahs;
    if (!type || type === 'all' || type === 'science') results.science = matchedScience;
    if (!type || type === 'all' || type === 'topics') results.topics = matchedTopics;

    const totalCount =
      (results.surahs?.length || 0) +
      (results.ayahs?.length || 0) +
      (results.science?.length || 0) +
      (results.topics?.length || 0);

    res.json({
      success: true,
      query: q,
      totalCount,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
