import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Search, ArrowRight, ShieldCheck, Heart, Scale, BookOpen, Smile } from 'lucide-react';
import topicsData from '../data/topics.json';
import { TOPICS_CATEGORIES_URDU, TOPICS_DATA_URDU } from '../data/topicsUrdu';
import { useLanguage } from '../context/LanguageContext';

const ICON_MAP = {
  ShieldCheck,
  Heart,
  Scale,
  BookOpen,
  Smile,
  Compass,
};

export default function TopicsPage() {
  const { isUrdu } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Faith & Reflection',
    'Ethics & Morality',
    'Society & Justice',
    'Nature & Cosmos',
  ];

  const filteredTopics = useMemo(() => {
    return topicsData.filter((topic) => {
      const urduInfo = TOPICS_DATA_URDU[topic.slug] || {};
      const matchCat = selectedCategory === 'All' || topic.category === selectedCategory;
      const searchLower = search.toLowerCase();
      const matchSearch =
        topic.title.toLowerCase().includes(searchLower) ||
        topic.description.toLowerCase().includes(searchLower) ||
        (topic.titleUrdu && topic.titleUrdu.includes(search)) ||
        (urduInfo.descUrdu && urduInfo.descUrdu.includes(search));
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'قرآنی موضوعاتی و فکری انسائیکلوپیڈیا' : 'Thematic Quran Explorer'}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-950 dark:text-emerald-200' : 'font-serif text-charcoal-900 dark:text-white'}`}>
          {isUrdu ? 'قرآنی موضوعات اور اخلاقی رہنمائی کا مطالعہ' : 'Explore the Qur\'an by Topic & Theme'}
        </h1>

        <p className="text-sm sm:text-base text-charcoal-600 dark:text-charcoal-300 max-w-3xl leading-relaxed">
          {isUrdu
            ? 'جانیں کہ قرآن مجید کس طرح آفاقی انسانی موضوعات پر رہنمائی فراہم کرتا ہے: صبر و استقامت، شکر گزاری، سماجی عدل و انصاف، فکری جستجو اور انسانی ہمدردی۔'
            : 'Discover how the Qur\'an addresses universal human themes: patience through adversity, active gratitude, social justice, the pursuit of knowledge, and universal compassion.'}
        </p>
      </div>

      {/* Search & Categories */}
      <div className="bg-white dark:bg-charcoal-900 p-4 sm:p-5 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="relative flex-1">
          <Search className={`w-4 h-4 text-charcoal-400 absolute ${isUrdu ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isUrdu
                ? 'موضوع تلاش کریں (مثلاً: صبر، عدل، شکر، علم، رحمت، کائنات)...'
                : 'Search by topic (e.g. Patience, Justice, Gratitude, علم)...'
            }
            className={`w-full ${isUrdu ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 bg-ivory-50 dark:bg-charcoal-800/80 border border-ivory-200 dark:border-charcoal-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
          {categories.map((cat) => {
            const label = isUrdu ? TOPICS_CATEGORIES_URDU[cat] || cat : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-medium transition ${
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
          const Icon = ICON_MAP[topic.icon] || Compass;
          const urduInfo = TOPICS_DATA_URDU[topic.slug] || {};
          const title = isUrdu ? urduInfo.titleUrdu || topic.titleUrdu || topic.title : topic.title;
          const category = isUrdu ? urduInfo.categoryUrdu || topic.category : topic.category;
          const desc = isUrdu ? urduInfo.descUrdu || topic.description : topic.description;
          const principles = isUrdu ? urduInfo.principlesUrdu || topic.corePrinciples : topic.corePrinciples;

          return (
            <Link
              key={topic.slug}
              to={`/topics/${topic.slug}`}
              className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:shadow-soft-lg hover:border-emerald-500 transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {category}
                  </span>
                  {!isUrdu && (
                    <span className="font-arabic text-sm text-charcoal-500">
                      {topic.titleUrdu}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 border border-emerald-200 dark:border-emerald-800/40">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-lg font-bold text-charcoal-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition ${isUrdu ? 'font-urdu-title leading-normal' : ''}`}>
                    {title}
                  </h3>
                </div>

                <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed mb-4">
                  {desc}
                </p>

                {/* Core Principles Preview */}
                {principles && (
                  <div className="space-y-1.5 pt-2 border-t border-ivory-100 dark:border-charcoal-800">
                    {principles.slice(0, 2).map((p, i) => (
                      <div key={i} className="text-[11px] text-charcoal-600 dark:text-charcoal-400 flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span className="line-clamp-1">{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-ivory-100 dark:border-charcoal-800 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                <span>{isUrdu ? `${topic.verses.length} منتخب آیات` : `${topic.verses.length} Key Verses`}</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isUrdu ? 'موضوع کا مطالعہ کریں' : 'Explore Theme'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
