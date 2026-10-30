import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const URDU_DICTIONARY = {
  // Brand & Tagline
  brandName: 'QuranLens — قرآن کو سمجھیں، غور کریں، علم حاصل کریں',
  brandShort: 'قرآن لینز',
  tagline: 'پڑھیں، سمجھیں، غور و فکر کریں۔',
  subtitle: 'قرآن پاک کو مستند ترجمہ، تفہیم، تاریخی پس منظر، جدید سائنسی مطالعہ اور حقیقی زندگی کی مثالوں کے ذریعے سمجھیں۔',

  // Nav Items
  navHome: 'صفحۂ اول',
  navSurahs: 'تمام سورتیں',
  navScience: 'سائنس اور قرآن',
  navTopics: 'موضوعات',
  navAITutor: 'اے آئی اتالیق',
  navBookmarks: 'بک مارکس',
  navReading: 'مطالعہ',
  navAdmin: 'ایڈمن کنٹرول',
  navProfile: 'پروفائل',
  navLogin: 'لاگ ان',
  navRegister: 'اکاؤنٹ بنائیں',
  navLogout: 'لاگ آؤٹ',
  navSearchPlaceholder: 'سورت، آیت، سائنسی موضوع یا لفظ تلاش کریں...',

  // Home Page
  heroExploreSurahs: 'سورتیں دیکھیں',
  heroStartLearning: 'مطالعہ شروع کریں',
  heroFeaturedSurahs: 'منتخب سورتیں',
  heroPopularTopics: 'اہم قرآنی موضوعات',
  heroScientificReflections: 'جدید سائنسی حقائق اور قرآنی تدبر',
  heroHowItWorks: 'قرآن لینز کیسے کام کرتا ہے؟',
  heroAITutorSection: 'ذہین اردو اے آئی اتالیق',
  heroWhyMatters: 'فہمِ قرآن کیوں ضروری ہے؟',

  // Surahs Index
  surahIndexTitle: 'قرآن مجید کی تمام 114 سورتیں',
  surahIndexSubtitle: 'مستند تلاوت، اردو ترجمہ اور تفصیلی علمی و سائنسی تجزیے کے ساتھ۔',
  filterAll: 'تمام سورتیں',
  filterMakki: 'مکی سورتیں',
  filterMadani: 'مدنی سورتیں',
  searchSurahPlaceholder: 'سورت کا نام یا نمبر تلاش کریں...',
  ayahsCount: 'آیات',
  makkiType: 'مکی',
  madaniType: 'مدنی',

  // Surah Detail
  tabAyahs: 'آیات اور تلاوت',
  tabScienceAnalysis: 'اس سورت میں سائنس کیا بیان کرتی ہے؟',
  tabReport: 'علمی و سائنسی رپورٹ ڈاؤن لوڈ کریں',
  listenRecitation: 'تلاوت سنیں',
  toggleEnglishTranslation: 'انگریزی ترجمہ',
  toggleUrduTranslation: 'اردو ترجمہ',
  ayahActionUnderstand: 'اس آیت کو سمجھیں',
  ayahActionScience: 'سائنسی نقطۂ نظر',
  ayahActionExample: 'حقیقی زندگی کی مثال',
  ayahActionAskAI: 'اے آئی سے پوچھیں',

  // 14 Sections for Ayah Detail
  secArabicText: '1. اصل قرآنی عربی متن',
  secWordByWord: '2. لفظ بہ لفظ اردو معنی',
  secAuthenticUrdu: '3. مستند اردو ترجمہ (فاتح محمد جالندھری)',
  secEasyUrdu: '4. آسان اردو ترجمہ و عام فہم خلاصہ',
  secBackground: '5. آیت کا پس منظر اور سبب نزول',
  secClassicalTafsir: '6. مستند تفسیر (تفسیر ابن کثیر و قرطبی)',
  secDetailedExplanation: '7. تفصیلی علمی وضاحت',
  secScientificPerspective: '8. سائنسی نقطۂ نظر و درجہ بندی',
  secModernScience: '9. جدید سائنسی معلومات و شواہد',
  secRealWorldExample: '10. حقیقی زندگی کی مثال',
  secEverydayLife: '11. روزمرہ زندگی سے تعلق',
  secPracticalLessons: '12. عملی سبق و اخلاقی رہنمائی',
  secReflectionQuestions: '13. غور و فکر کے سوالات (تدبر)',
  secReferences: '14. مستند مآخذ و حوالہ جات',

  // 6 Science Questions in Surah Analysis
  sciQ1: 'قرآن کی آیت کیا بیان کرتی ہے؟',
  sciQ2: 'مستند تفسیر کیا بتاتی ہے؟',
  sciQ3: 'جدید سائنس اس موضوع کو کیسے سمجھاتی ہے؟',
  sciQ4: 'سائنسی تحقیق کیا کہتی ہے؟',
  sciQ5: 'اس کا حقیقی دنیا میں کیا مظاہرہ ہے؟',
  sciQ6: 'ممکنہ تعلق اور اس کی حدود کیا ہیں؟',

  // 10 VIP Learning Modes
  modeSimpleUrdu: 'آسان اردو میں سمجھائیں',
  modeKids: 'بچوں کے لیے وضاحت',
  modeScholarly: 'تفصیلی علمی وضاحت',
  modeScientific: 'سائنسی تجزیہ',
  modeRealLife: 'حقیقی زندگی کی مثال',
  modeWordByWord: 'لفظ بہ لفظ تشریح',
  modeHistorical: 'تاریخی پس منظر',
  modeTafsirSummary: 'مستند تفسیر کا خلاصہ',
  modeLifeLessons: 'عملی زندگی کے اسباق',
  modeQA: 'سوال و جواب',

  // Scientific Classifications
  clsDirect: 'براہِ راست سائنسی موضوع',
  clsNatural: 'قدرتی مظاہر',
  clsIndirect: 'ضمنی فکری و تصوراتی تعلق',
  clsEthical: 'اخلاقی و روحانی پیغام',
  clsNone: 'کوئی براہِ راست سائنسی دعویٰ نہیں',

  // Safety Disclaimers
  safetyNotice: 'اہم علمی وضاحت: قرآن مجید ہدایت، اخلاق اور روحانی رہنمائی کی کتاب ہے۔ سائنسی مشاہدات کو کبھی یہ دعویٰ کر کے پیش نہیں کیا جاتا کہ "سائنس نے قرآن کو ثابت کر دیا"، بلکہ یہ غور و فکر اور تدبر کے لیے بیان کیے جاتے ہیں۔',
};

export const ENGLISH_DICTIONARY = {
  brandName: 'QuranLens — Read. Understand. Reflect.',
  brandShort: 'QuranLens',
  tagline: 'Read. Understand. Reflect.',
  subtitle: 'Explore the Qur\'an through authentic translation, context, reflection, scientific perspectives, and real-world examples.',
  navHome: 'Home',
  navSurahs: 'Surahs',
  navScience: 'Science & Quran',
  navTopics: 'Topics',
  navAITutor: 'AI Tutor',
  navBookmarks: 'Bookmarks',
  navReading: 'Reading',
  navAdmin: 'Admin',
  navProfile: 'Profile',
  navLogin: 'Login',
  navRegister: 'Sign Up',
  navLogout: 'Logout',
  navSearchPlaceholder: 'Search surah, ayah, scientific concept, or keyword...',
  heroExploreSurahs: 'Explore Surahs',
  heroStartLearning: 'Start Learning',
  heroFeaturedSurahs: 'Featured Surahs',
  heroPopularTopics: 'Core Thematic Topics',
  heroScientificReflections: 'Modern Science & Quranic Contemplation',
  heroHowItWorks: 'How QuranLens Works',
  heroAITutorSection: 'Intelligent AI Quran Tutor',
  heroWhyMatters: 'Why Understanding Matters',
  surahIndexTitle: 'All 114 Surahs of the Holy Quran',
  surahIndexSubtitle: 'With authentic recitation, translations, and deep scientific analyses.',
  filterAll: 'All Surahs',
  filterMakki: 'Makki',
  filterMadani: 'Madani',
  searchSurahPlaceholder: 'Search by Surah name or number...',
  ayahsCount: 'Ayahs',
  makkiType: 'Makki',
  madaniType: 'Madani',
  tabAyahs: 'Ayahs & Recitation',
  tabScienceAnalysis: 'Scientific Perspective of This Surah',
  tabReport: 'Export Science Report (PDF)',
  listenRecitation: 'Listen to Recitation',
  toggleEnglishTranslation: 'English Translation',
  toggleUrduTranslation: 'Urdu Translation',
  ayahActionUnderstand: 'Understand This Ayah',
  ayahActionScience: 'Scientific Perspective',
  ayahActionExample: 'Real-Life Example',
  ayahActionAskAI: 'Ask AI Tutor',
  secArabicText: '1. Original Quranic Arabic Text',
  secWordByWord: '2. Word-by-Word Urdu & English Meaning',
  secAuthenticUrdu: '3. Authentic Urdu Translation (Jalandhry)',
  secEasyUrdu: '4. Simplified Urdu Meaning & Summary',
  secBackground: '5. Context & Occasion of Revelation',
  secClassicalTafsir: '6. Authentic Classical Tafsir (Ibn Kathir)',
  secDetailedExplanation: '7. Detailed Scholarly Explanation',
  secScientificPerspective: '8. Scientific Perspective & Classification',
  secModernScience: '9. Modern Scientific Consensus & Findings',
  secRealWorldExample: '10. Real-World Practical Example',
  secEverydayLife: '11. Everyday Life Relevance',
  secPracticalLessons: '12. Practical Actionable Lessons',
  secReflectionQuestions: '13. Contemplation Questions (Tadabbur)',
  secReferences: '14. Authentic Scholarly References',
  sciQ1: 'What does the Qur’anic verse state?',
  sciQ2: 'What does classical Tafsir explain?',
  sciQ3: 'How does modern science explain this phenomenon?',
  sciQ4: 'What do peer-reviewed research studies state?',
  sciQ5: 'How is this observed in the physical world?',
  sciQ6: 'What are the possible connections and limitations?',
  modeSimpleUrdu: 'Explain in Simple Urdu',
  modeKids: 'Explain Like I’m 10',
  modeScholarly: 'Detailed Scholarly Explanation',
  modeScientific: 'Scientific Analysis',
  modeRealLife: 'Real-Life Example',
  modeWordByWord: 'Word-by-Word Breakdown',
  modeHistorical: 'Historical Context',
  modeTafsirSummary: 'Classical Tafsir Summary',
  modeLifeLessons: 'Key Life Lessons',
  modeQA: 'Questions & Answers',
  clsDirect: 'Direct Scientific Subject',
  clsNatural: 'Natural Phenomenon',
  clsIndirect: 'Indirect Conceptual Relationship',
  clsEthical: 'Ethical / Spiritual Focus',
  clsNone: 'No Direct Physical Science Subject',
  safetyNotice: 'Important Academic Notice: The Qur’an is a book of spiritual, ethical, and theological guidance. Scientific reflections provide educational context and Tadabbur without claiming empirical proof.',
};

export function LanguageProvider({ children }) {
  // Default language is strictly Urdu ('ur') as requested
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('quranlens_lang') || 'ur';
  });

  const isUrdu = language === 'ur';
  const isRTL = isUrdu;

  useEffect(() => {
    localStorage.setItem('quranlens_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isUrdu) {
      document.body.classList.add('font-urdu');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.remove('font-urdu');
      document.body.classList.add('font-sans');
    }
  }, [language, isRTL, isUrdu]);

  const setLanguage = (lang) => {
    if (lang === 'ur' || lang === 'en') {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ur' ? 'en' : 'ur'));
  };

  const t = (key, fallback = '') => {
    const dict = isUrdu ? URDU_DICTIONARY : ENGLISH_DICTIONARY;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isUrdu,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
        dict: isUrdu ? URDU_DICTIONARY : ENGLISH_DICTIONARY,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
