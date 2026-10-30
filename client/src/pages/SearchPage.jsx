import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, Sparkles, Compass, ArrowRight, Loader2 } from 'lucide-react';
import { quranApi } from '../services/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({ surahs: [], ayahs: [], science: [], topics: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    quranApi.search(query).then((res) => {
      if (res.success && res.results) {
        setResults(res.results);
      }
      setLoading(false);
    });
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const totalResults =
    (results.surahs?.length || 0) +
    (results.ayahs?.length || 0) +
    (results.science?.length || 0) +
    (results.topics?.length || 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal-900 dark:text-white">
          Search the Qur'an & Reflections
        </h1>
        <p className="text-sm text-charcoal-500 mt-1">
          Search across all 114 Surahs, Ayahs, scientific topics, and thematic principles.
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-5 h-5 text-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keywords: water, mountains, sabr, Fatihah, iron..."
          className="w-full pl-12 pr-32 py-3.5 bg-white dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 shadow-soft text-charcoal-900 dark:text-white"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
        >
          Search
        </button>
      </form>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-charcoal-800 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'all', label: `All Results (${totalResults})` },
          { id: 'surahs', label: `Surahs (${results.surahs?.length || 0})` },
          { id: 'ayahs', label: `Ayahs (${results.ayahs?.length || 0})` },
          { id: 'science', label: `Science (${results.science?.length || 0})` },
          { id: 'topics', label: `Topics (${results.topics?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white'
                : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 text-center text-charcoal-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
          <span className="text-sm">Searching QuranLens database...</span>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="space-y-8">
          
          {/* Surahs Section */}
          {(activeTab === 'all' || activeTab === 'surahs') && results.surahs?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Matching Surahs</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.surahs.map((s) => (
                  <Link
                    key={s.number}
                    to={`/surah/${s.number}`}
                    className="p-4 rounded-xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-emerald-500 transition group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-charcoal-400">Surah #{s.number}</div>
                      <h4 className="text-base font-bold text-charcoal-900 dark:text-white group-hover:text-emerald-700">
                        {s.englishName} ({s.englishNameTranslation})
                      </h4>
                      <p className="text-xs text-charcoal-500">{s.numberOfAyahs} Ayahs • {s.revelationType}</p>
                    </div>
                    <span className="font-arabic text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                      {s.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ayahs Section */}
          {(activeTab === 'all' || activeTab === 'ayahs') && results.ayahs?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Matching Ayahs</span>
              </h3>
              <div className="space-y-3">
                {results.ayahs.map((a) => (
                  <Link
                    key={`${a.surahNumber}-${a.ayahNumber}`}
                    to={`/ayah/${a.surahNumber}/${a.ayahNumber}`}
                    className="block p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-emerald-500 transition space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                      <span>Surah {a.surahNumber}:{a.ayahNumber}</span>
                      <ArrowRight className="w-4 h-4 text-charcoal-400" />
                    </div>
                    <div className="font-arabic text-lg text-right text-emerald-950 dark:text-emerald-100">
                      {a.arabicText}
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 italic">
                      "{a.englishTranslation}"
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Science Section */}
          {(activeTab === 'all' || activeTab === 'science') && results.science?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Scientific Topics</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.science.map((sc) => (
                  <Link
                    key={sc.slug}
                    to={`/science/${sc.slug}`}
                    className="p-5 rounded-xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-gold-500 transition space-y-1.5"
                  >
                    <div className="text-xs text-emerald-700 font-semibold">{sc.category}</div>
                    <h4 className="text-sm font-bold text-charcoal-900 dark:text-white">
                      {sc.title}
                    </h4>
                    <p className="text-xs text-charcoal-500 line-clamp-2">{sc.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Topics Section */}
          {(activeTab === 'all' || activeTab === 'topics') && results.topics?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Thematic Topics</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.topics.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/topics/${t.slug}`}
                    className="p-5 rounded-xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:border-emerald-500 transition space-y-1.5"
                  >
                    <div className="text-xs text-emerald-700 font-semibold">{t.category}</div>
                    <h4 className="text-sm font-bold text-charcoal-900 dark:text-white">
                      {t.title}
                    </h4>
                    <p className="text-xs text-charcoal-500 line-clamp-2">{t.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
