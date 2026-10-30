import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Database,
  Users,
  Bot,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Server,
  Layers,
  BarChart3,
  ExternalLink,
  Settings,
  Sliders,
  Key,
  RefreshCw,
  Plus,
  Check,
  X,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { quranApi } from '../services/api';
import scienceData from '../data/scienceTopics.json';
import topicsData from '../data/topics.json';
import surahsData from '../data/surahs.json';

export default function AdminPage() {
  const { isUrdu } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalSurahs: 114,
    totalScienceTopics: scienceData.length,
    totalThematicTopics: topicsData.length,
    totalVerifiedAyahModules: 15,
    totalUsers: 2,
    aiTutorStatus: 'Active',
    databaseStatus: 'Active (Hybrid Store)',
  });

  const [activeAdminTab, setActiveAdminTab] = useState('llm-config'); // llm-config, reports-review, sources, overview, prompts, science, topics, surahs

  // LLM Config state
  const [llmConfig, setLlmConfig] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('internal');
  const [selectedModel, setSelectedModel] = useState('quranlens-educational-engine-v2');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(2500);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [testStatus, setTestStatus] = useState(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState(null);

  // Reports review state
  const [reportsList, setReportsList] = useState([]);
  const [reportsSearch, setReportsSearch] = useState('');
  const [regeneratingSurah, setRegeneratingSurah] = useState(null);

  // Sources registry state
  const [sourcesList, setSourcesList] = useState([]);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [newSource, setNewSource] = useState({
    title: '',
    institution: '',
    domain: 'Universe & Astronomy',
    url: '',
    description: '',
  });

  useEffect(() => {
    // Load general stats
    quranApi.getAdminStats().then((res) => {
      if (res?.success && res?.data) {
        setStats(res.data);
      }
    });

    // Load LLM configuration
    quranApi.getLLMConfig().then((res) => {
      if (res?.success && res?.data) {
        setLlmConfig(res.data);
        setSelectedProvider(res.data.provider || 'internal');
        setSelectedModel(res.data.model || 'quranlens-educational-engine-v2');
        setTemperature(res.data.temperature || 0.3);
        setMaxTokens(res.data.maxTokens || 2500);
        setSystemPrompt(res.data.systemPrompt || '');
      }
    });

    // Load Surah reports
    quranApi.getSurahReportsList().then((res) => {
      if (res?.success && res?.data) {
        setReportsList(res.data);
      }
    });

    // Load sources
    quranApi.getScientificSources().then((res) => {
      if (res?.success && res?.data) {
        setSourcesList(res.data);
      }
    });
  }, []);

  const handleSaveLLMConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigSuccessMsg(null);
    try {
      const res = await quranApi.updateLLMConfig({
        provider: selectedProvider,
        model: selectedModel,
        apiKey: apiKeyInput,
        temperature,
        maxTokens,
        systemPrompt,
      });
      if (res?.success && res?.data) {
        setLlmConfig(res.data);
        setConfigSuccessMsg('LLM Engine configuration updated successfully!');
        setTimeout(() => setConfigSuccessMsg(null), 4000);
      }
    } catch (err) {
      alert('Failed to save LLM configuration: ' + err.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });
    try {
      const res = await quranApi.testLLMConnection({
        provider: selectedProvider,
        model: selectedModel,
        apiKey: apiKeyInput,
      });
      setTestStatus({
        loading: false,
        success: res?.data?.success !== false,
        message: res?.data?.message || 'Connection test successful!',
        latencyMs: res?.data?.latencyMs,
      });
    } catch (err) {
      setTestStatus({
        loading: false,
        success: false,
        message: err.response?.data?.message || err.message,
      });
    }
  };

  const handleUpdateReportStatus = async (surahNumber, status) => {
    try {
      const res = await quranApi.updateReportStatus(surahNumber, status, user?.name || 'Administrator');
      if (res?.success) {
        setReportsList((prev) =>
          prev.map((r) => (r.surahNumber === parseInt(surahNumber, 10) ? { ...r, status } : r))
        );
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleRegenerateReport = async (surahNumber) => {
    setRegeneratingSurah(surahNumber);
    try {
      const res = await quranApi.regenerateSurahAnalysis(surahNumber);
      if (res?.success) {
        // Refresh reports list
        const updatedList = await quranApi.getSurahReportsList();
        if (updatedList?.data) setReportsList(updatedList.data);
        alert(`Surah ${surahNumber} re-evaluated by LLM successfully.`);
      }
    } catch (err) {
      alert('Failed to regenerate: ' + err.message);
    } finally {
      setRegeneratingSurah(null);
    }
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    try {
      const res = await quranApi.addScientificSource(newSource);
      if (res?.success && res?.data) {
        setSourcesList((prev) => [...prev, res.data]);
        setShowAddSourceModal(false);
        setNewSource({
          title: '',
          institution: '',
          domain: 'Universe & Astronomy',
          url: '',
          description: '',
        });
      }
    } catch (err) {
      alert('Failed to add source: ' + err.message);
    }
  };

  const filteredReports = reportsList.filter((r) =>
    r.surahName.toLowerCase().includes(reportsSearch.toLowerCase()) ||
    r.surahNumber.toString() === reportsSearch.trim() ||
    r.classification?.toLowerCase().includes(reportsSearch.toLowerCase())
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-300 dark:border-charcoal-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 border border-gold-300 dark:border-gold-800/60 text-gold-900 dark:text-gold-300 text-xs font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مرکزی ایڈمن کنٹرول پینل' : 'Administrator Control Center'}</span>
          </div>
          <h1 className={`text-3xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-950 dark:text-emerald-200' : 'font-serif text-charcoal-900 dark:text-white'}`}>
            {isUrdu ? 'اے آئی انجن، ماڈلز اور سائنسی مآخذ کا انتظام' : 'AI Engine & Science Management'}
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            {isUrdu
              ? 'ایل ایل ایم فراہم کنندگان کو ترتیب دیں، ۱۱۴ سورتوں کے سائنسی تجزیات کا جائزہ لیں، اور مستند سائنسی مآخذ کو منظم کریں۔'
              : 'Configure LLM provider models, manage system prompts, review 114 Surah analyses, and curate scientific references.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {isUrdu ? 'سسٹم مکمل فعال ہے' : 'System Operational'}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { labelUrdu: 'فعال اے آئی ماڈل', labelEn: 'Active LLM Provider', value: llmConfig?.provider?.toUpperCase() || 'INTERNAL', sub: llmConfig?.model || 'Educational Engine', icon: Bot, color: 'text-emerald-700' },
          { labelUrdu: 'کل سائنسی تجزیات', labelEn: 'Total Analyses', value: `${reportsList.length} / 114`, sub: isUrdu ? '۱۱۴ سورتوں کا جائزہ' : 'Surahs Evaluated', icon: Sparkles, color: 'text-gold-600' },
          { labelUrdu: 'مستند سائنسی حوالہ جات', labelEn: 'Research Citations', value: sourcesList.length, sub: 'NASA, NOAA, NIH, etc.', icon: BookOpen, color: 'text-indigo-600' },
          { labelUrdu: 'موصولہ اے آئی سوالات', labelEn: 'API Requests Handled', value: llmConfig?.usageStats?.totalRequests || 0, sub: `${llmConfig?.usageStats?.successfulRequests || 0} ${isUrdu ? 'کامیاب' : 'Successful'}`, icon: BarChart3, color: 'text-teal-600' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-charcoal-500">{isUrdu ? m.labelUrdu : m.labelEn}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-2xl font-bold text-charcoal-900 dark:text-white font-serif">{m.value}</div>
              <div className="text-[11px] text-charcoal-400 mt-1">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-charcoal-800 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'llm-config', labelUrdu: 'ایل ایل ایم پرووائیڈر و ماڈل', labelEn: 'LLM Provider & Model Architecture' },
          { id: 'reports-review', labelUrdu: `سورتوں کے تجزیاتی جائزے (${reportsList.length})`, labelEn: `Surah Reports Review (${reportsList.length})` },
          { id: 'sources', labelUrdu: `سائنسی مآخذ کا اندراج (${sourcesList.length})`, labelEn: `Scientific Sources Registry (${sourcesList.length})` },
          { id: 'prompts', labelUrdu: 'حفاظتی ہدایات و سسٹمک پرامپٹس', labelEn: 'Safety Rails & System Prompts' },
          { id: 'overview', labelUrdu: 'پلیٹ فارم کا تکنیکی جائزہ', labelEn: 'Platform Architecture' },
          { id: 'science', labelUrdu: `منتخب سائنسی موضوعات (${scienceData.length})`, labelEn: `Curated Science Topics (${scienceData.length})` },
          { id: 'topics', labelUrdu: `فکری و اخلاقی موضوعات (${topicsData.length})`, labelEn: `Thematic Topics (${topicsData.length})` },
          { id: 'surahs', labelUrdu: '۱۱۴ سورتوں کی فہرست', labelEn: 'Surah Catalog (114)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
            }`}
          >
            {isUrdu ? tab.labelUrdu : tab.labelEn}
          </button>
        ))}
      </div>

      {/* TAB 1: LLM PROVIDER & MODEL ARCHITECTURE */}
      {activeAdminTab === 'llm-config' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveLLMConfig} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
              <div>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-700" />
                  <span>Modular LLM Provider Settings</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-1">
                  Configure live AI providers (OpenAI GPT, Google Gemini, Anthropic Claude, or QuranLens Internal Educational Engine).
                </p>
              </div>

              {configSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>{configSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">
                  LLM Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    const prov = e.target.value;
                    setSelectedProvider(prov);
                    if (prov === 'openai') setSelectedModel('gpt-4o-mini');
                    else if (prov === 'gemini') setSelectedModel('gemini-1.5-flash');
                    else if (prov === 'anthropic') setSelectedModel('claude-3-5-sonnet-20241022');
                    else setSelectedModel('quranlens-educational-engine-v2');
                  }}
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-emerald-600"
                >
                  <option value="internal">QuranLens Internal Educational Engine (Built-in, Resilient)</option>
                  <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                  <option value="gemini">Google Gemini (Gemini 1.5 Flash, Gemini 1.5 Pro, Gemini 2.0 Flash)</option>
                  <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet, Claude 3 Haiku)</option>
                </select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">
                  Target Model Name
                </label>
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="e.g. gpt-4o-mini, gemini-1.5-flash"
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400 flex items-center justify-between">
                  <span>API Key</span>
                  {llmConfig?.hasApiKey && (
                    <span className="text-[10px] text-emerald-600 font-normal">
                      Stored: {llmConfig.apiKeyMasked}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={llmConfig?.hasApiKey ? "Leave blank to keep current key" : "Paste API Key (sk-..., AIza..., etc.)"}
                    className="w-full pl-9 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              {/* Temperature & Max Tokens */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400 flex items-center justify-between">
                    <span>Temperature</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400">{temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">
                    Max Tokens Limit
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="8000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                    className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl px-4 py-2 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

            </div>

            {/* System Prompt Editor */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400 flex items-center justify-between">
                <span>Core Safety System Prompt</span>
                <span className="text-[11px] text-charcoal-400">Enforces religious boundaries & scientific accuracy</span>
              </label>
              <textarea
                rows="6"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full font-mono text-xs p-4 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-2xl text-charcoal-800 dark:text-charcoal-200 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-ivory-200 dark:border-charcoal-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus?.loading}
                  className="px-4 py-2.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 hover:bg-ivory-200 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-charcoal-200 font-semibold text-xs flex items-center gap-1.5 transition border border-ivory-300 dark:border-charcoal-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus?.loading ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>

                {testStatus && (
                  <span className={`text-xs font-semibold ${testStatus.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {testStatus.message} {testStatus.latencyMs && `(${testStatus.latencyMs}ms)`}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                <span>{savingConfig ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </form>

          {/* Usage & Error Log Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Engine Health & Request Diagnostics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800 space-y-1">
                <span className="text-charcoal-400">Successful Calls</span>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {llmConfig?.usageStats?.successfulRequests || 0}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800 space-y-1">
                <span className="text-charcoal-400">Failed / Fallback Calls</span>
                <div className="text-xl font-bold text-charcoal-700 dark:text-charcoal-300">
                  {llmConfig?.usageStats?.failedRequests || 0}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800 space-y-1">
                <span className="text-charcoal-400">Last Active Timestamp</span>
                <div className="text-xs font-mono text-charcoal-600 dark:text-charcoal-400">
                  {llmConfig?.usageStats?.lastRequestTime ? new Date(llmConfig.usageStats.lastRequestTime).toLocaleTimeString() : 'Ready'}
                </div>
              </div>
            </div>

            {llmConfig?.usageStats?.lastError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Last Error: {llmConfig.usageStats.lastError.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SURAH REPORTS REVIEW & APPROVAL */}
      {activeAdminTab === 'reports-review' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-charcoal-900 dark:text-white">
                Surah Science Perspective Reports Review
              </h3>
              <p className="text-xs text-charcoal-500">
                Inspect classifications, approve editorial analyses, and trigger live re-evaluations.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={reportsSearch}
                onChange={(e) => setReportsSearch(e.target.value)}
                placeholder="Search Surah name, number, classification..."
                className="pl-9 pr-4 py-2 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-emerald-600 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-600 dark:text-charcoal-300 divide-y divide-ivory-200 dark:divide-charcoal-800">
              <thead className="bg-ivory-100 dark:bg-charcoal-950 font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-400">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Surah</th>
                  <th className="p-3.5">Relevance Classification</th>
                  <th className="p-3.5">Has Science Themes</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100 dark:divide-charcoal-800">
                {filteredReports.map((report) => (
                  <tr key={report.surahNumber} className="hover:bg-ivory-50 dark:hover:bg-charcoal-800/40">
                    <td className="p-3.5 font-bold font-mono">{report.surahNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-charcoal-900 dark:text-white">
                        {report.surahName}
                      </div>
                      <div className="font-arabic text-emerald-800 dark:text-emerald-300">
                        {report.nameArabic}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 border border-ivory-200 dark:border-charcoal-700">
                        {report.classification || 'Natural phenomenon'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {report.hasScientificThemes ? (
                        <span className="text-emerald-700 font-semibold">Yes</span>
                      ) : (
                        <span className="text-charcoal-400">No (Ethical/Moral)</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        report.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : report.status === 'rejected'
                          ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-gold-100 text-gold-900 dark:bg-gold-950 dark:text-gold-300'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {report.status !== 'verified' && (
                        <button
                          onClick={() => handleUpdateReportStatus(report.surahNumber, 'verified')}
                          className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-semibold transition"
                          title="Approve Report"
                        >
                          Approve
                        </button>
                      )}
                      {report.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReportStatus(report.surahNumber, 'rejected')}
                          className="px-2.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-semibold transition"
                          title="Reject Report"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleRegenerateReport(report.surahNumber)}
                        disabled={regeneratingSurah === report.surahNumber}
                        className="px-2.5 py-1 rounded bg-ivory-200 dark:bg-charcoal-700 hover:bg-ivory-300 text-charcoal-800 dark:text-charcoal-200 text-[11px] font-semibold transition"
                        title="Regenerate with LLM"
                      >
                        {regeneratingSurah === report.surahNumber ? '...' : 'Regenerate'}
                      </button>
                      <Link
                        to={`/surah/${report.surahNumber}#science`}
                        className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-semibold transition inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCIENTIFIC RESEARCH SOURCES REGISTRY */}
      {activeAdminTab === 'sources' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
              <div>
                <h3 className="text-lg font-bold font-serif text-charcoal-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <span>Approved Scientific Research Sources & Institutions</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-1">
                  Prioritizing NASA, NOAA, WHO, NIH, Nature, USGS, and peer-reviewed academic literature.
                </p>
              </div>

              <button
                onClick={() => setShowAddSourceModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Research Source</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sourcesList.map((src) => (
                <div
                  key={src.id}
                  className="p-5 rounded-2xl border border-ivory-200 dark:border-charcoal-800 bg-ivory-50/50 dark:bg-charcoal-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300">
                      {src.domain}
                    </span>
                    <span className="text-[11px] text-charcoal-400">
                      Verified Repository
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-charcoal-900 dark:text-white">
                    {src.title}
                  </h4>

                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    {src.institution}
                  </p>

                  {src.description && (
                    <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                      {src.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-ivory-200 dark:border-charcoal-700 flex items-center justify-between">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Visit Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: OVERVIEW & HEALTH */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-800 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Backend & Database Infrastructure</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-ivory-100 dark:border-charcoal-800">
                <span className="text-charcoal-500">Node / Express API:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Port 5000 (Operational)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-100 dark:border-charcoal-800">
                <span className="text-charcoal-500">Database Layer:</span>
                <span className="font-semibold text-charcoal-800 dark:text-charcoal-200">MongoDB / Hybrid Store</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-100 dark:border-charcoal-800">
                <span className="text-charcoal-500">Active LLM Engine:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{llmConfig?.provider || 'Internal Educational Engine'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ivory-100 dark:border-charcoal-800">
                <span className="text-charcoal-500">Audio Reciters CDN:</span>
                <span className="font-semibold text-charcoal-800 dark:text-charcoal-200">EveryAyah CDN (Reliable Open-Access)</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-800 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gold-600" />
              <span>Content Safety & Scholarly Verification</span>
            </h3>
            <div className="space-y-3 text-xs text-charcoal-600 dark:text-charcoal-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Text integrity: Uthmanic Arabic text preserved separately from translation layers.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Source attribution: Sahih International (English), Jalandhry (Urdu), Ibn Kathir (Tafsir).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Non-dogmatic scientific language enforced: zero claims of "science proves Quran".</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AI SAFETY RAILS */}
      {activeAdminTab === 'prompts' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-900 dark:text-white">
            Active System Prompt Safety Rules
          </h3>
          <div className="p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800 font-mono text-xs text-charcoal-800 dark:text-charcoal-200 space-y-2 whitespace-pre-line leading-relaxed">
{systemPrompt || `CRITICAL OPERATIONAL RULES ENFORCED BY SERVER:
1. Never invent Qur'anic verses or Arabic text.
2. Never invent Hadith or fabricate scholarly Tafsir citations.
3. Never claim to be a religious authority or issue fatwas (legal rulings).
4. Clearly distinguish between:
   - Qur'anic Arabic text
   - Authentic translation
   - Classical Tafsir / historical context
   - General explanation
   - Modern scientific information
   - Possible educational reflection between verse and science.
5. In scientific discussions:
   - NEVER state: "This scientific discovery proves the Qur'an."
   - ALWAYS use responsible phrases like: "Modern science describes...", "Some readers see a possible connection...", "From a scientific perspective...", "According to this scientific concept...".
   - If there is no reasonable scientific connection, state: "No direct scientific connection is being claimed for this verse."
6. Maintain an encouraging, respectful, clear, and dignified tone.`}
          </div>
        </div>
      )}

      {/* TAB: SCIENCE TOPICS MANAGER */}
      {activeAdminTab === 'science' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs text-charcoal-600 dark:text-charcoal-300 divide-y divide-ivory-100 dark:divide-charcoal-800">
            <thead className="bg-ivory-100 dark:bg-charcoal-950 font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-400">
              <tr>
                <th className="p-3.5">Topic Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Scientific Concept</th>
                <th className="p-3.5">Verses</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-100 dark:divide-charcoal-800">
              {scienceData.map((t) => (
                <tr key={t.slug} className="hover:bg-ivory-50 dark:hover:bg-charcoal-800/40">
                  <td className="p-3.5 font-bold text-charcoal-900 dark:text-white">{t.title}</td>
                  <td className="p-3.5">{t.category}</td>
                  <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-medium">{t.scientificConcept}</td>
                  <td className="p-3.5">{t.quranReferences.length} Verses</td>
                  <td className="p-3.5 text-right">
                    <Link to={`/science/${t.slug}`} className="text-emerald-700 hover:underline font-semibold">
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: THEMATIC TOPICS */}
      {activeAdminTab === 'topics' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs text-charcoal-600 dark:text-charcoal-300 divide-y divide-ivory-100 dark:divide-charcoal-800">
            <thead className="bg-ivory-100 dark:bg-charcoal-950 font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-400">
              <tr>
                <th className="p-3.5">Theme Title</th>
                <th className="p-3.5">Urdu Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Core Verses</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-100 dark:divide-charcoal-800">
              {topicsData.map((t) => (
                <tr key={t.slug} className="hover:bg-ivory-50 dark:hover:bg-charcoal-800/40">
                  <td className="p-3.5 font-bold text-charcoal-900 dark:text-white">{t.title}</td>
                  <td className="p-3.5 font-arabic text-sm text-emerald-800 dark:text-emerald-300">{t.titleUrdu}</td>
                  <td className="p-3.5">{t.category}</td>
                  <td className="p-3.5">{t.verses.length} Key Verses</td>
                  <td className="p-3.5 text-right">
                    <Link to={`/topics/${t.slug}`} className="text-emerald-700 hover:underline font-semibold">
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: SURAH CATALOG */}
      {activeAdminTab === 'surahs' && (
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 overflow-hidden shadow-soft">
          <div className="p-4 bg-ivory-50 dark:bg-charcoal-950 border-b border-ivory-200 dark:border-charcoal-800 text-xs text-charcoal-500">
            Cataloging all 114 Surahs with metadata, revelation chronologies, and Ayah counts.
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-ivory-100 dark:divide-charcoal-800 text-xs">
            {surahsData.map((s) => (
              <div key={s.number} className="p-3.5 flex items-center justify-between hover:bg-ivory-50 dark:hover:bg-charcoal-800/40">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-ivory-200 dark:bg-charcoal-800 font-bold flex items-center justify-center">
                    {s.number}
                  </span>
                  <div>
                    <span className="font-bold text-charcoal-900 dark:text-white">{s.englishName}</span>
                    <span className="text-charcoal-400 ml-2">({s.englishNameTranslation})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-arabic text-base font-bold text-emerald-900 dark:text-emerald-300">{s.name}</span>
                  <span className="text-charcoal-400">{s.numberOfAyahs} Ayahs</span>
                  <Link to={`/surah/${s.number}`} className="text-emerald-700 font-semibold hover:underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Research Source */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200 dark:border-charcoal-800">
              <h3 className="text-base font-bold text-charcoal-900 dark:text-white font-serif">
                Add Verified Research Source
              </h3>
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-charcoal-700 dark:text-charcoal-300 block mb-1">
                  Repository Title
                </label>
                <input
                  type="text"
                  required
                  value={newSource.title}
                  onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                  placeholder="e.g. Atmospheric Chemistry & Precipitation Dynamics"
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal-700 dark:text-charcoal-300 block mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={newSource.institution}
                  onChange={(e) => setNewSource({ ...newSource, institution: e.target.value })}
                  placeholder="e.g. NOAA / NASA / Nature Publishing Group"
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal-700 dark:text-charcoal-300 block mb-1">
                  Scientific Domain
                </label>
                <select
                  value={newSource.domain}
                  onChange={(e) => setNewSource({ ...newSource, domain: e.target.value })}
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl p-2.5"
                >
                  <option value="Universe & Astronomy">Universe & Astronomy</option>
                  <option value="Earth & Geology">Earth & Geology</option>
                  <option value="Water & Rainfall">Water & Rainfall</option>
                  <option value="Plants & Agriculture">Plants & Agriculture</option>
                  <option value="Animals & Biological life">Animals & Biological life</option>
                  <option value="Human creation & development">Human creation & development</option>
                  <option value="Oceans & Environmental systems">Oceans & Environmental systems</option>
                  <option value="Physics & Atmospheric Dynamics">Physics & Atmospheric Dynamics</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-charcoal-700 dark:text-charcoal-300 block mb-1">
                  URL
                </label>
                <input
                  type="url"
                  required
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal-700 dark:text-charcoal-300 block mb-1">
                  Description / Research Focus
                </label>
                <textarea
                  rows="3"
                  value={newSource.description}
                  onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                  placeholder="Summary of peer-reviewed data provided..."
                  className="w-full bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSourceModal(false)}
                  className="px-4 py-2 rounded-xl text-charcoal-600 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
