import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Sparkles, Compass, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { quranApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function SearchModal({ isOpen, onClose }) {
  const { isUrdu, isRTL } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ surahs: [], ayahs: [], science: [], topics: [] });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ surahs: [], ayahs: [], science: [], topics: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else if (window.onOpenSearchGlobal) window.onOpenSearchGlobal();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ surahs: [], ayahs: [], science: [], topics: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await quranApi.search(query);
        if (res.success && res.results) {
          setResults(res.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const totalResults =
    (results.surahs?.length || 0) +
    (results.ayahs?.length || 0) +
    (results.science?.length || 0) +
    (results.topics?.length || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-charcoal-900 rounded-3xl shadow-2xl border border-ivory-300 dark:border-charcoal-800 max-w-2xl w-full overflow-hidden z-10">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-ivory-200 dark:border-charcoal-800">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-2 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isUrdu ? "سورت، آیت، سائنسی موضوع یا لفظ تلاش کریں (مثلاً: پانی، کائنات، صبر، الفاتحہ)..." : "Search Surahs, Ayahs, water cycle, patience, embryology..."}
            className="w-full bg-transparent text-charcoal-900 dark:text-white placeholder-charcoal-400 focus:outline-none text-base font-urdu"
          />
          {loading && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin mx-2" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200 p-1 mx-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] bg-ivory-100 dark:bg-charcoal-800 text-charcoal-400 px-2 py-1 rounded-lg border border-ivory-300 dark:border-charcoal-700">
            ESC
          </kbd>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-ivory-50 dark:bg-charcoal-950/50 border-b border-ivory-200 dark:border-charcoal-800 text-xs overflow-x-auto font-urdu">
          {[
            { id: 'all', label: isUrdu ? `تمام نتائج (${totalResults})` : `All (${totalResults})` },
            { id: 'surahs', label: isUrdu ? `سورتیں (${results.surahs?.length || 0})` : `Surahs (${results.surahs?.length || 0})` },
            { id: 'ayahs', label: isUrdu ? `آیات (${results.ayahs?.length || 0})` : `Ayahs (${results.ayahs?.length || 0})` },
            { id: 'science', label: isUrdu ? `سائنسی موضوعات (${results.science?.length || 0})` : `Science (${results.science?.length || 0})` },
            { id: 'topics', label: isUrdu ? `موضوعات (${results.topics?.length || 0})` : `Topics (${results.topics?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-200 dark:hover:bg-charcoal-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-6">
          {!query.trim() && (
            <div className="py-12 text-center text-charcoal-400 font-urdu">
              <p className="text-sm font-bold mb-1">
                {isUrdu ? 'قرآن مجید میں تلاش کرنے کے لیے ٹائپ کریں' : 'Type to search QuranLens'}
              </p>
              <p className="text-xs">
                {isUrdu ? (
                  <>
                    مثال کے طور پر تلاش کریں:{' '}
                    <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => setQuery('پانی')}>"پانی"</span>،{' '}
                    <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => setQuery('کائنات')}>"کائنات"</span>، یا{' '}
                    <span className="text-emerald-600 font-bold cursor-pointer" onClick={() => setQuery('الفاتحة')}>"الفاتحة"</span>
                  </>
                ) : (
                  <>
                    Try searching for <span className="text-emerald-600 font-semibold cursor-pointer" onClick={() => setQuery('water')}>"water"</span>, <span className="text-emerald-600 font-semibold cursor-pointer" onClick={() => setQuery('patience')}>"patience"</span>, or <span className="text-emerald-600 font-semibold cursor-pointer" onClick={() => setQuery('Al-Fatihah')}>"Al-Fatihah"</span>
                  </>
                )}
              </p>
            </div>
          )}

          {query.trim() && totalResults === 0 && !loading && (
            <div className="py-12 text-center text-charcoal-500 font-urdu">
              <p className="text-base font-bold mb-1">
                {isUrdu ? 'کوئی نتیجہ نہیں ملا' : 'No results found'}
              </p>
              <p className="text-xs">
                {isUrdu ? 'مختلف الفاظ یا املا کے ساتھ دوبارہ کوشش کریں۔' : 'Try searching with different terms or spelling.'}
              </p>
            </div>
          )}

          {/* Sura Matches */}
          {(activeTab === 'all' || activeTab === 'surahs') && results.surahs?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 font-urdu">
                {isUrdu ? 'سورتیں' : 'Surahs'}
              </div>
              <div className="space-y-1.5">
                {results.surahs.map((s) => (
                  <div
                    key={s.number}
                    onClick={() => handleSelect(`/surah/${s.number}`)}
                    className="p-3 rounded-2xl hover:bg-ivory-100 dark:hover:bg-charcoal-800 cursor-pointer flex items-center justify-between border border-transparent hover:border-ivory-300 dark:hover:border-charcoal-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold font-mono">
                        {s.number}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-charcoal-900 dark:text-white font-urdu">
                          {s.urduName || s.englishName} ({s.englishName})
                        </div>
                        <div className="text-xs text-charcoal-400">
                          {s.numberOfAyahs} {isUrdu ? 'آیات' : 'Ayahs'} • {s.revelationType === 'Meccan' ? (isUrdu ? 'مکی' : 'Makki') : (isUrdu ? 'مدنی' : 'Madani')}
                        </div>
                      </div>
                    </div>
                    <span className="font-arabic text-lg font-bold text-emerald-800 dark:text-emerald-300">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Science Topic Matches */}
          {(activeTab === 'all' || activeTab === 'science') && results.science?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-gold-700 dark:text-gold-400 uppercase tracking-wider mb-2 font-urdu">
                {isUrdu ? 'سائنس اور فطرت کے موضوعات' : 'Scientific & Natural Phenomena'}
              </div>
              <div className="space-y-1.5">
                {results.science.map((sc) => (
                  <div
                    key={sc.slug}
                    onClick={() => handleSelect(`/science/${sc.slug}`)}
                    className="p-3 rounded-2xl hover:bg-gold-50/50 dark:hover:bg-gold-950/30 cursor-pointer flex items-center justify-between border border-transparent hover:border-gold-200 dark:hover:border-gold-900/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold-100 dark:bg-gold-950 text-gold-700 dark:text-gold-300 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-charcoal-900 dark:text-white font-urdu">
                          {sc.title}
                        </div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-400">
                          {sc.scientificConcept}
                        </div>
                      </div>
                    </div>
                    {isRTL ? <ArrowLeft className="w-4 h-4 text-charcoal-400" /> : <ArrowRight className="w-4 h-4 text-charcoal-400" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ayah Matches */}
          {(activeTab === 'all' || activeTab === 'ayahs') && results.ayahs?.length > 0 && (
            <div>
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 font-urdu">
                {isUrdu ? 'قرآنی آیات' : 'Ayahs'}
              </div>
              <div className="space-y-2">
                {results.ayahs.map((a) => (
                  <div
                    key={`${a.surahNumber}-${a.ayahNumber}`}
                    onClick={() => handleSelect(`/ayah/${a.surahNumber}/${a.ayahNumber}`)}
                    className="p-3.5 rounded-2xl hover:bg-ivory-100 dark:hover:bg-charcoal-800 cursor-pointer border border-ivory-200 dark:border-charcoal-800 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold font-mono">
                      <span>سورت {a.surahNumber}:{a.ayahNumber}</span>
                      <span className="text-emerald-600">مطالعہ کریں</span>
                    </div>
                    <div className="font-arabic text-base text-right text-emerald-950 dark:text-emerald-100 font-bold leading-relaxed">
                      {a.arabicText}
                    </div>
                    <p className="text-xs text-charcoal-700 dark:text-charcoal-300 font-urdu leading-relaxed">
                      {a.urduTranslation || a.englishTranslation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-ivory-100/70 dark:bg-charcoal-950/70 border-t border-ivory-200 dark:border-charcoal-800 text-[11px] text-charcoal-500 flex items-center justify-between font-urdu">
          <span>{isUrdu ? 'قرآن لینز: پڑھیں، سمجھیں، غور و فکر کریں' : 'QuranLens Search'}</span>
          <span>{isUrdu ? 'بند کرنے کے لیے ESC دبائیں' : 'Press ESC to close'}</span>
        </div>

      </div>
    </div>
  );
}
