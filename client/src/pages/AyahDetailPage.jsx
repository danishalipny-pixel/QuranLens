import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Lightbulb,
  Bot,
  Copy,
  Check,
  HelpCircle,
  ShieldCheck,
  Type,
  FileText,
  Compass,
  Layers,
  Scale,
  ListOrdered,
  ExternalLink,
} from 'lucide-react';
import { quranApi } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { useReading } from '../context/ReadingContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useLanguage } from '../context/LanguageContext';
import WordByWordCard from '../components/ayah/WordByWordCard';

export default function AyahDetailPage() {
  const { surah: surahParam, ayah: ayahParam } = useParams();
  const navigate = useNavigate();
  const surahNum = parseInt(surahParam, 10);
  const ayahNum = parseInt(ayahParam, 10);

  const { playAyah, isPlaying, currentTrack } = useAudio();
  const { arabicFontSize, translationFontSize } = useReading();
  const { isBookmarked, toggleBookmark, trackReading } = useBookmarks();
  const { isUrdu, isRTL, t } = useLanguage();

  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    quranApi.getAyahStructuredAnalysis(surahNum, ayahNum).then((res) => {
      if (res?.success && res?.data) {
        setAyah(res.data);
        trackReading(surahNum, ayahNum, res.data.surahName);
      } else {
        return quranApi.getAyahDetail(surahNum, ayahNum).then((detailRes) => {
          if (detailRes.success) {
            setAyah(detailRes.data);
            trackReading(surahNum, ayahNum, detailRes.data.surah?.englishName);
          }
        });
      }
      setLoading(false);
    }).catch(() => {
      quranApi.getAyahDetail(surahNum, ayahNum).then((detailRes) => {
        if (detailRes.success) {
          setAyah(detailRes.data);
          trackReading(surahNum, ayahNum, detailRes.data.surah?.englishName);
        }
        setLoading(false);
      });
    });
  }, [surahNum, ayahNum]);

  const handleShare = () => {
    if (!ayah) return;
    const text = `${ayah.arabicText}\n\nUrdu: ${ayah.urduTranslation}\n\nEnglish: ${ayah.englishTranslation}\n\n(Quran ${surahNum}:${ayahNum} - QuranLens: پڑھیں، سمجھیں، غور و فکر کریں)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isCurrentAudio =
    isPlaying &&
    currentTrack?.surahNumber === surahNum &&
    currentTrack?.ayahNumber === ayahNum;

  const bookmarked = isBookmarked(surahNum, ayahNum);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-urdu">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-charcoal-500">
          {isUrdu ? `سورۃ ${surahNum} کی آیت ${ayahNum} کا تفصیلی تجزیہ لوڈ ہو رہا ہے...` : `Loading Ayah ${surahNum}:${ayahNum}...`}
        </p>
      </div>
    );
  }

  if (!ayah) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-urdu">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
          {isUrdu ? 'آیت دستیاب نہیں ہے' : 'Ayah Not Found'}
        </h2>
        <Link to={`/surah/${surahNum}`} className="text-emerald-700 hover:underline">
          {isUrdu ? `سورۃ نمبر ${surahNum} پر واپس جائیں` : `Return to Surah ${surahNum}`}
        </Link>
      </div>
    );
  }

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-urdu">
      
      {/* Top Breadcrumb & Next/Prev Navigation */}
      <div className="flex items-center justify-between text-xs text-charcoal-500 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
        <div className="flex items-center gap-2">
          <Link
            to={`/surah/${surahNum}`}
            className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-bold hover:underline"
          >
            <PrevIcon className="w-3.5 h-3.5" />
            <span>{isUrdu ? `سورۃ ${ayah.surahNameUrdu || ayah.surahName}` : `Surah ${ayah.surahName || surahNum}`}</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-charcoal-900 dark:text-white font-mono">
            {isUrdu ? `آیت ${ayahNum}` : `Ayah ${ayahNum}`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {ayahNum > 1 && (
            <Link
              to={`/ayah/${surahNum}/${ayahNum - 1}`}
              className="flex items-center gap-1 hover:text-emerald-700 transition"
              title={isUrdu ? `پچھلی آیت (${ayahNum - 1})` : `Previous Ayah`}
            >
              <PrevIcon className="w-3.5 h-3.5" />
              <span>{isUrdu ? `آیت ${ayahNum - 1}` : `Ayah ${ayahNum - 1}`}</span>
            </Link>
          )}
          <Link
            to={`/ayah/${surahNum}/${ayahNum + 1}`}
            className="flex items-center gap-1 hover:text-emerald-700 transition"
            title={isUrdu ? `اگلی آیت (${ayahNum + 1})` : `Next Ayah`}
          >
            <span>{isUrdu ? `آیت ${ayahNum + 1}` : `Ayah ${ayahNum + 1}`}</span>
            <NextIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* SECTION 1: اصل قرآنی عربی متن (Original Quranic Arabic Text) */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft-lg space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-ivory-100 dark:border-charcoal-800">
          <div className="flex items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
              {ayah.surahNameUrdu || ayah.surahName} • {surahNum}:{ayahNum}
            </span>
            <span className="text-xs text-charcoal-400">
              {ayah.revelationType === 'Meccan' || ayah.revelationType === 'Makki' ? (isUrdu ? 'مکی سورت' : 'Makki') : (isUrdu ? 'مدنی سورت' : 'Madani')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play Audio */}
            <button
              onClick={() => playAyah(surahNum, ayahNum, ayah.surahName)}
              className={`p-2.5 rounded-xl transition ${
                isCurrentAudio
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 hover:text-emerald-600'
              }`}
              title={isCurrentAudio ? (isUrdu ? 'وقفہ' : 'Pause') : (isUrdu ? 'تلاوت سنیں' : 'Play')}
            >
              {isCurrentAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(ayah)}
              className={`p-2.5 rounded-xl transition ${
                bookmarked
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400'
                  : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:text-emerald-600'
              }`}
              title={isUrdu ? 'بک مارک کریں' : 'Bookmark this Ayah'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share / Copy */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:text-emerald-600 transition"
              title={isUrdu ? 'آیت اور تفہیم کاپی کریں' : 'Share / Copy Ayah'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Ask AI Tutor */}
            <Link
              to={`/ai-tutor?surah=${surahNum}&ayah=${ayahNum}`}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft transition ml-2 rtl:ml-0 rtl:mr-2"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'اے آئی اتالیق سے پوچھیں' : 'Ask AI Tutor'}</span>
            </Link>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
          ۱. اصل قرآنی عربی متن
        </div>

        {/* Sacred Arabic Text */}
        <div
          className="font-arabic text-emerald-950 dark:text-emerald-100 font-bold text-right leading-loose py-4 tracking-wide"
          style={{ fontSize: `${arabicFontSize + 8}px` }}
        >
          {ayah.arabicText}
        </div>
      </div>

      {/* SECTION 2: لفظ بہ لفظ اردو معنی (Word-by-Word Urdu Meaning) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold font-serif">
            ۲. لفظ بہ لفظ اردو معنی
          </h2>
        </div>
        <WordByWordCard words={ayah.wordByWord} />
      </div>

      {/* SECTION 3 & 4: مستند اور آسان اردو ترجمہ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 3: مستند اردو ترجمہ (فاتح محمد جالندھری) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">
              ۳. مستند اردو ترجمہ
            </span>
            <span className="text-[11px] text-charcoal-400 bg-ivory-100 dark:bg-charcoal-800 px-2 py-0.5 rounded font-medium">
              {ayah.urduSource || 'مولانا فتح محمد جالندھری'}
            </span>
          </div>
          <p
            className="font-urdu text-right text-charcoal-800 dark:text-charcoal-200 leading-relaxed font-semibold"
            style={{ fontSize: `${translationFontSize + 1}px` }}
          >
            "{ayah.urduTranslation}"
          </p>
        </div>

        {/* SECTION 4: آسان اردو ترجمہ و عام فہم خلاصہ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-soft space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-300">
              ۴. آسان اردو ترجمہ و عام فہم خلاصہ
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
              ہر قاری کے لیے
            </span>
          </div>
          <p className="font-urdu text-right text-charcoal-800 dark:text-emerald-100 text-sm sm:text-base leading-relaxed">
            {ayah.easyUrduTranslation || ayah.simpleExplanation}
          </p>
        </div>

      </div>

      {/* SECTION 5: آیت کا پس منظر (Ayah Context & Historical Background) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>۵. آیت کا پس منظر اور سببِ نزول</span>
        </h3>
        <div className="space-y-3 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
          {ayah.ayahContext?.surahContext && (
            <p><strong>سورت کا سیاق: </strong>{ayah.ayahContext.surahContext}</p>
          )}
          {ayah.ayahContext?.historicalBackground && (
            <p><strong>تاریخی پس منظر: </strong>{ayah.ayahContext.historicalBackground}</p>
          )}
        </div>
      </div>

      {/* SECTION 6: مستند تفسیر (Authentic Tafsir - Ibn Kathir / Al-Qurtubi) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-ivory-100 dark:border-charcoal-800 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>۶. مستند تفسیر</span>
          </h3>
          <span className="text-[11px] text-charcoal-400 bg-ivory-100 dark:bg-charcoal-800 px-2 py-0.5 rounded font-mono">
            {ayah.authenticTafsir?.source || ayah.tafsir?.source || 'تفسیر ابن کثیر (مستند خلاصہ)'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed">
          {ayah.authenticTafsir?.content || ayah.tafsir?.content}
        </p>
      </div>

      {/* SECTION 7: تفصیلی وضاحت (Detailed Step-by-Step Explanation) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-emerald-600" />
          <span>۷. تفصیلی علمی وضاحت (بچوں، طلبہ اور عام فہم کے لیے مرحلہ وار)</span>
        </h3>
        <div className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed whitespace-pre-line space-y-2">
          {ayah.detailedExplanation}
        </div>
      </div>

      {/* SECTION 8 & 9: سائنسی نقطۂ نظر اور جدید سائنسی معلومات */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-gold-200 dark:border-charcoal-700 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ivory-100 dark:border-charcoal-800">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <h3 className="text-base font-bold font-serif">
              ۸. سائنسی نقطۂ نظر و درجہ بندی
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-100 dark:bg-gold-950/80 text-gold-800 dark:text-gold-300 border border-gold-300 dark:border-gold-800">
            {ayah.scientificClassification || 'Natural phenomenon'}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
            موضوع:
          </span>
          <p className="text-sm font-semibold text-charcoal-900 dark:text-white">
            {ayah.scientificTopic}
          </p>
        </div>

        {/* SECTION 9: جدید سائنسی معلومات */}
        <div className="space-y-2 pt-2 border-t border-ivory-100 dark:border-charcoal-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>۹. جدید سائنسی معلومات و شواہد</span>
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            {ayah.modernScientificExplanation}
          </p>
        </div>
      </div>

      {/* SECTION 10 & 11: حقیقی زندگی کی مثال اور روزمرہ زندگی سے تعلق */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 10: حقیقی زندگی کی مثال */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-gold-500" />
            <span>۱۰. حقیقی زندگی کی مثال</span>
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            {ayah.realWorldExample}
          </p>
        </div>

        {/* SECTION 11: روزمرہ زندگی سے تعلق */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>۱۱. روزمرہ زندگی سے عملی تعلق</span>
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            {ayah.everydayRelevance || 'اپنے گھریلو اور پیشہ ورانہ معاملات میں اس آیت کی رہنمائی پر عمل پیرا ہوں۔'}
          </p>
        </div>

      </div>

      {/* SECTION 12: عملی سبق (Practical Lessons) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>۱۲. عملی سبق و اخلاقی رہنمائی</span>
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300">
          {(ayah.practicalLessons || ayah.keyLessons || []).map((lesson, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SECTION 13: غور و فکر کے سوالات (Reflection Questions) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 shadow-soft space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>۱۳. غور و فکر کے سوالات (تدبر)</span>
        </h3>
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-800 dark:text-charcoal-200">
          {(ayah.reflectionQuestions || [ayah.reflectionQuestion]).filter(Boolean).map((q, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-emerald-100 dark:border-emerald-900/50">
              {q}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 14: مستند حوالہ جات (Authentic References) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-2">
          <FileText className="w-4 h-4 text-charcoal-400" />
          <span>۱۴. مستند مآخذ و حوالہ جات</span>
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {(ayah.authenticReferences || ayah.scientificReferences || []).map((ref, idx) => (
            <a
              key={idx}
              href={ref.url || ref.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 border border-ivory-200 dark:border-charcoal-700 hover:text-emerald-600 transition"
            >
              <span>{ref.title || ref.name}</span>
              {ref.type && <span className="text-[10px] text-charcoal-400 font-mono">({ref.type})</span>}
              <ExternalLink className="w-3 h-3 text-charcoal-400" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
