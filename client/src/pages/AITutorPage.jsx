import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  User,
  Copy,
  Check,
  ChevronDown,
  History,
  FileQuestion,
  GraduationCap,
  Scale,
} from 'lucide-react';
import { quranApi } from '../services/api';
import surahsData from '../data/surahs.json';
import { useLanguage } from '../context/LanguageContext';

const MODES = [
  { id: 'simple-urdu', labelKey: 'modeSimpleUrdu', defaultUrdu: 'آسان اردو میں سمجھائیں', defaultEn: 'Explain in Simple Urdu', icon: 'اردو', descUrdu: 'سادہ اور عام فہم اردو میں قرآنی مفہوم', descEn: 'Clear, direct explanations in Urdu' },
  { id: 'kids', labelKey: 'modeKids', defaultUrdu: 'بچوں کے لیے وضاحت', defaultEn: 'Explain Like I’m 10', icon: HelpCircle, descUrdu: 'بچوں کے لیے دلکش کہانی اور آسان تشبیہات', descEn: 'Simple words and gentle storytelling' },
  { id: 'scholarly', labelKey: 'modeScholarly', defaultUrdu: 'تفصیلی علمی وضاحت', defaultEn: 'Scholarly Explanation', icon: GraduationCap, descUrdu: 'تحقیقی و فکری تجزیہ اور اصولی مباحث', descEn: 'In-depth exegetical and linguistic depth' },
  { id: 'scientific', labelKey: 'modeScientific', defaultUrdu: 'سائنسی تجزیہ', defaultEn: 'Scientific Analysis', icon: Sparkles, descUrdu: 'مظاہرِ فطرت اور مستند سائنسی شواہد', descEn: 'Natural phenomena & peer-reviewed sources' },
  { id: 'real-life', labelKey: 'modeRealLife', defaultUrdu: 'حقیقی زندگی کی مثال', defaultEn: 'Real-Life Example', icon: Lightbulb, descUrdu: 'روزمرہ جدید معاشرتی زندگی کی ٹھوس مثال', descEn: 'Tangible everyday modern scenarios' },
  { id: 'word-by-word', labelKey: 'modeWordByWord', defaultUrdu: 'لفظ بہ لفظ تشریح', defaultEn: 'Word-by-Word', icon: Scale, descUrdu: 'عربی الفاظ کے مادے اور لسانی باریکیاں', descEn: 'Arabic roots & linguistic nuances' },
  { id: 'historical', labelKey: 'modeHistorical', defaultUrdu: 'تاریخی پس منظر', defaultEn: 'Historical Context', icon: History, descUrdu: 'عہدِ نبوی کا ماحول اور اسبابِ نزول', descEn: 'Asbab al-Nuzul & historical setting' },
  { id: 'tafsir', labelKey: 'modeTafsirSummary', defaultUrdu: 'مستند تفسیر کا خلاصہ', defaultEn: 'Classical Tafsir', icon: BookOpen, descUrdu: 'تفسیر ابن کثیر اور قرطبی کا خلاصہ', descEn: 'Ibn Kathir and Qurtubi exegetical summary' },
  { id: 'lessons', labelKey: 'modeLifeLessons', defaultUrdu: 'عملی زندگی کے اسباق', defaultEn: 'Key Lessons', icon: BookOpen, descUrdu: 'عملی کردار سازی کے لیے اہم اسباق', descEn: 'Actionable character takeaways' },
  { id: 'follow-up', labelKey: 'modeQA', defaultUrdu: 'سوال و جواب', defaultEn: 'Questions & Answers', icon: FileQuestion, descUrdu: 'تدبر اور غور و فکر کے لیے گہرے سوالات', descEn: 'Probing contemplation questions' },
];

const SUGGESTED_PROMPTS_URDU = [
  "اس آیت کا مطلب آسان الفاظ میں سمجھائیں۔",
  "اس سورت میں سائنس کے حوالے سے کیا بیان ہوا ہے؟",
  "اس موضوع کو مثال کے ذریعے سمجھائیں۔",
  "اس آیت کی مستند تفسیر کیا ہے؟",
  "جدید سائنس اس بارے میں کیا کہتی ہے؟",
  "یہ بات ہماری روزمرہ زندگی سے کیسے تعلق رکھتی ہے؟",
  "اس آیت سے ہم کیا سیکھ سکتے ہیں؟",
];

const SUGGESTED_PROMPTS_EN = [
  "Explain this verse in simple words.",
  "What scientific themes are mentioned in this Surah?",
  "Give me a real-world example of patience in everyday life.",
  "What is the classical Tafsir of this verse?",
  "What does modern science say about this phenomenon?",
  "How does this relate to our modern everyday life?",
  "What are the practical lessons we can learn from this verse?",
];

export default function AITutorPage() {
  const { language, isUrdu, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSurah = searchParams.get('surah') ? parseInt(searchParams.get('surah'), 10) : null;
  const initialAyah = searchParams.get('ayah') ? parseInt(searchParams.get('ayah'), 10) : null;

  const [selectedSurah, setSelectedSurah] = useState(initialSurah || '');
  const [selectedAyah, setSelectedAyah] = useState(initialAyah || '');
  const [activeMode, setActiveMode] = useState('simple-urdu');
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const getWelcomeContent = (urdu) => {
    if (urdu) {
      return `### قرآن لینز سیاقی اے آئی اتالیق اور سائنسی انجن میں خوش آمدید 📖✨

میں آپ کو قرآن مجید کی مستند تفہیم، کلاسیکی مفسرین کے افکار اور جدید سائنسی مظاہر پر ذمہ دارانہ غور و فکر میں مدد فراہم کرنے کے لیے حاضر ہوں۔

**اوپر موجود ۱۰ تفصیلی مطالعاتی موڈز میں سے انتخاب کریں:**
- **آسان اردو میں سمجھائیں:** عام فہم اور دل نشین الفاظ۔
- **بچوں کے لیے وضاحت:** دلکش کہانیاں اور آسان مثالیں۔
- **تفصیلی علمی وضاحت:** عمیق فکری و اصولی تفسیری مباحث۔
- **سائنسی تجزیہ:** مظاہرِ فطرت، ناسا (NASA) اور بین الاقوامی سائنسی حوالہ جات۔
- **حقیقی زندگی کی مثال اور عملی اسباق:** روزمرہ کردار سازی اور اخلاقی تربیت۔
- **مستند تفسیر اور لفظ بہ لفظ تشریح:** لسانی باریکیاں اور سلف صالحین کے ارشادات۔

*اوپر سے کوئی سورت اور آیت منتخب کریں، یا نیچے دیا گیا کوئی بھی سوال پوچھیں۔*`;
    }
    return `### Welcome to the QuranLens Contextual AI Tutor & Science Engine 📖✨

I am designed to assist you in reading, understanding, and reflecting on the Holy Qur'an with academic rigor, authentic classical scholarship, and responsible scientific context.

**10 Interactive Explanation Modes Available Above:**
- **Simple Urdu & English:** Clear, direct explanations.
- **Explain Like I'm 10:** Engaging metaphors and accessible language.
- **Scientific Analysis:** Objective physical regularities and peer-reviewed citations (NASA, NOAA, USGS, NIH).
- **Real-Life Examples & Key Lessons:** Practical character development.
- **Classical Tafsir & Word-by-Word:** Authentic exegetical and linguistic depth.

*Select a Surah and Ayah above to anchor your exploration, or ask any question below.*`;
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: getWelcomeContent(isUrdu),
      source: 'system',
      provider: 'QuranLens Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async (queryText = inputQuery, modeOverride = activeMode) => {
    const textToSend = queryText.trim();
    if (!textToSend || loading) return;

    const sNum = selectedSurah ? parseInt(selectedSurah, 10) : null;
    const aNum = selectedAyah ? parseInt(selectedAyah, 10) : null;
    const surahMeta = sNum ? surahsData.find((s) => s.number === sNum) : null;

    const userMessage = {
      role: 'user',
      content: textToSend,
      mode: modeOverride,
      surahContext: sNum,
      ayahContext: aNum,
      surahName: isUrdu ? surahMeta?.name : surahMeta?.englishName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6);

      const res = await quranApi.contextualChat({
        message: textToSend,
        history: historyForApi,
        surahNumber: sNum,
        ayahNumber: aNum,
        mode: modeOverride,
      });

      const botMessage = {
        role: 'assistant',
        content: res.data?.reply || res.reply,
        model: res.data?.model || 'LLM Engine',
        provider: res.data?.provider || 'internal',
        mode: modeOverride,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isUrdu
            ? 'معذرت، درخواست پر عمل کرتے وقت ایک خرابی پیش آئی۔ براہِ کرم اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔'
            : 'I apologize, an error occurred while processing your request. Please check your connection and try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeClick = (modeId) => {
    setActiveMode(modeId);
    if (selectedSurah) {
      const sNum = parseInt(selectedSurah, 10);
      const surahMeta = surahsData.find((s) => s.number === sNum);
      const targetAyah = selectedAyah ? `:${selectedAyah}` : '';
      const promptText = isUrdu
        ? `سورت ${surahMeta?.name || sNum}${targetAyah} کی تشریح ${MODES.find((m) => m.id === modeId)?.defaultUrdu} کے مطابق فرمائیں۔`
        : `Explain Surah ${surahMeta?.englishName || sNum}${targetAyah} in ${modeId} mode.`;
      handleSend(promptText, modeId);
    }
  };

  const handleQuickFollowUp = (prompt) => {
    handleSend(prompt);
  };

  const suggestedPrompts = isUrdu ? SUGGESTED_PROMPTS_URDU : SUGGESTED_PROMPTS_EN;

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-1">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isUrdu ? 'قرآن مجید اور جدید سائنس کا اے آئی تجزیاتی انجن' : 'LLM-Powered Quran & Science Analysis Engine'}</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-900 dark:text-emerald-300' : 'font-serif text-charcoal-900 dark:text-white'}`}>
            {isUrdu ? 'سیاقی اردو اے آئی اتالیق و علمی معاون' : 'Contextual AI Quran Tutor'}
          </h1>
        </div>

        <div className="p-2.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-[11px] text-charcoal-600 dark:text-charcoal-300 max-w-sm flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {isUrdu
              ? 'علمی رہنمائی: کبھی یہ دعویٰ نہیں کیا جاتا کہ "سائنس نے قرآن کو ثابت کر دیا"۔ مستند عربی متن اور کلاسیکی تفاسیر کا احترام ہمیشہ مقدم ہے۔'
              : 'Educational Assistant: Never claims "science proves the Quran". Preserves authentic Arabic and classical Tafsir.'}
          </span>
        </div>
      </div>

      {/* Context Verse Anchor Selector */}
      <div className="bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium text-charcoal-700 dark:text-charcoal-300">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>{isUrdu ? 'سورت یا آیت کا انتخاب (اختیاری):' : 'Active Study Context (Optional Anchor):'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Surah dropdown */}
          <select
            value={selectedSurah}
            onChange={(e) => {
              setSelectedSurah(e.target.value);
              setSelectedAyah('');
            }}
            className="bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-800 dark:text-charcoal-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">{isUrdu ? 'عام قرآنی سوالات و جستجو' : 'General Quran Exploration'}</option>
            {surahsData.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.name} ({s.englishName})
              </option>
            ))}
          </select>

          {/* Ayah Number input */}
          {selectedSurah && (
            <input
              type="number"
              min="1"
              max={surahsData.find((s) => s.number === parseInt(selectedSurah, 10))?.numberOfAyahs || 286}
              value={selectedAyah}
              onChange={(e) => setSelectedAyah(e.target.value)}
              placeholder={isUrdu ? 'آیت #' : 'Ayah #'}
              className="w-20 bg-ivory-50 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700 rounded-lg px-2.5 py-1.5 text-xs text-charcoal-800 dark:text-charcoal-200 focus:outline-none focus:border-emerald-500"
            />
          )}

          {(selectedSurah || selectedAyah) && (
            <button
              onClick={() => {
                setSelectedSurah('');
                setSelectedAyah('');
              }}
              className="text-[11px] text-charcoal-400 hover:text-charcoal-600 underline"
            >
              {isUrdu ? 'صاف کریں' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* 10 VIP Explanation Modes Row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-charcoal-500">
          <span className="font-semibold">
            {isUrdu ? '۱۰ تفصیلی مطالعاتی موڈز میں سے منتخب کریں:' : 'Select Explanation Mode (10 Modes):'}
          </span>
          <span>
            {isUrdu ? 'فعال موڈ: ' : 'Active: '}
            <strong className="text-emerald-700 dark:text-emerald-400">
              {MODES.find((m) => m.id === activeMode)?.[isUrdu ? 'defaultUrdu' : 'defaultEn']}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            const label = isUrdu ? (t(mode.labelKey) || mode.defaultUrdu) : mode.defaultEn;
            const desc = isUrdu ? mode.descUrdu : mode.descEn;

            return (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-soft scale-[1.02]'
                    : 'bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-ivory-50 dark:hover:bg-charcoal-800'
                }`}
                title={desc}
              >
                {typeof Icon === 'string' ? (
                  <span className="font-arabic font-bold text-xs">{Icon}</span>
                ) : (
                  <Icon className="w-3.5 h-3.5 text-gold-400" />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft min-h-[460px] max-h-[580px] overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex gap-3 sm:gap-4 ${isUser ? (isUrdu ? 'justify-start flex-row-reverse' : 'justify-end') : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-800 text-white shadow-sm rounded-tr-none'
                    : 'bg-ivory-50/80 dark:bg-charcoal-800/80 border border-ivory-200 dark:border-charcoal-700 text-charcoal-900 dark:text-ivory-100 rounded-tl-none shadow-sm'
                }`}
              >
                {/* User context badge */}
                {isUser && msg.surahName && (
                  <div className="text-[11px] bg-emerald-950/40 text-emerald-200 px-2 py-0.5 rounded mb-2 inline-block">
                    {isUrdu ? 'سورت: ' : 'Surah: '} {msg.surahName} {msg.ayahContext ? `:${msg.ayahContext}` : ''}
                  </div>
                )}

                {/* Assistant metadata badge */}
                {!isUser && msg.model && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-ivory-200 dark:border-charcoal-700 text-[11px] text-charcoal-500 dark:text-charcoal-400">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                      {isUrdu ? 'قرآن لینز علمی و سائنسی تجزیہ' : 'QuranLens Educational Analysis'}
                    </span>
                    <span className="font-mono text-[10px]">
                      {msg.model}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed space-y-2">
                  {msg.content}
                </div>

                {/* Assistant action footer */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-ivory-200 dark:border-charcoal-700 flex items-center justify-between text-[11px] text-charcoal-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
                      title={isUrdu ? 'جواب نقل کریں' : 'Copy response'}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{isUrdu ? 'کاپی ہو گیا' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isUrdu ? 'کاپی کریں' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {isUser && (
                  <div className="mt-2 text-[10px] text-emerald-200 text-right">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-charcoal-700 text-white flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-charcoal-400 text-xs py-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-ivory-100 dark:bg-charcoal-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>
                {isUrdu
                  ? 'قرآن لینز اے آئی انجن مستند علمی و سائنسی مآخذ کے ساتھ تجزیہ کر رہا ہے...'
                  : 'QuranLens Intelligence Engine is analyzing with academic sources...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Follow-up Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-charcoal-500 font-medium">
          {isUrdu ? 'فوری فکری اور تدبری سوالات:' : 'Quick follow-up questions:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickFollowUp(prompt)}
              className="text-xs bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 hover:border-emerald-500 hover:text-emerald-700 px-3 py-1.5 rounded-full text-charcoal-700 dark:text-charcoal-300 transition shadow-sm"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative"
      >
        <textarea
          rows="2"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            isUrdu
              ? 'قرآنی آیات، سائنسی نقطۂ نظر، یا روزمرہ زندگی کے اطلاق کے بارے میں سوال پوچھیں... (انٹر دبائیں)'
              : 'Ask anything about Quranic verses, scientific perspectives, or daily application... (Press Enter to send)'
          }
          className="w-full p-4 pr-24 bg-white dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 shadow-soft resize-none text-charcoal-900 dark:text-white"
        />

        <div className={`absolute ${isUrdu ? 'left-3' : 'right-3'} bottom-3 flex items-center gap-2`}>
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <span>{isUrdu ? 'سوال پوچھیں' : 'Ask AI'}</span>
            <Send className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </form>

    </div>
  );
}
