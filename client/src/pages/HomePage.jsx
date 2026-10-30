import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Compass,
  Bot,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Play,
  Heart,
  Search,
  ExternalLink,
  Download,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';
import { usePWA } from '../context/PWAContext';
import surahsData from '../data/surahs.json';
import scienceData from '../data/scienceTopics.json';
import topicsData from '../data/topics.json';

export default function HomePage({ onOpenSearch }) {
  const { playAyah } = useAudio();
  const { isUrdu, isRTL, t } = useLanguage();
  const { setShowInstallModal, isInstalled } = usePWA();
  const [featuredSurahs, setFeaturedSurahs] = useState([]);
  const [featuredScience, setFeaturedScience] = useState([]);
  const [featuredTopics, setFeaturedTopics] = useState([]);

  useEffect(() => {
    // Select curated featured surahs
    const featuredIds = [1, 2, 18, 21, 36, 55, 67];
    const surahs = surahsData.filter((s) => featuredIds.includes(s.number));
    setFeaturedSurahs(surahs);

    setFeaturedScience(scienceData.slice(0, 3));
    setFeaturedTopics(topicsData.slice(0, 4));
  }, []);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-20 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-islamic-pattern border-b border-ivory-300 dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-sm font-urdu">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>
                {isUrdu
                  ? 'مستند اسلامی، علمی اور تدبری پلیٹ فارم'
                  : 'An Authentic Islamic Educational & Reflection Platform'}
              </span>
            </div>

            {/* Tagline Header */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-emerald-950 dark:text-ivory-50 font-serif leading-tight">
              {isUrdu ? (
                <>
                  پڑھیں، سمجھیں، <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-600 font-urdu-title">
                    غور و فکر کریں۔
                  </span>
                </>
              ) : (
                <>
                  Read. Understand. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-gold-600">
                    Reflect.
                  </span>
                </>
              )}
            </h1>

            {/* Arabic calligraphy greeting */}
            <div className="font-arabic text-2xl sm:text-4xl text-emerald-900/80 dark:text-emerald-300/80 my-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-charcoal-600 dark:text-charcoal-300 max-w-2xl mx-auto leading-relaxed font-urdu">
              {isUrdu
                ? 'قرآن پاک کو مستند ترجمہ، تفہیم، تاریخی پس منظر، جدید سائنسی مطالعہ اور حقیقی زندگی کی مثالوں کے ذریعے سمجھیں۔'
                : 'Explore the Qur\'an through authentic translation, historical context, responsible scientific perspectives, and practical everyday examples.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-urdu">
              <Link
                to="/surahs"
                className="px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-soft hover:shadow-soft-lg flex items-center gap-2 hover:scale-[1.02] transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isUrdu ? 'سورتیں دیکھیں' : 'Explore Surahs'}</span>
              </Link>

              <Link
                to="/topics"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-charcoal-800 hover:bg-ivory-100 dark:hover:bg-charcoal-700 text-charcoal-800 dark:text-white font-bold text-sm border border-ivory-300 dark:border-charcoal-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isUrdu ? 'موضوعات کے ذریعے سیکھیں' : 'Start Learning by Topic'}</span>
              </Link>

              <Link
                to="/ai-tutor"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-charcoal-950 font-bold text-sm shadow-soft hover:scale-[1.02] flex items-center gap-2 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>{isUrdu ? 'اردو اے آئی اتالیق' : 'AI Quran Tutor'}</span>
              </Link>
            </div>

            {/* Quick Search trigger pill */}
            <div className="pt-6">
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-charcoal-900 text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 border border-ivory-300 dark:border-charcoal-700 shadow-soft hover:border-emerald-500 transition max-w-md w-full justify-between font-urdu"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>{isUrdu ? 'کوئی بھی آیت، سورت یا سائنسی موضوع تلاش کریں...' : 'Search any verse, topic, or concept...'}</span>
                </div>
                <kbd className="text-[10px] bg-ivory-100 dark:bg-charcoal-800 px-2 py-0.5 rounded-lg border border-charcoal-200 dark:border-charcoal-700">
                  Ctrl+K
                </kbd>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW QURANLENS WORKS: 4 EDUCATIONAL PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 font-urdu">
            {isUrdu ? 'قرآن لینز کا تعلیمی منہج' : 'The QuranLens Methodology'}
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900 dark:text-white font-urdu">
            {isUrdu ? 'واضح امتیاز، مستند رہنمائی اور ذمہ دارانہ تفہیم' : 'Clear Separation. Responsible Scholarship.'}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 mt-2 font-urdu leading-relaxed">
            {isUrdu
              ? 'ہم قرآنی عربی متن کے تقدس کو محفوظ رکھتے ہوئے ترجمہ، سلف کی تفاسیر اور جدید سائنسی مطالعے کے درمیان واضح حدود قائم رکھتے ہیں۔'
              : 'We preserve the sacred text in its pristine form while organizing translations, classical context, and modern observations with transparent boundaries.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-urdu">
          {[
            {
              title: isUrdu ? '1. اصل قرآنی عربی متن' : '1. Sacred Arabic Text',
              desc: isUrdu ? 'عثمانی رسم الخط میں مستند اور بے عیب عربی متن، بغیر کسی تبدیلی کے۔' : 'Unmodified Uthmanic Arabic typography preserved reverently without artificial alterations.',
              color: 'border-emerald-500',
              badge: isUrdu ? 'محفوظ و مستند' : 'Preserved',
            },
            {
              title: isUrdu ? '2. مستند اردو و انگریزی ترجمہ' : '2. Authentic Translations',
              desc: isUrdu ? 'مولانا فتح محمد جالندھری (اردو) اور صحیح انٹرنیشنل (انگریزی) کا مستند ترجمہ۔' : 'Carefully cited translations in English (Sahih International) and Urdu (Jalandhry).',
              color: 'border-charcoal-400',
              badge: isUrdu ? 'مستند ترجمہ' : 'Verified',
            },
            {
              title: isUrdu ? '3. معتبر تفاسیر کا خلاصہ' : '3. Classical Tafsir',
              desc: isUrdu ? 'اسبابِ نزول اور تفسیر ابن کثیر و قرطبی کا خلاصہ ترجمہ سے الگ پیش کیا جاتا ہے۔' : 'Context of revelation (Asbab al-Nuzul) and classical exegetical references separated from translation.',
              color: 'border-gold-500',
              badge: isUrdu ? 'تاریخی پس منظر' : 'Contextual',
            },
            {
              title: isUrdu ? '4. ذمہ دارانہ سائنسی تدبر' : '4. Responsible Reflection',
              desc: isUrdu ? 'کائنات اور مظاہرِ فطرت پر معروضی غور، بغیر کسی قیاسی دعوے کے کہ سائنس قرآن کو ثابت کرتی ہے۔' : 'Natural phenomena explored without claiming speculative scientific dogmas as religious certainties.',
              color: 'border-emerald-700',
              badge: isUrdu ? 'تدبر و تفکر' : 'Contemplative',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white dark:bg-charcoal-900 border-t-4 ${item.color} border-x border-b border-ivory-200 dark:border-charcoal-800 shadow-soft hover:shadow-soft-lg transition space-y-2`}
            >
              <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {item.badge}
              </div>
              <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED SURAHS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 font-urdu">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1">
              {isUrdu ? 'مطالعہ شروع کریں' : 'Start Reading'}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900 dark:text-white">
              {isUrdu ? 'منتخب سورتیں' : 'Featured Chapters (Surahs)'}
            </h3>
          </div>
          <Link
            to="/surahs"
            className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>{isUrdu ? 'تمام 114 سورتیں دیکھیں' : 'View All 114 Surahs'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-urdu">
          {featuredSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-emerald-500 hover:shadow-soft-lg transition group space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-2xl bg-ivory-100 dark:bg-charcoal-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs border border-ivory-300 dark:border-charcoal-700 font-mono">
                    {surah.number}
                  </span>
                  <div>
                    <h4 className="font-bold text-base text-charcoal-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">
                      {isUrdu ? (surah.urduName || surah.englishName) : surah.englishName}
                    </h4>
                    <p className="text-xs text-charcoal-500">
                      {surah.englishName} • {surah.englishNameTranslation}
                    </p>
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="font-arabic text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                    {surah.name}
                  </span>
                </div>
              </div>

              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                {surah.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-ivory-100 dark:border-charcoal-800 text-[11px] text-charcoal-500">
                <span className="px-2.5 py-1 rounded-xl bg-ivory-100 dark:bg-charcoal-800 font-medium">
                  {surah.numberOfAyahs} {isUrdu ? 'آیات' : 'Ayahs'}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-ivory-100 dark:bg-charcoal-800 font-medium">
                  {surah.revelationType === 'Meccan' ? (isUrdu ? 'مکی سورت' : 'Makki') : (isUrdu ? 'مدنی سورت' : 'Madani')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SCIENTIFIC REFLECTIONS SHOWCASE */}
      <section className="bg-gradient-to-b from-ivory-100/60 to-ivory-50 dark:from-charcoal-900/60 dark:to-charcoal-950 py-16 border-y border-ivory-200 dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 font-urdu">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 border border-gold-300 dark:border-gold-800/60 text-gold-900 dark:text-gold-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ایمان، فطرت اور جدید سائنس' : 'Faith & Modern Knowledge'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900 dark:text-white">
                {isUrdu ? 'سائنسی نقطۂ نظر اور مظاہرِ قدرت' : 'Scientific Perspectives & Natural Phenomena'}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 mt-1 max-w-xl leading-relaxed">
                {isUrdu
                  ? 'پانی کا چکر، کائنات کی وسعت اور جنینیاتی مراحل کا معروضی سائنسی شواہد (NASA، NOAA، WHO) کے ساتھ مطالعہ۔'
                  : 'Contemplating the water cycle, cosmic expansion, and developmental biology with academic sources and responsible reflection.'}
              </p>
            </div>
            <Link
              to="/science"
              className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 flex items-center gap-1 group flex-shrink-0"
            >
              <span>{isUrdu ? 'تمام سائنسی موضوعات دیکھیں' : 'Explore All Science Topics'}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-urdu">
            {featuredScience.map((item) => (
              <div
                key={item.slug}
                className="bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>{item.category}</span>
                    <span className="text-[10px] bg-ivory-100 dark:bg-charcoal-800 px-2 py-0.5 rounded text-charcoal-500 font-mono">
                      {item.quranReferences.length} {isUrdu ? 'آیات' : 'Verses'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-charcoal-900 dark:text-white">
                    {item.title}
                  </h4>

                  <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Sample Verse Preview */}
                  {item.quranReferences[0] && (
                    <div className="p-3.5 rounded-2xl bg-ivory-50 dark:bg-charcoal-800/60 border border-ivory-200 dark:border-charcoal-700/60 text-xs space-y-1.5">
                      <div className="font-arabic text-base text-right text-emerald-900 dark:text-emerald-200 font-bold leading-relaxed">
                        {item.quranReferences[0].arabicText}
                      </div>
                      <div className="text-[11px] text-charcoal-700 dark:text-charcoal-300 italic line-clamp-2">
                        "{item.quranReferences[0].urduTranslation || item.quranReferences[0].englishTranslation}"
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                        سورت {item.quranReferences[0].surahName} ({item.quranReferences[0].surahNumber}:{item.quranReferences[0].ayahNumber})
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-ivory-50/60 dark:bg-charcoal-950/40 border-t border-ivory-200 dark:border-charcoal-800 flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-500">
                    {isUrdu ? 'مستند سائنسی مآخذ' : `Source: ${item.scientificSources[0]?.name || 'Peer-Reviewed'}`}
                  </span>
                  <Link
                    to={`/science/${item.slug}`}
                    className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isUrdu ? 'تجزیہ پڑھیں' : 'Read Analysis'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THEMATIC TOPIC EXPLORER SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 font-urdu">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1">
              {isUrdu ? 'قرآنی تعلیمات کا جامع احاطہ' : 'Themes of Revelation'}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900 dark:text-white">
              {isUrdu ? 'بنیادی قرآنی موضوعات کے ذریعے فہم' : 'Explore by Core Islamic Concepts'}
            </h3>
          </div>
          <Link
            to="/topics"
            className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>{isUrdu ? 'تمام موضوعات دیکھیں' : 'View All Topics'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-urdu">
          {featuredTopics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/topics/${topic.slug}`}
              className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-emerald-500 transition group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {topic.category}
                  </span>
                  <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    {topic.titleUrdu}
                  </span>
                </div>
                <h4 className="text-base font-bold text-charcoal-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition mb-1">
                  {isUrdu ? topic.titleUrdu : topic.title}
                </h4>
                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-3 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              <div className="pt-3 border-t border-ivory-100 dark:border-charcoal-800 flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-400">
                <span>{topic.verses.length} {isUrdu ? 'منتخب آیات' : 'Curated Verses'}</span>
                <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. AI QURAN TUTOR INTERACTIVE TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-charcoal-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden font-urdu">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600 text-gold-300 text-xs font-bold">
                <Bot className="w-4 h-4" />
                <span>{isUrdu ? 'ذہین اردو اے آئی قرآنی اتالیق' : 'AI Quran Tutor'}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                {isUrdu ? (
                  <>
                    سوال پوچھیں، معانی سمجھیں۔ <br />
                    <span className="text-gold-400">مستند مآخذ و تفاسیر کی روشنی میں۔</span>
                  </>
                ) : (
                  <>
                    Ask Questions. Explore Meanings. <br />
                    <span className="text-gold-400">Grounded in Authentic Sources.</span>
                  </>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
                {isUrdu
                  ? 'سخت شرعی اصولوں کے تحت تربیت یافتہ، جو کبھی خود سے آیات یا احادیث وضع نہیں کرتا۔ 10 تعلیمی موڈز میں رہنمائی حاصل کریں: آسان اردو، بچوں کے لیے تشریح، سائنسی تجزیہ یا روزمرہ زندگی کی مثالیں۔'
                  : 'Trained with strict safety rails to never invent verses or pretend to be religious authorities. Switch between modes: Simple Explanation, Urdu, Real-Life Example, or Tafsir Summary.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-xl">
                  • آسان اردو میں سمجھائیں
                </span>
                <span className="bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-xl">
                  • بچوں کے لیے فہم
                </span>
                <span className="bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-xl">
                  • روزمرہ مثالیں
                </span>
                <span className="bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-xl">
                  • سائنسی تجزیہ
                </span>
              </div>

              <div className="pt-4">
                <Link
                  to="/ai-tutor"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-sm shadow-soft transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>{isUrdu ? 'اے آئی اتالیق سے سوال کریں' : 'Open AI Tutor Interface'}</span>
                </Link>
              </div>
            </div>

            {/* Interactive Mock Chat Card */}
            <div className="bg-charcoal-900/90 rounded-3xl border border-charcoal-700 p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-charcoal-800 text-xs text-charcoal-400">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-white">
                  {isUrdu ? 'اے آئی اتالیق کا لائیو نمونہ' : 'Live AI Tutor Preview'}
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-900/40 text-emerald-200 border border-emerald-800/50">
                  <span className="font-bold text-gold-300">{isUrdu ? 'صارف کا سوال: ' : 'Question: '}</span>
                  "{isUrdu ? 'سورۃ الشرح کی آیت \'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا\' کا ہماری روزمرہ زندگی سے کیا تعلق ہے؟' : 'What is the life lesson of Surah Ash-Sharh: With hardship comes ease?'}"
                </div>
                <div className="p-4 rounded-2xl bg-charcoal-800/80 text-charcoal-200 border border-charcoal-700 leading-relaxed space-y-1.5">
                  <div className="font-bold text-emerald-400">
                    {isUrdu ? 'قرآن لینز اتالیق:' : 'QuranLens Tutor:'}
                  </div>
                  <p>
                    {isUrdu
                      ? 'آیت میں لفظ "مع" (ساتھ) استعمال ہوا ہے، جو یہ واضح کرتا ہے کہ آسانی اور اندرونی طاقت مشکل کے بعد نہیں بلکہ مشکل کے عین اندر پیدا کی جاتی ہے، بالکل اسی طرح جیسے ورزش کی مشقت کے اندر ہی پٹھوں کی مضبوطی چھپی ہوتی ہے۔'
                      : 'The verse uses the preposition \'ma\'a\' (with), reminding us that relief and internal resilience do not merely follow hardship—they are planted inside the trial itself.'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. WHY UNDERSTANDING MATTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-ivory-100/70 dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-800 font-urdu">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900 dark:text-white">
              {isUrdu ? 'فہمِ قرآن اور تدبر کیوں ضروری ہے؟' : 'Why Understanding & Reflection Matter'}
            </h3>
            <div className="font-arabic text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-300 leading-loose py-2">
              كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ
            </div>
            <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 italic">
              {isUrdu
                ? '”یہ ایک برکت والی کتاب ہے جو ہم نے آپ کی طرف نازل کی ہے تاکہ لوگ اس کی آیات میں غور و فکر کریں اور عقل والے اس سے نصیحت حاصل کریں۔“ (سورۃ ص: 29)'
                : '"[This is] a blessed Book which We have revealed to you, [O Muhammad], that they might reflect upon its verses and that those of understanding would be reminded." (Surah Sad 38:29)'}
            </p>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 leading-relaxed pt-2">
              {isUrdu
                ? 'تلاوت باعثِ برکت اور قلبی سکون ہے، لیکن حقیقی روحانی انقلاب اس وقت رونما ہوتا ہے جب انسان تلاوت کے ساتھ ساتھ اس کے معنی کو سمجھے، اس کی حکمتوں پر تدبر کرے اور اس کے اخلاقی احکام کو اپنے کردار میں سمو لے۔'
                : 'Recitation brings serenity, but true spiritual transformation occurs when we understand what we recite, reflect on its wisdom, and embody its compassion in daily character.'}
            </p>
          </div>
        </div>
      </section>

      {/* 8. PWA INSTALL & OFFLINE EXPERIENCE BANNER */}
      {!isInstalled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-10 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/60 font-urdu">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/70 border border-gold-400/30 flex items-center justify-center text-gold-400 shadow-inner flex-shrink-0">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-[10px] font-bold">
                  <WifiOff className="w-3 h-3" />
                  <span>{isUrdu ? 'آف لائن اور پورٹیبل ایپ' : 'Offline & Portable App'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif">
                  {isUrdu ? 'قرآن لینز کو اپنے موبائل یا لیپ ٹاپ پر انسٹال کریں' : 'Install QuranLens on Mobile or Desktop'}
                </h3>
                <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed">
                  {isUrdu
                    ? 'بغیر انٹرنیٹ کنکشن کے تمام ۱۱۴ سورتیں، ترجمہ اور تفاسیر پڑھیں۔ پلے اسٹور کے بغیر، ہوم اسکرین پر براہِ راست محفوظ کریں۔'
                    : 'Read all 114 Surahs, translations, and reflections offline anytime. Direct one-tap launch from your device home screen.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-soft flex items-center gap-2 whitespace-nowrap transition-all flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isUrdu ? 'مفت ایپ انسٹال کریں' : 'Install App Free'}</span>
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
