const surahScienceService = require('../services/surahScienceService');
const ayahAnalysisService = require('../services/ayahAnalysisService');
const sourceRegistryService = require('../services/sourceRegistryService');
const llmManager = require('../services/llm/LLMManager');
const surahsData = require('../data/surahsData.json');

/**
 * Controller for Scientific Perspectives, Ayah 12-point Analysis,
 * Contextual Chat, and LLM Engine Management.
 */
class AnalysisController {
  /**
   * GET /api/analysis/surah/:surahNumber
   * Retrieve scientific perspective analysis for any Surah (1-114)
   */
  async getSurahAnalysis(req, res) {
    try {
      const { surahNumber } = req.params;
      const report = await surahScienceService.getSurahAnalysis(surahNumber);
      return res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('[AnalysisController getSurahAnalysis]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve Surah scientific analysis.',
      });
    }
  }

  /**
   * POST /api/analysis/surah/:surahNumber/regenerate
   * On-demand live scientific re-analysis of a Surah using LLM engine
   */
  async regenerateSurahAnalysis(req, res) {
    try {
      const { surahNumber } = req.params;
      const report = await surahScienceService.regenerateSurahAnalysis(surahNumber);
      return res.json({
        success: true,
        message: `Surah ${surahNumber} scientific analysis re-evaluated successfully.`,
        data: report,
      });
    } catch (error) {
      console.error('[AnalysisController regenerateSurahAnalysis]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to regenerate analysis.',
      });
    }
  }

  /**
   * GET /api/analysis/surah/:surahNumber/report
   * Structured report payload formatted for view / PDF export
   */
  async getSurahScienceReport(req, res) {
    try {
      const { surahNumber } = req.params;
      const report = await surahScienceService.getSurahAnalysis(surahNumber);
      const surahMeta = surahsData.find((s) => s.number === parseInt(surahNumber, 10));

      const printableReport = {
        title: `QuranLens Scientific & Conceptual Analysis Report: Surah ${surahMeta?.englishName || surahNumber}`,
        generatedAt: report.generatedAt || new Date().toISOString(),
        surahNumber: parseInt(surahNumber, 10),
        surahName: surahMeta?.englishName || '',
        nameArabic: surahMeta?.name || '',
        classification: report.classification,
        hasScientificThemes: report.hasScientificThemes,
        primaryDomains: report.primaryDomains || [],
        summary: report.summary,
        concepts: report.scientificConcepts || [],
        classicalTafsir: report.classicalTafsirSummary,
        limitationsAndNotice: report.limitationsAndNotice,
        verifiedSources: sourceRegistryService.getAllSources().slice(0, 5),
        disclaimer: 'The Qur’an is a book of spiritual, moral, and theological guidance. Scientific reflections provide educational context and Tadabbur without claiming final empirical proof.',
      };

      return res.json({
        success: true,
        data: printableReport,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to build Surah science report.',
      });
    }
  }

  /**
   * GET /api/analysis/ayah/:surahNumber/:ayahNumber
   * 12-point comprehensive analysis of an Ayah
   */
  async getAyahAnalysis(req, res) {
    try {
      const { surahNumber, ayahNumber } = req.params;
      const { mode, useAI } = req.query;

      const analysis = await ayahAnalysisService.getAyahStructuredAnalysis(
        surahNumber,
        ayahNumber,
        { mode, useAI: useAI === 'true' }
      );

      return res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      console.error('[AnalysisController getAyahAnalysis]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve Ayah analysis.',
      });
    }
  }

  /**
   * POST /api/analysis/chat
   * Contextual multi-turn AI Chat with Surah & Ayah awareness and 10 explanation modes
   */
  async contextualChat(req, res) {
    try {
      const {
        message,
        history = [],
        surahNumber,
        ayahNumber,
        mode = 'english',
      } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Message cannot be empty.',
        });
      }

      // Build context information if active Surah or Ayah is provided
      let contextPrompt = '';
      if (surahNumber) {
        const sNum = parseInt(surahNumber, 10);
        const sMeta = surahsData.find((s) => s.number === sNum);
        if (sMeta) {
          contextPrompt += `\n[CURRENT STUDY CONTEXT: Surah ${sMeta.number} - ${sMeta.englishName} (${sMeta.name}), Type: ${sMeta.revelationType}, Ayahs: ${sMeta.numberOfAyahs}]`;
        }
      }
      if (surahNumber && ayahNumber) {
        try {
          const ayahInfo = await ayahAnalysisService.getAyahStructuredAnalysis(surahNumber, ayahNumber);
          contextPrompt += `\n[CURRENT AYAH: ${ayahInfo.surahName} ${surahNumber}:${ayahNumber}]
Arabic: ${ayahInfo.arabicText}
English: ${ayahInfo.englishTranslation}
Urdu: ${ayahInfo.urduTranslation}
Scientific Classification: ${ayahInfo.scientificClassification}`;
        } catch (e) {
          // ignore context retrieval failure
        }
      }

      // 10 explanation mode guidelines
      let modeGuideline = '';
      switch (mode) {
        case 'simple-urdu':
        case 'urdu':
          modeGuideline = 'Explain clearly and respectfully in Urdu (نستعلیق / سادہ اردو). Use authentic terminology and clear everyday phrasing.';
          break;
        case 'eli10':
          modeGuideline = 'Explain Like I am 10 years old. Use simple words, relatable metaphors, warm conversational tone, and gentle curiosity.';
          break;
        case 'scientific':
          modeGuideline = 'Provide a structured scientific analysis. Note physical phenomena, cite real scientific bodies (NASA, NOAA, WHO, NIH, etc.), and observe strict distinction between divine text and empirical hypotheses. Never say science proves the Quran.';
          break;
        case 'real-life':
          modeGuideline = 'Provide practical, everyday real-life examples and tangible modern applications of the lesson.';
          break;
        case 'tafsir':
          modeGuideline = 'Provide classical Tafsir commentary (referencing Ibn Kathir, Tabari, Qurtubi) explaining classical scholarly context and linguistic nuance.';
          break;
        case 'word-by-word':
          modeGuideline = 'Provide a word-by-word linguistic breakdown with Arabic root letters, grammatical role, and nuanced meaning.';
          break;
        case 'historical':
          modeGuideline = 'Explain the historical background, Asbab al-Nuzul (occasions of revelation), and societal context of 7th century Arabia.';
          break;
        case 'lessons':
          modeGuideline = 'Highlight 3 to 5 actionable character lessons and contemplative takeaways for everyday personal development.';
          break;
        case 'follow-up':
          modeGuideline = 'Answer the question directly, and propose 2 to 3 insightful follow-up questions to stimulate deeper contemplation (Tadabbur).';
          break;
        case 'english':
        default:
          modeGuideline = 'Explain clearly, objectively, and educationally in fluent English.';
          break;
      }

      // Prepare conversation messages
      const systemMessage = {
        role: 'system',
        content: `${llmManager.getDefaultSystemPrompt()}\n\nMODE INSTRUCTION: ${modeGuideline}${contextPrompt ? `\n${contextPrompt}` : ''}`,
      };

      const formattedHistory = Array.isArray(history)
        ? history.slice(-6).map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content || msg.text || '',
          }))
        : [];

      const fullMessages = [
        systemMessage,
        ...formattedHistory,
        { role: 'user', content: message },
      ];

      const response = await llmManager.generateChat(fullMessages, { mode });

      return res.json({
        success: true,
        data: {
          reply: response.content,
          model: response.model,
          provider: response.provider,
          surahContext: surahNumber || null,
          ayahContext: ayahNumber || null,
          mode,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('[AnalysisController contextualChat]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'AI Chat encounter an error.',
      });
    }
  }

  /**
   * GET /api/analysis/reports
   * List all Surah reports with status
   */
  async getAllReports(req, res) {
    try {
      const reports = surahScienceService.getAllReports();
      return res.json({
        success: true,
        count: reports.length,
        data: reports,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PATCH /api/analysis/reports/:surahNumber/status
   * Review, approve, or reject an analysis report
   */
  async updateReportStatus(req, res) {
    try {
      const { surahNumber } = req.params;
      const { status, reviewerName } = req.body;

      if (!['verified', 'rejected', 'under-review', 'ai-generated'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be: verified, rejected, under-review, or ai-generated.',
        });
      }

      const updated = surahScienceService.updateReportStatus(
        surahNumber,
        status,
        reviewerName || req.user?.name || 'Administrator'
      );

      return res.json({
        success: true,
        message: `Report for Surah ${surahNumber} status updated to '${status}'.`,
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/analysis/sources
   * Get all registered scientific sources
   */
  async getSources(req, res) {
    try {
      const sources = sourceRegistryService.getAllSources();
      return res.json({
        success: true,
        count: sources.length,
        data: sources,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/analysis/sources
   * Add a new verified scientific source
   */
  async addSource(req, res) {
    try {
      const newSource = sourceRegistryService.addSource(req.body);
      return res.status(201).json({
        success: true,
        message: 'Scientific research source added successfully.',
        data: newSource,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/analysis/admin/llm-config
   * Retrieve current LLM configuration and status
   */
  async getLLMConfig(req, res) {
    try {
      const config = llmManager.getConfig();
      return res.json({
        success: true,
        data: config,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/analysis/admin/llm-config
   * Update active LLM configuration
   */
  async updateLLMConfig(req, res) {
    try {
      const updated = llmManager.updateConfig(req.body);
      return res.json({
        success: true,
        message: 'LLM Configuration updated successfully.',
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/analysis/admin/test-connection
   * Test LLM provider connection
   */
  async testLLMConnection(req, res) {
    try {
      const testResult = await llmManager.testConnection(req.body);
      return res.json({
        success: true,
        data: testResult,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'LLM connection test failed.',
      });
    }
  }
}

module.exports = new AnalysisController();
