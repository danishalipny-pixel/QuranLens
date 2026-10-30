import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, ChevronLeft, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { quranApi } from '../services/api';
import { TOPICS_DATA_URDU, TOPICS_CATEGORIES_URDU } from '../data/topicsUrdu';
import { useLanguage } from '../context/LanguageContext';

export default function TopicDetailPage() {
  const { slug } = useParams();
  const { isUrdu } = useLanguage();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    quranApi.getTopic(slug).then((res) => {
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
          {isUrdu ? 'موضوع لوڈ ہو رہا ہے...' : 'Loading topic...'}
        </p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-20 text-center ${isUrdu ? 'font-urdu' : ''}`}>
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
          {isUrdu ? 'موضوع نہیں مل سکا' : 'Topic Not Found'}
        </h2>
        <Link to="/topics" className="text-emerald-700 hover:underline">
          {isUrdu ? 'موضوعات کے فہرست پر واپس جائیں' : 'Return to Topics Explorer'}
        </Link>
      </div>
    );
  }

  const urduInfo = TOPICS_DATA_URDU[topic.slug] || {};
  const title = isUrdu ? urduInfo.titleUrdu || topic.titleUrdu || topic.title : topic.title;
  const category = isUrdu ? urduInfo.categoryUrdu || topic.category : topic.category;
  const description = isUrdu ? urduInfo.descUrdu || topic.description : topic.description;
  const principles = isUrdu ? urduInfo.principlesUrdu || topic.corePrinciples : topic.corePrinciples;

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-charcoal-500 pb-4 border-b border-ivory-200 dark:border-charcoal-800">
        <Link
          to="/topics"
          className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
        >
          <ChevronLeft className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
          <span>{isUrdu ? 'تمام موضوعات' : 'All Topics'}</span>
        </Link>
        <span className="font-semibold text-emerald-800 dark:text-emerald-400">
          {category}
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-charcoal-950 text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 font-semibold border border-emerald-600">
            {category}
          </span>
          {!isUrdu && (
            <span className="font-arabic text-xl font-bold text-gold-400">
              {topic.titleUrdu}
            </span>
          )}
        </div>

        <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight text-white ${isUrdu ? 'font-urdu-title leading-normal' : 'font-serif'}`}>
          {title}
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {/* Core Principles */}
      {principles && (
        <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className={`text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 ${isUrdu ? 'font-urdu-title' : ''}`}>
            {isUrdu ? 'بنیادی قرآنی اصول اور اخلاقی رہنمائی' : 'Core Qur\'anic Principles & Lessons'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {principles.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800/60 border border-ivory-200 dark:border-charcoal-700/60 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-charcoal-800 dark:text-charcoal-200 leading-relaxed">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verses Section */}
      <div className="space-y-6">
        <div>
          <h2 className={`text-xl font-bold text-charcoal-900 dark:text-white ${isUrdu ? 'font-urdu-title' : 'font-serif'}`}>
            {isUrdu ? `موضوع "${title}" کے بارے میں قرآنی آیات` : `Qur'anic Verses on ${topic.title}`}
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            {isUrdu
              ? 'قرآن مجید کی منتخب اور واضح آیات جو اس فکری موضوع کی وضاحت کرتی ہیں۔'
              : 'Carefully curated verses demonstrating this principle in the Qur\'an.'}
          </p>
        </div>

        {topic.verses.map((v, idx) => {
          const verseKey = `${v.surahNumber}:${v.ayahNumber}`;
          const urduTr = urduInfo.versesTranslationUrdu?.[verseKey];

          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-ivory-100 dark:border-charcoal-800 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-400">
                  {isUrdu ? `سورت ${v.surahName}` : `Surah ${v.surahName}`} ({v.surahNumber}:{v.ayahNumber})
                </span>
                <Link
                  to={`/ayah/${v.surahNumber}/${v.ayahNumber}`}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{isUrdu ? 'مکمل آیت کا تفصیلی مطالعہ' : 'Full Ayah Detail'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* Arabic preview */}
              <div className="font-arabic text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-100 text-right leading-loose" dir="rtl">
                {v.arabicPreview}
              </div>

              {/* Translation preview */}
              <div className="p-3.5 rounded-xl bg-ivory-50 dark:bg-charcoal-800/50 border border-ivory-200 dark:border-charcoal-700 text-xs sm:text-sm text-charcoal-800 dark:text-charcoal-200">
                {isUrdu && urduTr ? (
                  <span>"{urduTr}"</span>
                ) : (
                  <span className="italic">"{v.translationPreview}"</span>
                )}
              </div>

              {/* Theme Connection */}
              {v.themeConnection && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                    {isUrdu ? 'موضوعاتی بصیرت: ' : 'Theme Insight: '}
                  </span>
                  {v.themeConnection}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
