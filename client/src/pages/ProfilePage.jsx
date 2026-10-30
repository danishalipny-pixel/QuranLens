import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  BookOpen,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  Settings,
  LogOut,
  User,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useReading } from '../context/ReadingContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isUrdu } = useLanguage();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { bookmarks, notes, readingHistory, removeBookmark, addNote, deleteNote } = useBookmarks();
  const { arabicFontSize, setArabicFontSize, translationFontSize, setTranslationFontSize, showUrdu, setShowUrdu, showEnglish, setShowEnglish } = useReading();

  const [activeTab, setActiveTab] = useState('bookmarks');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [noteSurah, setNoteSurah] = useState(1);
  const [noteAyah, setNoteAyah] = useState(1);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const collections = [
    { id: 'All', urdu: 'تمام مجموعات', en: 'All' },
    { id: 'Favorites', urdu: 'پسندیدہ', en: 'Favorites' },
    { id: 'Study', urdu: 'علمی مطالعہ', en: 'Study' },
    { id: 'Daily Reading', urdu: 'روزمرہ تلاوت', en: 'Daily Reading' },
    { id: 'Science', urdu: 'سائنسی آیات', en: 'Science' },
    { id: 'Reflections', urdu: 'فکری تدبر', en: 'Reflections' },
  ];

  const filteredBookmarks = bookmarks.filter((b) =>
    selectedCollection === 'All' ? true : b.collectionName === selectedCollection
  );

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNote(noteSurah, noteAyah, {
      title: newNoteTitle,
      content: newNoteContent,
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-charcoal-900 text-white p-6 sm:p-10 rounded-3xl shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold shadow-soft">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'ق'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl font-bold ${isUrdu ? 'font-urdu-title' : 'font-serif'}`}>
                {user?.name || (isUrdu ? 'طالبِ قرآن' : 'Quran Student')}
              </h1>
              {isAdmin && (
                <span className="text-[10px] font-bold bg-gold-400 text-charcoal-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {isUrdu ? 'منتظم' : 'Admin'}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {user?.email || (isUrdu ? 'طالب علم کا اکاؤنٹ' : 'Student Account')}
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-300/80 mt-2">
              <span>{bookmarks.length} {isUrdu ? 'بک مارکس' : 'Bookmarks'}</span>
              <span>•</span>
              <span>{notes.length} {isUrdu ? 'نوٹس' : 'Notes'}</span>
              <span>•</span>
              <span>{readingHistory.length} {isUrdu ? 'مطالعے کے ریکارڈز' : 'History Logs'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isUrdu ? 'ایڈمن کنٹرول' : 'Admin Dashboard'}</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-charcoal-800/80 hover:bg-charcoal-800 text-charcoal-200 rounded-xl text-xs font-semibold border border-charcoal-700 transition flex items-center gap-1.5"
          >
            <LogOut className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
            <span>{isUrdu ? 'لاگ آؤٹ' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-ivory-200 dark:border-charcoal-800 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'bookmarks', labelUrdu: `محفوظ شدہ آیات (${bookmarks.length})`, labelEn: `Saved Bookmarks (${bookmarks.length})`, icon: Bookmark },
          { id: 'history', labelUrdu: `مطالعے کی تاریخ (${readingHistory.length})`, labelEn: `Reading History (${readingHistory.length})`, icon: Clock },
          { id: 'notes', labelUrdu: `ذاتی نوٹس و تدبر (${notes.length})`, labelEn: `Personal Notes (${notes.length})`, icon: BookOpen },
          { id: 'settings', labelUrdu: `مطالعے کی ترجیحات`, labelEn: `Reading Preferences`, icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = isUrdu ? tab.labelUrdu : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          {/* Collection Pills */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
            {collections.map((coll) => (
              <button
                key={coll.id}
                onClick={() => setSelectedCollection(coll.id)}
                className={`px-3 py-1.5 rounded-lg transition font-medium whitespace-nowrap ${
                  selectedCollection === coll.id
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:bg-ivory-200'
                }`}
              >
                {isUrdu ? coll.urdu : coll.en}
              </button>
            ))}
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 text-charcoal-400">
              <Bookmark className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">
                {isUrdu ? 'اس مجموعے میں ابھی کوئی بک مارک موجود نہیں ہے۔' : 'No bookmarks in this collection yet.'}
              </p>
              <p className="text-xs mt-1">
                {isUrdu
                  ? 'مطالعے کے دوران کسی بھی آیت کے بک مارک آئیکن پر کلک کر کے اسے یہاں محفوظ کریں۔'
                  : 'Tap the bookmark icon on any Ayah while reading to save it here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">
                        {isUrdu ? `سورت ${b.surahName}` : b.surahName} ({b.surahNumber}:{b.ayahNumber})
                      </span>
                      <span className="text-[10px] bg-ivory-100 dark:bg-charcoal-800 text-charcoal-500 px-2 py-0.5 rounded font-medium">
                        {b.collectionName}
                      </span>
                    </div>

                    {b.arabicPreview && (
                      <p className="font-arabic text-lg text-right text-emerald-950 dark:text-emerald-200 line-clamp-1 mb-2" dir="rtl">
                        {b.arabicPreview}
                      </p>
                    )}

                    {b.englishPreview && (
                      <p className="text-xs text-charcoal-600 dark:text-charcoal-300 line-clamp-2 italic">
                        "{b.englishPreview}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-ivory-100 dark:border-charcoal-800 flex items-center justify-between">
                    <Link
                      to={`/ayah/${b.surahNumber}/${b.ayahNumber}`}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{isUrdu ? 'آیت کا تفصیلی مطالعہ' : 'Study Ayah'}</span>
                      <ExternalLink className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                    </Link>

                    <button
                      onClick={() => removeBookmark(b.id)}
                      className="text-charcoal-400 hover:text-red-500 p-1"
                      title={isUrdu ? 'بک مارک حذف کریں' : 'Remove Bookmark'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: READING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {readingHistory.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 text-charcoal-400">
              <Clock className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">
                {isUrdu ? 'مطالعے کا کوئی ریکارڈ ابھی محفوظ نہیں ہوا۔' : 'No reading history recorded yet.'}
              </p>
              <p className="text-xs mt-1">
                {isUrdu
                  ? 'جیسے جیسے آپ سورتوں اور آیات کا مطالعہ کریں گے، آپ کی حالیہ پڑھائی یہاں ظاہر ہوگی۔'
                  : 'As you explore Surahs and Ayahs, your recent passages will appear here.'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 divide-y divide-ivory-100 dark:divide-charcoal-800 shadow-soft">
              {readingHistory.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-ivory-50 dark:hover:bg-charcoal-800/50 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                      {item.surahNumber}:{item.ayahNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-charcoal-900 dark:text-white">
                        {item.surahName || (isUrdu ? `سورت ${item.surahNumber}` : `Surah ${item.surahNumber}`)}
                      </h4>
                      <p className="text-[11px] text-charcoal-400">
                        {isUrdu ? 'آخری مطالعہ:' : 'Last opened:'} {new Date(item.timestamp).toLocaleDateString()} {isUrdu ? 'بوقت' : 'at'} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/ayah/${item.surahNumber}/${item.ayahNumber}`}
                    className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{isUrdu ? 'مطالعہ جاری رکھیں' : 'Resume'}</span>
                    <ExternalLink className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PERSONAL NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300">
              {isUrdu ? 'ذاتی فکری و مطالعاتی نوٹس' : 'Personal Study Notes'}
            </h3>
            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'نیا نوٹ شامل کریں' : 'Add Note'}</span>
            </button>
          </div>

          {/* Add Note Form */}
          {isAddingNote && (
            <form onSubmit={handleAddNoteSubmit} className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-700 shadow-soft space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal-600 mb-1">
                    {isUrdu ? 'سورت نمبر' : 'Surah #'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="114"
                    value={noteSurah}
                    onChange={(e) => setNoteSurah(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-ivory-50 dark:bg-charcoal-800 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal-600 mb-1">
                    {isUrdu ? 'آیت نمبر' : 'Ayah #'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={noteAyah}
                    onChange={(e) => setNoteAyah(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-ivory-50 dark:bg-charcoal-800 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 mb-1">
                  {isUrdu ? 'نوٹ کا عنوان (اختیاری)' : 'Note Title (Optional)'}
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: صبر اور زندگی کے امتحانات پر تدبر' : 'e.g. Reflection on patience in hard times'}
                  className="w-full px-3 py-1.5 bg-ivory-50 dark:bg-charcoal-800 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-600 mb-1">
                  {isUrdu ? 'نوٹ کا متن اور فکری اسباق' : 'Note Content'}
                </label>
                <textarea
                  rows="3"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={isUrdu ? 'اپنے خیالات، فکری اسباق اور ذاتی تدبر یہاں درج کریں...' : 'Record your thoughts, lessons, and personal reflections...'}
                  required
                  className="w-full p-3 bg-ivory-50 dark:bg-charcoal-800 border rounded-lg text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1.5 text-xs text-charcoal-500 hover:text-charcoal-700"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                >
                  {isUrdu ? 'محفوظ کریں' : 'Save Reflection'}
                </button>
              </div>
            </form>
          )}

          {/* Notes list */}
          {notes.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 text-charcoal-400">
              <BookOpen className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">
                {isUrdu ? 'ابھی تک کوئی ذاتی نوٹ درج نہیں ہوا۔' : 'No personal notes yet.'}
              </p>
              <p className="text-xs mt-1">
                {isUrdu
                  ? 'اوپر "نیا نوٹ شامل کریں" پر کلک کر کے اپنے فکری اسباق تحریر کریں۔'
                  : 'Click "Add Note" above to write down reflections and lessons.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      <span>{isUrdu ? `سورت ${n.surahNumber}:${n.ayahNumber}` : `Surah ${n.surahNumber}:${n.ayahNumber}`}</span>
                      {n.title && <span className="text-charcoal-900 dark:text-white">• {n.title}</span>}
                    </div>
                    <p className="text-xs text-charcoal-700 dark:text-charcoal-300 leading-relaxed whitespace-pre-line">
                      {n.content}
                    </p>
                    <div className="text-[10px] text-charcoal-400">
                      {isUrdu ? 'محفوظ شدہ تاریخ:' : 'Saved'} {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/ayah/${n.surahNumber}/${n.ayahNumber}`}
                      className="p-1.5 text-charcoal-400 hover:text-emerald-700"
                      title={isUrdu ? 'آیت کھولیں' : 'Open Ayah'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="p-1.5 text-charcoal-400 hover:text-red-500"
                      title={isUrdu ? 'نوٹ حذف کریں' : 'Delete Note'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: READING PREFERENCES */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-charcoal-900 p-6 sm:p-8 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft max-w-xl space-y-6">
          <h3 className={`text-base font-bold text-charcoal-900 dark:text-white ${isUrdu ? 'font-urdu-title' : ''}`}>
            {isUrdu ? 'مطالعہ اور اسکرین کے ڈسپلے کی سیٹنگز' : 'Display & Reading Customization'}
          </h3>

          {/* Arabic Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
              <span>{isUrdu ? 'قرآنی عربی فونٹ کا سائز' : 'Arabic Font Size'}</span>
              <span className="text-emerald-600">{arabicFontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="46"
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-ivory-200 dark:bg-charcoal-800 rounded-lg cursor-pointer"
            />
            <div className="font-arabic text-right p-3 bg-ivory-50 dark:bg-charcoal-800 rounded-xl mt-2 text-emerald-950 dark:text-emerald-200 leading-relaxed" style={{ fontSize: `${arabicFontSize}px` }} dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Translation Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-charcoal-700 dark:text-charcoal-300">
              <span>{isUrdu ? 'ترجمے اور تفسیر کے فونٹ کا سائز' : 'Translation Font Size'}</span>
              <span className="text-emerald-600">{translationFontSize}px</span>
            </div>
            <input
              type="range"
              min="13"
              max="24"
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-ivory-200 dark:bg-charcoal-800 rounded-lg cursor-pointer"
            />
            <div className="p-3 bg-ivory-50 dark:bg-charcoal-800 rounded-xl mt-2 text-charcoal-700 dark:text-charcoal-300" style={{ fontSize: `${translationFontSize}px` }}>
              {isUrdu
                ? 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔'
                : '"In the name of Allah, the Entirely Merciful, the Especially Merciful."'}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-4 border-t border-ivory-200 dark:border-charcoal-800 space-y-3">
            <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
              <span>{isUrdu ? 'ہمیشہ اردو ترجمہ دکھائیں (مولانا فاتح محمد جالندھری)' : 'Always display Urdu translation (Jalandhry)'}</span>
              <input
                type="checkbox"
                checked={showUrdu}
                onChange={(e) => setShowUrdu(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
              <span>{isUrdu ? 'انگریزی ترجمہ بھی ساتھ دکھائیں' : 'Always display English translation'}</span>
              <input
                type="checkbox"
                checked={showEnglish}
                onChange={(e) => setShowEnglish(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

    </div>
  );
}
