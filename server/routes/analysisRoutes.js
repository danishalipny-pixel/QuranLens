const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// Public routes for Surah and Ayah analysis
router.get('/surah/:surahNumber', (req, res) => analysisController.getSurahAnalysis(req, res));
router.post('/surah/:surahNumber/regenerate', (req, res) => analysisController.regenerateSurahAnalysis(req, res));
router.get('/surah/:surahNumber/report', (req, res) => analysisController.getSurahScienceReport(req, res));

router.get('/ayah/:surahNumber/:ayahNumber', (req, res) => analysisController.getAyahAnalysis(req, res));

// Contextual Chat with Surah & Ayah context and 10 explanation modes
router.post('/chat', (req, res) => analysisController.contextualChat(req, res));

// Scientific sources
router.get('/sources', (req, res) => analysisController.getSources(req, res));
router.post('/sources', (req, res) => analysisController.addSource(req, res));

// Admin / Review routes
router.get('/reports', (req, res) => analysisController.getAllReports(req, res));
router.patch('/reports/:surahNumber/status', (req, res) => analysisController.updateReportStatus(req, res));

// Admin LLM management
router.get('/admin/llm-config', (req, res) => analysisController.getLLMConfig(req, res));
router.post('/admin/llm-config', (req, res) => analysisController.updateLLMConfig(req, res));
router.post('/admin/test-connection', (req, res) => analysisController.testLLMConnection(req, res));

module.exports = router;
