import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Atom,
  HelpCircle,
} from 'lucide-react';
import { quranApi } from '../services/api';
import { SCIENCE_TOPICS_URDU, SCIENCE_CATEGORIES_URDU } from '../data/scienceUrdu';
import { useLanguage } from '../context/LanguageContext';

export default function ScienceDetailPage() {
  const { slug } = useParams();
  const { isUrdu } = useLanguage();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    quranApi.getScienceTopic(slug).then((res) => {
      if (res.success) {
        setTopic(res.data);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-20 text-center ${isUrdu ? 'font-urdu' : ''}`}>
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-charcoal-500">
          {isUrdu ? 'سائنسی موضوع کی تفصیلات لوڈ ہو رہی ہیں...' : 'Loading topic details...'}
        </p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-20 text-center ${isUrdu ? 'font-urdu' : ''}`}>
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
          {isUrdu ? 'موضوع دستیاب نہیں ہے' : 'Topic Not Found'}
        </h2>
        <Link to="/science" className="text-emerald-700 hover:underline">
          {isUrdu ? 'سائنس کے مرکزی صفحے پر واپس جائیں' : 'Return to Science Section'}
        </Link>
      </div>
    );
  }

  const urduInfo = SCIENCE_TOPICS_URDU[topic.slug] || {};
  const title = isUrdu ? urduInfo.titleUrdu || topic.title : topic.title;
  const category = isUrdu ? urduInfo.categoryUrdu || topic.category : topic.category;
  const summary = isUrdu ? urduInfo.summaryUrdu || topic.summary : topic.summary;
  const concept = isUrdu ? urduInfo.conceptUrdu || topic.scientificConcept : topic.scientificConcept;
  const confidence = isUrdu ? urduInfo.confidenceUrdu || topic.confidenceLevel : topic.confidenceLevel;
  const explanation = isUrdu ? urduInfo.explanationUrdu || topic.modernScientificExplanation : topic.modernScientificExplanation;
  const facts = isUrdu ? urduInfo.factsUrdu || topic.keyFacts : topic.keyFacts;

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-charcoal-500 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
        <Link
          to="/science"
          className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
        >
          <ChevronLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
          <span>{isUrdu ? 'تمام سائنسی موضوعات' : 'All Scientific Topics'}</span>
        </Link>
        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
          {category}
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-charcoal-950 text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{confidence}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight text-white ${isUrdu ? 'font-urdu-title leading-normal' : 'font-serif'}`}>
          {title}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
          {summary}
        </p>

        <div className="pt-2 text-xs text-emerald-300 font-medium flex items-center gap-2">
          <span>{isUrdu ? 'سائنسی تصور:' : 'Concept:'}</span>
          <span className="text-gold-300 font-bold">{concept}</span>
        </div>
      </div>

      {/* Modern Scientific Explanation Card */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
          <Atom className="w-5 h-5 text-emerald-600" />
          <h2 className={`text-lg font-bold text-charcoal-900 dark:text-white ${isUrdu ? 'font-urdu-title' : 'font-serif'}`}>
            {isUrdu ? 'جدید تجرباتی سائنسی تشریح' : 'Modern Empirical Scientific Explanation'}
          </h2>
        </div>

        <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed whitespace-pre-line">
          {explanation}
        </p>

        {/* Key Empirical Facts */}
        {facts && facts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-ivory-200 dark:border-charcoal-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-charcoal-400 mb-3">
              {isUrdu ? 'اہم سائنسی مشاہدات و حقائق' : 'Key Scientific Observations'}
            </h3>
            <div className="space-y-2.5">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-charcoal-700 dark:text-charcoal-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Relevant Quranic Passages & Reflections */}
      <div className="space-y-6">
        <div>
          <h2 className={`text-xl font-bold text-charcoal-900 dark:text-white ${isUrdu ? 'font-urdu-title' : 'font-serif'}`}>
            {isUrdu ? 'متعلقہ قرآنی آیات اور تدبر' : 'Relevant Qur\'anic Passages'}
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            {isUrdu
              ? 'قرآن مجید کی وہ آیات جو اس کائناتی اور فطری مظہر پر غور و فکر کی دعوت دیتی ہیں۔'
              : 'Verses that invite contemplation of this natural phenomenon.'}
          </p>
        </div>

        {topic.quranReferences.map((ref, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-ivory-100 dark:border-charcoal-800 text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {isUrdu ? `سورت ${ref.surahName}` : `Surah ${ref.surahName}`} ({ref.surahNumber}:{ref.ayahNumber})
              </span>
              <Link
                to={`/ayah/${ref.surahNumber}/${ref.ayahNumber}`}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{isUrdu ? 'مکمل آیت کا تفصیلی مطالعہ (۱۴ نکات)' : 'View Full Ayah Study'}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            {/* Arabic */}
            <div className="font-arabic text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-100 text-right leading-loose" dir="rtl">
              {ref.arabicText}
            </div>

            {/* Translations */}
            <div className="space-y-2 text-xs sm:text-sm">
              {ref.urduTranslation && (
                <div className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-800/50 border border-ivory-200 dark:border-charcoal-700 text-charcoal-800 dark:text-charcoal-200">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400 text-xs block mb-1">
                    {isUrdu ? 'مستند اردو ترجمہ:' : 'Urdu Translation:'}
                  </span>
                  "{ref.urduTranslation}"
                </div>
              )}

              {ref.englishTranslation && (
                <div className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-800/50 border border-ivory-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400 text-xs block mb-1">
                    {isUrdu ? 'انگریزی ترجمہ:' : 'English Translation:'}
                  </span>
                  "{ref.englishTranslation}"
                </div>
              )}
            </div>

            {/* Responsible Reflection Box */}
            {ref.possibleReflection && (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-charcoal-800 dark:text-emerald-200">
                <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                  {isUrdu ? 'ذمہ دارانہ علمی تدبر: ' : 'Responsible Scholarly Reflection: '}
                </span>
                {ref.possibleReflection}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verified Academic Sources */}
      {topic.scientificSources && topic.scientificSources.length > 0 && (
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 p-6 shadow-soft space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300">
            {isUrdu ? 'مستند تعلیمی اور سائنسی مآخذ (NASA, USGS, وغیرہ)' : 'Verified Academic & Scientific References'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topic.scientificSources.map((source, i) => (
              <a
                key={i}
                href={source.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-ivory-50 dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 hover:border-emerald-500 transition group flex items-start justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900 dark:text-white group-hover:text-emerald-600 transition">
                    {source.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-500">
                    {isUrdu ? `ناشر: ${source.publisher}` : `Publisher: ${source.publisher}`} {source.year && `(${source.year})`}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-charcoal-400 group-hover:text-emerald-600 flex-shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Strict Educational Disclaimer */}
      <div className="p-5 rounded-2xl bg-charcoal-900 text-ivory-200 border border-charcoal-800 flex items-start gap-3 text-xs leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-white">
            {isUrdu ? 'سائنسی مطالعے کے بارے میں شرعی و علمی وضاحت: ' : 'Disclaimer on Scientific Reflections: '}
          </span>
          {isUrdu
            ? 'قرآن مجید انسانوں کی ہدایت، اخلاق اور روحانی پاکیزگی کی کتاب ہے۔ کائناتی مظاہر کے تذکرے سے مقصد خدا کے حضور جھکنا اور کائنات میں نظم و تدبیر کو پہچاننا ہے، نہ کہ طبیعیاتی فارمولوں کی تشہیر۔'
            : topic.disclaimer}
        </p>
      </div>

    </div>
  );
}
