import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Play,
  Pause,
  Bookmark,
  Share2,
  BookOpen,
  Sparkles,
  Lightbulb,
  Bot,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Volume2,
  Copy,
  FileText,
  Compass,
} from 'lucide-react';
import { quranApi } from '../services/api';
import { useAudio } from '../context/AudioContext';
import { useReading } from '../context/ReadingContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useLanguage } from '../context/LanguageContext';
import SurahSciencePerspective from '../components/surah/SurahSciencePerspective';

export default function SurahDetailPage() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { playAyah, isPlaying, currentTrack } = useAudio();
  const { arabicFontSize, translationFontSize, showUrdu, showEnglish, setShowUrdu, setShowEnglish } = useReading();
  const { isBookmarked, toggleBookmark, trackReading } = useBookmarks();
  const { isUrdu, isRTL, t } = useLanguage();

  const [surah, setSurah] = useState(null);
  const [surahAnalysis, setSurahAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedAyah, setCopiedAyah] = useState(null);
  const [activeView, setActiveView] = useState(location.hash === '#science' ? 'science' : 'ayahs');

  const num = parseInt(surahNumber, 10);

  useEffect(() => {
    if (location.hash === '#science') {
      setActiveView('science');
    }
  }, [location.hash]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    Promise.all([
      quranApi.getSurah(surahNumber),
      quranApi.getSurahScienceAnalysis(surahNumber),
    ]).then(([surahRes, analysisRes]) => {
      if (surahRes.success) {
        setSurah(surahRes.data);
        trackReading(num, 1, surahRes.data.englishName);
      }
      if (analysisRes?.success && analysisRes?.data) {
        setSurahAnalysis(analysisRes.data);
      }
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [surahNumber]);

  const handleShare = (ayah) => {
    const text = `${ayah.arabicText}\n\nUrdu: ${ayah.urduTranslation}\n\nEnglish: ${ayah.englishTranslation}\n\n(Quran ${num}:${ayah.ayahNumber} - QuranLens: پڑھیں، سمجھیں، غور و فکر کریں)`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.ayahNumber);
    setTimeout(() => setCopiedAyah(null), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center font-urdu">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-charcoal-500">{isUrdu ? `سورۃ نمبر ${surahNumber} کا مواد لوڈ ہو رہا ہے...` : `Loading Surah ${surahNumber}...`}</p>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center font-urdu">
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">{isUrdu ? 'سورت نہیں مل سکی' : 'Surah Not Found'}</h2>
        <Link to="/surahs" className="text-emerald-700 hover:underline">
          {isUrdu ? 'فہرستِ سورتیں پر واپس جائیں' : 'Return to Surah Index'}
        </Link>
      </div>
    );
  }

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-urdu">
      
      {/* Navigation Breadcrumb & Previous/Next Surah Jump */}
      <div className="flex items-center justify-between text-xs text-charcoal-500 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
        <Link to="/surahs" className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-bold hover:underline">
          <PrevIcon className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'تمام 114 سورتیں' : 'All Surahs'}</span>
        </Link>

        <div className="flex items-center gap-3">
          {num > 1 && (
            <Link
              to={`/surah/${num - 1}`}
              className="flex items-center gap-1 hover:text-emerald-700 transition"
              title={isUrdu ? `پچھلی سورت (سورۃ نمبر ${num - 1})` : `Previous Surah (${num - 1})`}
            >
              <PrevIcon className="w-3.5 h-3.5" />
              <span>{isUrdu ? `پچھلی سورت (${num - 1})` : `Surah ${num - 1}`}</span>
            </Link>
          )}
          {num < 114 && (
            <Link
              to={`/surah/${num + 1}`}
              className="flex items-center gap-1 hover:text-emerald-700 transition"
              title={isUrdu ? `اگلی سورت (سورۃ نمبر ${num + 1})` : `Next Surah (${num + 1})`}
            >
              <span>{isUrdu ? `اگلی سورت (${num + 1})` : `Surah ${num + 1}`}</span>
              <NextIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Surah Hero Header Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-charcoal-950 text-white rounded-3xl p-6 sm:p-10 shadow-soft-lg text-center relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          
          {/* Metadata pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600 text-gold-300 text-xs font-bold font-urdu">
            <span>{isUrdu ? `سورۃ نمبر ${surah.number}` : `Surah ${surah.number}`}</span>
            <span>•</span>
            <span>{surah.revelationType === 'Meccan' || surah.revelationType === 'Makki' ? (isUrdu ? 'مکی سورت' : 'Makki') : (isUrdu ? 'مدنی سورت' : 'Madani')}</span>
            <span>•</span>
            <span>{surah.numberOfAyahs} {isUrdu ? 'آیات' : 'Ayahs'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-white">
            {isUrdu ? (surah.urduName || surah.englishName) : surah.englishName}
          </h1>

          <p className="text-sm text-emerald-200">
            {surah.englishName} • {surah.englishNameTranslation}
          </p>

          <div className="font-arabic text-4xl sm:text-5xl font-bold text-gold-400 pt-2 pb-1 leading-relaxed">
            {surah.name}
          </div>

          {surah.description && (
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed pt-2 font-urdu">
              {surah.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 font-urdu">
            <button
              onClick={() => playAyah(num, 1, surah.englishName)}
              className="px-5 py-2.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs sm:text-sm shadow-soft flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isUrdu ? 'سورت کی تلاوت سنیں' : 'Listen to Recitation'}</span>
            </button>
            <button
              onClick={() => setActiveView('science')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 font-bold text-xs sm:text-sm shadow-soft flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>{isUrdu ? 'اس سورت میں سائنس کیا بیان کرتی ہے؟' : 'Scientific Perspective'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Tabs: Verses Reader vs Scientific Perspective */}
      <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-charcoal-800 pb-2">
        <button
          onClick={() => setActiveView('ayahs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeView === 'ayahs'
              ? 'bg-emerald-800 text-white shadow-soft'
              : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isUrdu ? `آیات اور تلاوت (${surah.numberOfAyahs})` : `Ayahs & Translations (${surah.numberOfAyahs})`}</span>
        </button>

        <button
          onClick={() => setActiveView('science')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeView === 'science'
              ? 'bg-emerald-800 text-white shadow-soft'
              : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span>{isUrdu ? 'اس سورت میں سائنس کیا بیان کرتی ہے؟' : 'Scientific Perspective of This Surah'}</span>
          {surahAnalysis?.hasScientificThemes && (
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Conditional View: Science Perspective View */}
      {activeView === 'science' ? (
        <SurahSciencePerspective
          surah={surah}
          analysis={surahAnalysis}
          onAnalysisUpdate={setSurahAnalysis}
        />
      ) : (
        <>
          {/* Reading Controls & Translation Toggles */}
          <div className="bg-white dark:bg-charcoal-900 p-4 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-charcoal-700 dark:text-charcoal-300 font-bold">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'تراجم کا انتخاب:' : 'Toggle Translations:'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUrdu(!showUrdu)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition ${
                  showUrdu
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-300'
                    : 'bg-ivory-100 dark:bg-charcoal-800 border-ivory-300 dark:border-charcoal-700 text-charcoal-400'
                }`}
              >
                اردو ترجمہ (جالندھری) {showUrdu && '✓'}
              </button>

              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className={`px-3 py-1.5 rounded-xl border font-bold transition ${
                  showEnglish
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-300'
                    : 'bg-ivory-100 dark:bg-charcoal-800 border-ivory-300 dark:border-charcoal-700 text-charcoal-400'
                }`}
              >
                English {showEnglish && '✓'}
              </button>
            </div>
          </div>

          {/* Bismillah Header (Except Surah 9 At-Tawbah & Surah 1 where it is Ayah 1) */}
          {num !== 1 && num !== 9 && (
            <div className="text-center py-6 bg-ivory-100/50 dark:bg-charcoal-900/50 rounded-3xl border border-ivory-200 dark:border-charcoal-800 space-y-2">
              <div className="font-arabic text-3xl sm:text-4xl text-emerald-950 dark:text-emerald-200 font-bold">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 font-urdu">
                {isUrdu
                  ? 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے'
                  : 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}
              </p>
            </div>
          )}

          {/* AYAH LIST */}
          <div className="space-y-6">
            {surah.ayahs && surah.ayahs.map((ayah) => {
              const isCurrentlyPlaying =
                isPlaying &&
                currentTrack?.surahNumber === num &&
                currentTrack?.ayahNumber === ayah.ayahNumber;

              const bookmarked = isBookmarked(num, ayah.ayahNumber);

              return (
                <div
                  key={ayah.ayahNumber}
                  id={`ayah-${ayah.ayahNumber}`}
                  className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border transition-all ${
                    isCurrentlyPlaying
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-soft-lg'
                      : 'border-ivory-200 dark:border-charcoal-800 shadow-soft hover:shadow-soft-lg'
                  }`}
                >
                  {/* Ayah Action Bar */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-ivory-100 dark:border-charcoal-800">
                    {/* Ayah Badge */}
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-emerald-900 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-ivory-200 dark:border-charcoal-700 font-mono">
                        {num}:{ayah.ayahNumber}
                      </span>
                      {isCurrentlyPlaying && (
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <span className="wave-bar" />
                          <span className="wave-bar" />
                          <span className="wave-bar" />
                          <span className="ml-1 text-[11px]">{isUrdu ? 'تلاوت جاری ہے' : 'Playing'}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      
                      {/* Play Audio Button */}
                      <button
                        onClick={() => playAyah(num, ayah.ayahNumber, surah.englishName)}
                        className={`p-2.5 rounded-xl transition ${
                          isCurrentlyPlaying
                            ? 'bg-emerald-600 text-white shadow-soft'
                            : 'text-charcoal-500 hover:text-emerald-700 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                        }`}
                        title={isCurrentlyPlaying ? (isUrdu ? 'وقفہ' : 'Pause') : (isUrdu ? 'آیت کی تلاوت سنیں' : 'Play Ayah')}
                      >
                        {isCurrentlyPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark({ surahNumber: num, ayahNumber: ayah.ayahNumber, surahName: surah.englishName, ...ayah })}
                        className={`p-2.5 rounded-xl transition ${
                          bookmarked
                            ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800'
                            : 'text-charcoal-500 hover:text-emerald-700 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                        }`}
                        title={bookmarked ? (isUrdu ? 'بک مارک محفوظ ہے' : 'Saved in Bookmarks') : (isUrdu ? 'بک مارک کریں' : 'Add to Bookmarks')}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Share / Copy Button */}
                      <button
                        onClick={() => handleShare(ayah)}
                        className="p-2.5 rounded-xl text-charcoal-500 hover:text-emerald-700 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition"
                        title={isUrdu ? "آیت اور ترجمہ کاپی کریں" : "Copy & Share Ayah"}
                      >
                        {copiedAyah === ayah.ayahNumber ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* Arabic Sacred Text */}
                  <div
                    className="font-arabic text-emerald-950 dark:text-emerald-100 font-bold mb-6 text-right leading-loose tracking-wide"
                    style={{ fontSize: `${arabicFontSize}px` }}
                  >
                    {ayah.arabicText}
                  </div>

                  {/* Translations Container */}
                  <div className="space-y-4 pt-2">
                    
                    {/* Urdu Translation */}
                    {showUrdu && ayah.urduTranslation && (
                      <div className="p-4 rounded-2xl bg-ivory-50/80 dark:bg-charcoal-800/40 border border-ivory-200 dark:border-charcoal-700/60 space-y-1">
                        <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                          اردو ترجمہ (مولانا فتح محمد جالندھری)
                        </div>
                        <p
                          className="font-urdu text-right text-charcoal-800 dark:text-charcoal-200 leading-relaxed font-semibold"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {ayah.urduTranslation}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {showEnglish && ayah.englishTranslation && (
                      <div className="p-4 rounded-2xl bg-ivory-50/80 dark:bg-charcoal-800/40 border border-ivory-200 dark:border-charcoal-700/60 space-y-1">
                        <div className="text-[11px] font-bold text-charcoal-400">
                          English (Sahih International)
                        </div>
                        <p
                          className="text-charcoal-800 dark:text-charcoal-200 leading-relaxed font-normal"
                          style={{ fontSize: `${translationFontSize - 2}px` }}
                        >
                          {ayah.englishTranslation}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* 4 Action Buttons as requested in Section 7 */}
                  <div className="mt-6 pt-4 border-t border-ivory-100 dark:border-charcoal-800 flex flex-wrap items-center gap-2.5">
                    
                    {/* 1. Understand This Ayah */}
                    <Link
                      to={`/ayah/${num}/${ayah.ayahNumber}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'اس آیت کو سمجھیں' : 'Understand This Ayah'}</span>
                    </Link>

                    {/* 2. Scientific Perspective */}
                    <Link
                      to={`/ayah/${num}/${ayah.ayahNumber}#science`}
                      className="px-3.5 py-2 rounded-xl bg-ivory-100 dark:bg-charcoal-800 hover:bg-gold-50 dark:hover:bg-gold-950/40 text-charcoal-700 dark:text-charcoal-200 border border-ivory-200 dark:border-charcoal-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      <span>{isUrdu ? 'سائنسی نقطۂ نظر' : 'Scientific Perspective'}</span>
                    </Link>

                    {/* 3. Real-Life Example */}
                    <Link
                      to={`/ayah/${num}/${ayah.ayahNumber}#example`}
                      className="px-3.5 py-2 rounded-xl bg-ivory-100 dark:bg-charcoal-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-charcoal-700 dark:text-charcoal-200 border border-ivory-200 dark:border-charcoal-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isUrdu ? 'حقیقی زندگی کی مثال' : 'Real-Life Example'}</span>
                    </Link>

                    {/* 4. Ask AI */}
                    <Link
                      to={`/ai-tutor?surah=${num}&ayah=${ayah.ayahNumber}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition ml-auto rtl:ml-0 rtl:mr-auto"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'اے آئی سے پوچھیں' : 'Ask AI'}</span>
                    </Link>

                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
