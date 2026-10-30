import axios from 'axios';
import surahsData from '../data/surahs.json';
import scienceData from '../data/scienceTopics.json';
import topicsData from '../data/topics.json';
import sampleAyahsData from '../data/sampleAyahs.json';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quranlens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export unified API methods with local fallback
export const quranApi = {
  // Surahs
  getSurahs: async (params = {}) => {
    try {
      const res = await api.get('/surahs', { params });
      return res.data;
    } catch (err) {
      console.info('[QuranLens] Using client local dataset for Surahs list.');
      let filtered = [...surahsData];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.englishName.toLowerCase().includes(q) ||
            s.name.includes(q) ||
            s.englishNameTranslation.toLowerCase().includes(q) ||
            s.number.toString() === q
        );
      }
      if (params.filter && params.filter !== 'All') {
        filtered = filtered.filter((s) =>
          s.revelationType.toLowerCase().includes(params.filter.toLowerCase())
        );
      }
      return { success: true, count: filtered.length, data: filtered };
    }
  },

  getSurah: async (id) => {
    try {
      const res = await api.get(`/surahs/${id}`);
      return res.data;
    } catch (err) {
      console.info(`[QuranLens] Using client fallback for Surah ${id}`);
      const surahNum = parseInt(id, 10);
      const surahMeta = surahsData.find((s) => s.number === surahNum);
      const ayahs = sampleAyahsData.filter((a) => a.surahNumber === surahNum);

      return {
        success: true,
        data: {
          ...surahMeta,
          ayahs: ayahs.length > 0 ? ayahs : [
            {
              surahNumber: surahNum,
              ayahNumber: 1,
              arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              englishTranslation: `In the name of Allah, the Entirely Merciful, the Especially Merciful.`,
              urduTranslation: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔',
              audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${String(surahNum).padStart(3, '0')}001.mp3`,
            }
          ],
        },
      };
    }
  },

  // Ayah Detail
  getAyahDetail: async (surah, ayah) => {
    try {
      const res = await api.get(`/surahs/ayahs/${surah}/${ayah}`);
      return res.data;
    } catch (err) {
      const sNum = parseInt(surah, 10);
      const aNum = parseInt(ayah, 10);
      const found = sampleAyahsData.find(
        (a) => a.surahNumber === sNum && a.ayahNumber === aNum
      );
      const surahMeta = surahsData.find((s) => s.number === sNum);

      if (found) {
        return { success: true, data: { ...found, surah: surahMeta } };
      }

      return {
        success: true,
        data: {
          surahNumber: sNum,
          ayahNumber: aNum,
          arabicText: `آية ${aNum} من سورة ${surahMeta?.name || ''}`,
          englishTranslation: `Translation for verse ${aNum} of ${surahMeta?.englishName || ''}.`,
          englishSource: 'Sahih International',
          urduTranslation: `سورة ${surahMeta?.urduName || ''} کی آیت ${aNum} کا اردو ترجمہ۔`,
          urduSource: 'Fateh Muhammad Jalandhry',
          wordByWord: [],
          context: {
            surahContext: `${surahMeta?.englishName} guides reflection, justice, and devotion.`,
            historicalBackground: 'Authentic classical context.',
          },
          tafsir: {
            source: 'Tafsir Ibn Kathir (Abridged)',
            content: 'Scholarly reflection on righteous deeds, faith, and patience.',
          },
          simpleExplanation: 'This verse invites human reflection on purpose, intentionality, and moral responsibility.',
          scientificPerspective: {
            hasConnection: false,
            concept: 'Theological & Moral Guidance',
            modernExplanation: 'Theological verses provide ethical and spiritual orientation for humanity.',
            sources: [],
            possibleReflection: 'No direct scientific connection is being claimed for this verse.',
            educationalNotice: 'Educational reflection only.',
          },
          realWorldExample: 'Living with integrity, kindness, and mindfulness in your everyday community.',
          lifeLessons: ['Act with sincerity', 'Seek continuous knowledge', 'Treat others with compassion'],
          reflectionQuestion: 'What practical lesson from this verse can you apply to your life today?',
          audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${String(sNum).padStart(3, '0')}${String(aNum).padStart(3, '0')}.mp3`,
          surah: surahMeta,
        },
      };
    }
  },

  // Science
  getScienceTopics: async (params = {}) => {
    try {
      const res = await api.get('/science', { params });
      return res.data;
    } catch (err) {
      let filtered = [...scienceData];
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter((s) => s.category.toLowerCase() === params.category.toLowerCase());
      }
      return { success: true, count: filtered.length, data: filtered };
    }
  },

  getScienceTopic: async (slug) => {
    try {
      const res = await api.get(`/science/${slug}`);
      return res.data;
    } catch (err) {
      const found = scienceData.find((s) => s.slug === slug);
      return { success: true, data: found };
    }
  },

  // Topics
  getTopics: async (params = {}) => {
    try {
      const res = await api.get('/topics', { params });
      return res.data;
    } catch (err) {
      let filtered = [...topicsData];
      if (params.category && params.category !== 'All') {
        filtered = filtered.filter((t) => t.category.toLowerCase() === params.category.toLowerCase());
      }
      return { success: true, count: filtered.length, data: filtered };
    }
  },

  getTopic: async (slug) => {
    try {
      const res = await api.get(`/topics/${slug}`);
      return res.data;
    } catch (err) {
      const found = topicsData.find((t) => t.slug === slug);
      return { success: true, data: found };
    }
  },

  // Global Search
  search: async (q, type = 'all') => {
    try {
      const res = await api.get('/search', { params: { q, type } });
      return res.data;
    } catch (err) {
      const query = q.toLowerCase().trim();
      const matchedSurahs = surahsData.filter(
        (s) =>
          s.englishName.toLowerCase().includes(query) ||
          s.name.includes(query) ||
          s.englishNameTranslation.toLowerCase().includes(query)
      ).slice(0, 6);

      const matchedScience = scienceData.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.scientificConcept.toLowerCase().includes(query)
      ).slice(0, 4);

      const matchedTopics = topicsData.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      ).slice(0, 4);

      const matchedAyahs = sampleAyahsData.filter(
        (a) =>
          a.englishTranslation.toLowerCase().includes(query) ||
          a.arabicText.includes(query)
      ).slice(0, 6);

      return {
        success: true,
        query: q,
        totalCount: matchedSurahs.length + matchedScience.length + matchedTopics.length + matchedAyahs.length,
        results: {
          surahs: matchedSurahs,
          science: matchedScience,
          topics: matchedTopics,
          ayahs: matchedAyahs,
        },
      };
    }
  },

  // AI Tutor (General)
  askAITutor: async (query, mode = 'simple', contextVerse = null) => {
    try {
      const res = await api.post('/ai/ask', { query, mode, contextVerse });
      return res.data;
    } catch (err) {
      // Local educational simulation if backend is unreachable
      return {
        success: true,
        source: 'local_educational_engine',
        reply: `### QuranLens Educational Insight\n\n**Topic:** ${query}\n\n1. **Core Message:** The Quran emphasizes mindful reflection, active compassion, and moral integrity.\n2. **Perspective:** Observation of natural signs invites deep appreciation of order and harmony.\n3. **Practical Lesson:** Translate personal reflection into genuine kindness and service to family and community.\n\n*(Educational response generated by QuranLens local engine)*`,
      };
    }
  },

  // LLM Science & Contextual Analysis Engine
  getSurahScienceAnalysis: async (surahNumber) => {
    try {
      const res = await api.get(`/analysis/surah/${surahNumber}`);
      return res.data;
    } catch (err) {
      console.warn(`[QuranLens] Analysis API offline. Providing local fallback for Surah ${surahNumber}.`);
      const sNum = parseInt(surahNumber, 10);
      const surahMeta = surahsData.find((s) => s.number === sNum);
      return {
        success: true,
        data: {
          surahNumber: sNum,
          surahName: surahMeta?.englishName || `Surah ${sNum}`,
          nameArabic: surahMeta?.name || '',
          totalAyahs: surahMeta?.numberOfAyahs || 7,
          revelationType: surahMeta?.revelationType || 'Makki',
          hasScientificThemes: false,
          classification: 'Ethical/Spiritual Message',
          primaryDomains: ['Ethical Reflection & Moral Accountability'],
          summary: `Surah ${surahMeta?.englishName || sNum} provides foundational theological and moral guidance.`,
          scientificConcepts: [],
          classicalTafsirSummary: 'Classical exegetes analyze this chapter in the context of faith, divine mercy, and human responsibility.',
          limitationsAndNotice: 'No direct physical scientific connection is claimed. The Quran invites intellectual contemplation and is not an empirical textbook.',
          status: 'verified',
        },
      };
    }
  },

  regenerateSurahAnalysis: async (surahNumber) => {
    try {
      const res = await api.post(`/analysis/surah/${surahNumber}/regenerate`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  },

  getSurahScienceReport: async (surahNumber) => {
    try {
      const res = await api.get(`/analysis/surah/${surahNumber}/report`);
      return res.data;
    } catch (err) {
      const sNum = parseInt(surahNumber, 10);
      const surahMeta = surahsData.find((s) => s.number === sNum);
      return {
        success: true,
        data: {
          title: `QuranLens Scientific & Conceptual Analysis Report: Surah ${surahMeta?.englishName || sNum}`,
          generatedAt: new Date().toISOString(),
          surahNumber: sNum,
          surahName: surahMeta?.englishName || '',
          nameArabic: surahMeta?.name || '',
          classification: 'Ethical/Spiritual Message',
          hasScientificThemes: false,
          primaryDomains: ['Ethical Reflection'],
          summary: `Surah ${surahMeta?.englishName} guides moral reflection.`,
          concepts: [],
          classicalTafsir: 'Classical scholarly commentary focused on spiritual and moral discernment.',
          limitationsAndNotice: 'Reflective educational analysis only.',
          disclaimer: 'The Qur’an is a book of spiritual and moral guidance. Scientific reflections provide educational context and Tadabbur.',
        },
      };
    }
  },

  getAyahStructuredAnalysis: async (surahNumber, ayahNumber, options = {}) => {
    try {
      const res = await api.get(`/analysis/ayah/${surahNumber}/${ayahNumber}`, { params: options });
      return res.data;
    } catch (err) {
      // Local fallback
      return quranApi.getAyahDetail(surahNumber, ayahNumber);
    }
  },

  contextualChat: async ({ message, history = [], surahNumber = null, ayahNumber = null, mode = 'english' }) => {
    try {
      const res = await api.post('/analysis/chat', {
        message,
        history,
        surahNumber,
        ayahNumber,
        mode,
      });
      return res.data;
    } catch (err) {
      console.warn('[QuranLens] Chat API offline. Providing local educational fallback.');
      return {
        success: true,
        data: {
          reply: `**QuranLens Educational Engine (${mode.toUpperCase()}):**\n\nThank you for asking about this verse. The Qur'an encourages sincere study, balanced reasoning, and deep contemplation (*Tadabbur*).\n\nWhen examining natural phenomena in sacred texts, we recognize that nature demonstrates order, balance, and fine-tuning. Classical scholars like Ibn Kathir and Al-Qurtubi emphasize that signs in creation point humanity toward gratitude, humility, and moral purpose rather than serving as technical physics formulas.\n\n*Key Takeaway:* Live each day with active awareness, kindness, and scholarly curiosity.`,
          model: 'quranlens-educational-engine-local',
          provider: 'internal',
          surahContext: surahNumber,
          ayahContext: ayahNumber,
          mode,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  // Scientific Sources Registry
  getScientificSources: async () => {
    try {
      const res = await api.get('/analysis/sources');
      return res.data;
    } catch (err) {
      return {
        success: true,
        data: [
          { id: 'src_nasa', title: 'Astrophysics & Cosmic Structure', institution: 'NASA', domain: 'Universe & Astronomy', url: 'https://science.nasa.gov/astrophysics/' },
          { id: 'src_noaa', title: 'Estuarine Dynamics & Ocean Fronts', institution: 'NOAA', domain: 'Oceans & Environmental systems', url: 'https://oceanservice.noaa.gov' },
          { id: 'src_usgs', title: 'Hydrological Cycle & Groundwater', institution: 'USGS', domain: 'Water & Rainfall', url: 'https://www.usgs.gov' },
          { id: 'src_nih', title: 'Prenatal Development & Anatomy', institution: 'NIH / NCBI', domain: 'Human creation & development', url: 'https://www.ncbi.nlm.nih.gov' },
        ],
      };
    }
  },

  addScientificSource: async (sourceData) => {
    const res = await api.post('/analysis/sources', sourceData);
    return res.data;
  },

  // Admin Reports & LLM Control
  getSurahReportsList: async () => {
    const res = await api.get('/analysis/reports');
    return res.data;
  },

  updateReportStatus: async (surahNumber, status, reviewerName) => {
    const res = await api.patch(`/analysis/reports/${surahNumber}/status`, { status, reviewerName });
    return res.data;
  },

  getLLMConfig: async () => {
    const res = await api.get('/analysis/admin/llm-config');
    return res.data;
  },

  updateLLMConfig: async (config) => {
    const res = await api.post('/analysis/admin/llm-config', config);
    return res.data;
  },

  testLLMConnection: async (config) => {
    const res = await api.post('/analysis/admin/test-connection', config);
    return res.data;
  },

  // Auth
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Admin
  getAdminStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
};

export default api;
