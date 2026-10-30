import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  CloudRain,
  Telescope,
  HeartHandshake,
  Mountain,
  Waves,
  ShieldAlert,
  Shield,
  Leaf,
  Bug,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import scienceData from '../data/scienceTopics.json';
import { SCIENCE_CATEGORIES_URDU, SCIENCE_TOPICS_URDU } from '../data/scienceUrdu';
import { useLanguage } from '../context/LanguageContext';

const ICON_MAP = {
  CloudRain,
  Telescope,
  HeartHandshake,
  Mountain,
  Waves,
  ShieldAlert,
  Shield,
  Leaf,
  Bug,
  Sparkles,
};

export default function SciencePage() {
  const { language, isUrdu } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Hydrology & Earth',
    'Astronomy & Cosmology',
    'Biology & Embryology',
    'Geology & Topography',
    'Atmosphere & Physics',
    'Zoology & Ecology',
  ];

  const filteredTopics = useMemo(() => {
    return scienceData.filter((topic) => {
      const urduInfo = SCIENCE_TOPICS_URDU[topic.slug] || {};
      const matchesCat =
        selectedCategory === 'All' || topic.category === selectedCategory;
      
      const searchLower = search.toLowerCase();
      const matchesSearch =
        topic.title.toLowerCase().includes(searchLower) ||
        topic.summary.toLowerCase().includes(searchLower) ||
        topic.scientificConcept.toLowerCase().includes(searchLower) ||
        (urduInfo.titleUrdu && urduInfo.titleUrdu.includes(search)) ||
        (urduInfo.summaryUrdu && urduInfo.summaryUrdu.includes(search));

      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 border border-gold-300 dark:border-gold-800/60 text-gold-900 dark:text-gold-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>{isUrdu ? 'جدید سائنسی نقطۂ نظر اور قرآنی تدبر' : 'Scientific Perspectives & Responsible Reflection'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-950 dark:text-emerald-200' : 'font-serif text-charcoal-900 dark:text-white'}`}>
          {isUrdu ? 'مظاہرِ فطرت، کائنات اور جدید سائنسی علوم' : 'Natural Phenomena & Modern Knowledge'}
        </h1>

        <p className="text-sm sm:text-base text-charcoal-600 dark:text-charcoal-300 max-w-3xl leading-relaxed">
          {isUrdu
            ? 'قرآن مجید کی ان آیات پر غور کریں جو کائنات، بارش کے نظام، انسانی تخلیق، سمندروں اور زمین کے بارے میں تدبر کی دعوت دیتی ہیں، اور جدید سائنسی علوم کی روشنی میں ان کے ممکنہ پہلوؤں کو سمجھیں۔'
            : 'Explore modern scientific descriptions of natural phenomena alongside Qur\'anic passages that invite contemplation of the cosmos, hydrology, embryology, and the Earth.'}
        </p>

        {/* Core Principle Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">{isUrdu ? 'ہمارا علمی و اصولی منہج: ' : 'Our Educational Methodology: '}</span>
            {isUrdu
              ? 'قرآن مجید روحانی و اخلاقی رہنمائی کی کتاب ہے، سائنس کی نصابی کتاب نہیں۔ ہم سائنسی مظاہر کا جائزہ مستند علمی شواہد کے ساتھ لیتے ہیں اور اس غیر علمی دعوے سے سختی سے گریز کرتے ہیں کہ "سائنس نے قرآن کو ثابت کر دیا ہے۔"'
              : 'The Quran is a divine book of spiritual guidance and moral signs (Ayat), not an empirical textbook. We examine scientific concepts with verified academic sources, strictly avoiding dogmatic claims that modern discoveries "prove" scripture.'}
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white dark:bg-charcoal-900 p-4 sm:p-5 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className={`w-4 h-4 text-charcoal-400 absolute ${isUrdu ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isUrdu
                ? 'آبی چکر، کائنات کا پھیلاؤ، جنین، لوہا، یا پہاڑوں کے توازن کی تلاش کریں...'
                : 'Search water cycle, astronomy, embryonic development, iron...'
            }
            className={`w-full ${isUrdu ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 bg-ivory-50 dark:bg-charcoal-800/80 border border-ivory-200 dark:border-charcoal-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {categories.map((cat) => {
            const label = isUrdu ? SCIENCE_CATEGORIES_URDU[cat] || cat : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const IconComponent = ICON_MAP[topic.icon] || Sparkles;
          const urduInfo = SCIENCE_TOPICS_URDU[topic.slug] || {};
          const title = isUrdu ? urduInfo.titleUrdu || topic.title : topic.title;
          const category = isUrdu ? urduInfo.categoryUrdu || topic.category : topic.category;
          const summary = isUrdu ? urduInfo.summaryUrdu || topic.summary : topic.summary;
          const confidence = isUrdu ? urduInfo.confidenceUrdu || topic.confidenceLevel : topic.confidenceLevel;

          return (
            <div
              key={topic.slug}
              className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                
                {/* Category & Confidence Badge */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {category}
                  </span>
                  <span className="text-[10px] bg-ivory-100 dark:bg-charcoal-800 px-2 py-0.5 rounded text-charcoal-500 font-medium">
                    {confidence.split(' ')[0]}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-300 flex items-center justify-center flex-shrink-0 border border-gold-200 dark:border-gold-800/40">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className={`text-base font-bold text-charcoal-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition ${isUrdu ? 'font-urdu-title leading-normal' : ''}`}>
                    {title}
                  </h3>
                </div>

                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed mb-4">
                  {summary}
                </p>

                {/* Quran References Preview */}
                <div className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-800/50 border border-ivory-200 dark:border-charcoal-700/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                    <span>{isUrdu ? 'قرآنی آیت کا حوالہ:' : 'Qur\'anic Passage:'}</span>
                    <span>
                      {topic.quranReferences[0]?.surahName} {topic.quranReferences[0]?.surahNumber}:{topic.quranReferences[0]?.ayahNumber}
                    </span>
                  </div>
                  <p className="font-arabic text-sm text-right text-emerald-950 dark:text-emerald-200 line-clamp-1" dir="rtl">
                    {topic.quranReferences[0]?.arabicText}
                  </p>
                  <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 italic line-clamp-2">
                    {isUrdu
                      ? topic.quranReferences[0]?.urduTranslation || topic.quranReferences[0]?.englishTranslation
                      : `"${topic.quranReferences[0]?.englishTranslation}"`}
                  </p>
                </div>

              </div>

              {/* Card Footer Link */}
              <div className="p-4 bg-ivory-50/70 dark:bg-charcoal-950/50 border-t border-ivory-200 dark:border-charcoal-800 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-400">
                  {isUrdu ? `${topic.keyFacts?.length || 3} اہم حقائق` : `${topic.keyFacts?.length || 3} Key Facts`}
                </span>
                <Link
                  to={`/science/${topic.slug}`}
                  className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>{isUrdu ? 'سائنس اور آیات کی تفصیل دیکھیں' : 'Explore Science & Verses'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
