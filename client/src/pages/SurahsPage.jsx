import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, BookOpen, Layers, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import surahsData from '../data/surahs.json';

export default function SurahsPage() {
  const { isUrdu, isRTL, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All, Makki, Madani
  const [sort, setSort] = useState('number'); // number, revelation, ayahs-desc, ayahs-asc, alphabetical

  const filteredSurahs = useMemo(() => {
    let list = [...surahsData];

    // Search filter (number, English name, Arabic name, Urdu name)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.englishName.toLowerCase().includes(q) ||
          s.name.includes(q) ||
          (s.urduName && s.urduName.includes(q)) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          s.number.toString() === q
      );
    }

    // Revelation filter
    if (filter !== 'All') {
      const isMakki = filter === 'Makki';
      list = list.filter((s) =>
        isMakki
          ? s.revelationType === 'Makki' || s.revelationType === 'Meccan'
          : s.revelationType === 'Madani' || s.revelationType === 'Medinan'
      );
    }

    // Sorting
    if (sort === 'revelation') {
      list.sort((a, b) => (a.revelationOrder || 0) - (b.revelationOrder || 0));
    } else if (sort === 'ayahs-desc') {
      list.sort((a, b) => b.numberOfAyahs - a.numberOfAyahs);
    } else if (sort === 'ayahs-asc') {
      list.sort((a, b) => a.numberOfAyahs - b.numberOfAyahs);
    } else if (sort === 'alphabetical') {
      list.sort((a, b) => a.englishName.localeCompare(b.englishName));
    } else {
      list.sort((a, b) => a.number - b.number);
    }

    return list;
  }, [search, filter, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-urdu">
      
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-ivory-300 dark:border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{isUrdu ? 'فہرستِ قرآن مجید' : 'The Noble Qur\'an Index'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-900 dark:text-white">
            {isUrdu ? 'تمام 114 سورتیں' : 'All 114 Surahs'}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 mt-1 leading-relaxed">
            {isUrdu
              ? 'قرآن کریم کی تمام سورتوں کی تلاوت، اردو ترجمہ، سائنسی و تفسیری جائزے کا مطالعہ کریں۔'
              : 'Browse, search, and study chapters of the Quran with metadata and descriptions.'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-charcoal-500">
          <span className="px-3 py-1.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700">
            {isUrdu ? 'کل سورتیں: ' : 'Total: '}<strong className="text-emerald-800 dark:text-emerald-400 font-mono">114</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 border border-ivory-300 dark:border-charcoal-700">
            {isUrdu ? 'کل آیات: ' : 'Total: '}<strong className="text-emerald-800 dark:text-emerald-400 font-mono">6,236</strong>
          </span>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-charcoal-900 p-4 sm:p-5 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isUrdu ? "نام (مثلاً: الفاتحة، البقرة)، سورت نمبر (1-114) یا انگریزی نام سے تلاش کریں..." : "Search by name (e.g. Al-Fatihah, البقرة), meaning, or number (1-114)..."}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 bg-ivory-50 dark:bg-charcoal-800/80 border border-ivory-200 dark:border-charcoal-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-600"
            >
              {isUrdu ? 'صاف کریں' : 'Clear'}
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-ivory-100 dark:bg-charcoal-800 p-1 rounded-2xl text-xs">
          {[
            { id: 'All', label: isUrdu ? 'تمام' : 'All' },
            { id: 'Makki', label: isUrdu ? 'مکی سورتیں' : 'Makki' },
            { id: 'Madani', label: isUrdu ? 'مدنی سورتیں' : 'Madani' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-medium transition ${
                filter === tab.id
                  ? 'bg-emerald-800 text-white shadow-sm font-bold'
                  : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-ivory-50 dark:bg-charcoal-800 border border-ivory-200 dark:border-charcoal-700 rounded-2xl px-3.5 py-2.5 text-xs text-charcoal-700 dark:text-charcoal-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="number">{isUrdu ? 'قرآنی ترتیب (1 - 114)' : 'Surah Order (1 - 114)'}</option>
            <option value="revelation">{isUrdu ? 'نزولی ترتیب (تاریخی ترتیب)' : 'Chronological Revelation Order'}</option>
            <option value="ayahs-desc">{isUrdu ? 'زیادہ آیات والی سورتیں پہلے' : 'Most Ayahs First'}</option>
            <option value="ayahs-asc">{isUrdu ? 'کم آیات والی سورتیں پہلے' : 'Least Ayahs First'}</option>
            <option value="alphabetical">{isUrdu ? 'حروفِ تہجی کے اعتبار سے' : 'Alphabetical (A - Z)'}</option>
          </select>
        </div>

      </div>

      {/* Surahs Grid */}
      {filteredSurahs.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 text-charcoal-500 space-y-3">
          <p className="text-base font-bold">
            {isUrdu ? 'آپ کی تلاش کے مطابق کوئی سورت نہیں ملی۔' : 'No Surahs matched your search criteria.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFilter('All');
            }}
            className="text-xs sm:text-sm text-emerald-700 font-bold hover:underline"
          >
            {isUrdu ? 'فلٹرز دوبارہ ترتیب دیں' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSurahs.map((surah) => {
            const isMakki = surah.revelationType === 'Makki' || surah.revelationType === 'Meccan';
            return (
              <Link
                key={surah.number}
                to={`/surah/${surah.number}`}
                className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-emerald-500 hover:shadow-soft-lg transition-all group flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-ivory-100 dark:bg-charcoal-800 text-emerald-900 dark:text-emerald-300 flex items-center justify-center font-bold text-sm border border-ivory-200 dark:border-charcoal-700 group-hover:bg-emerald-800 group-hover:text-white transition-colors font-mono">
                        {String(surah.number).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-bold text-base text-charcoal-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">
                          {isUrdu ? (surah.urduName || surah.englishName) : surah.englishName}
                        </h3>
                        <p className="text-xs text-charcoal-500">
                          {surah.englishName} • {surah.englishNameTranslation}
                        </p>
                      </div>
                    </div>

                    <div className="text-right rtl:text-left">
                      <div className="font-arabic text-2xl font-bold text-emerald-950 dark:text-emerald-200 leading-snug">
                        {surah.name}
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-2 leading-relaxed">
                    {surah.description}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-ivory-100 dark:border-charcoal-800 flex items-center justify-between text-xs text-charcoal-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-charcoal-700 dark:text-charcoal-300">
                      {surah.numberOfAyahs} {isUrdu ? 'آیات' : 'Ayahs'}
                    </span>
                    <span>•</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                        isMakki
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-gold-50 dark:bg-gold-950/40 text-gold-800 dark:text-gold-300'
                      }`}
                    >
                      {isMakki ? (isUrdu ? 'مکی سورت' : 'Makki') : (isUrdu ? 'مدنی سورت' : 'Madani')}
                    </span>
                  </div>

                  {surah.revelationOrder && (
                    <span className="text-[10px] text-charcoal-400">
                      {isUrdu ? `نزولی نمبر #${surah.revelationOrder}` : `Order #${surah.revelationOrder}`}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
