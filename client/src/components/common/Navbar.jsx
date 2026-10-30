import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Compass,
  Bot,
  Search,
  Sun,
  Moon,
  Bookmark,
  User,
  Menu,
  X,
  Type,
  ShieldAlert,
  Languages,
} from 'lucide-react';
import { useReading } from '../../context/ReadingContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar({ onOpenSearch }) {
  const location = useLocation();
  const { theme, toggleTheme, arabicFontSize, setArabicFontSize, translationFontSize, setTranslationFontSize } = useReading();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isUrdu, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);

  const navLinks = [
    { name: isUrdu ? 'تمام سورتیں' : 'Surahs', path: '/surahs', icon: BookOpen },
    { name: isUrdu ? 'موضوعات' : 'Topics', path: '/topics', icon: Compass },
    { name: isUrdu ? 'سائنس اور قرآن' : 'Science & Quran', path: '/science', icon: Sparkles },
    { name: isUrdu ? 'اے آئی اتالیق' : 'AI Tutor', path: '/ai-tutor', icon: Bot, badge: 'AI' },
    { name: isUrdu ? 'ہمارے بارے میں' : 'About', path: '/about', icon: null },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-ivory-300 dark:border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="font-arabic text-xl font-bold">قرآن</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400 font-serif">
                  {isUrdu ? 'قرآن لینز' : 'QuranLens'}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-800 dark:text-gold-300 border border-gold-300 dark:border-gold-800/60 font-urdu">
                  {isUrdu ? 'تدبّر و فہم' : 'Reflect'}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 dark:text-charcoal-400 tracking-wide font-medium hidden sm:block font-urdu">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold shadow-sm'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Switcher (Urdu / English) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition"
              title={isUrdu ? "انگریزی زبان میں دیکھیں (Switch to English)" : "Switch to Urdu (اردو میں دیکھیں)"}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-charcoal-500 dark:text-charcoal-400 bg-ivory-100 dark:bg-charcoal-800 hover:bg-ivory-200 dark:hover:bg-charcoal-700 rounded-xl border border-ivory-300 dark:border-charcoal-700 transition"
              title={isUrdu ? "قرآنی آیات، سورتیں اور سائنسی موضوعات تلاش کریں (Ctrl+K)" : "Search Quran, Ayahs & Science (Ctrl+K)"}
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">{isUrdu ? 'تلاش کریں...' : 'Search...'}</span>
              <kbd className="hidden lg:inline text-[10px] bg-white dark:bg-charcoal-900 px-1.5 py-0.5 rounded border border-charcoal-300 dark:border-charcoal-700 text-charcoal-400">
                ⌘K
              </kbd>
            </button>

            {/* Typography Controls Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFontMenuOpen(!fontMenuOpen)}
                className={`p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition ${
                  fontMenuOpen ? 'bg-ivory-200 dark:bg-charcoal-700' : ''
                }`}
                title={isUrdu ? "فونٹ سائز ایڈجسٹ کریں" : "Adjust font sizes"}
              >
                <Type className="w-4 h-4" />
              </button>

              {fontMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-white dark:bg-charcoal-900 rounded-2xl shadow-soft-lg border border-ivory-200 dark:border-charcoal-800 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-ivory-200 dark:border-charcoal-800">
                    <span className="text-xs font-semibold text-charcoal-700 dark:text-charcoal-200 uppercase tracking-wider font-urdu">
                      {isUrdu ? 'حروف کا سائز تبدیل کریں' : 'Text Customization'}
                    </span>
                    <button
                      onClick={() => setFontMenuOpen(false)}
                      className="text-charcoal-400 hover:text-charcoal-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Arabic Font Slider */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-charcoal-600 dark:text-charcoal-400 mb-1">
                      <span>{isUrdu ? 'عربی فونٹ کا سائز' : 'Arabic Size'}</span>
                      <span className="font-semibold text-emerald-600">{arabicFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="22"
                      max="44"
                      value={arabicFontSize}
                      onChange={(e) => setArabicFontSize(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-ivory-200 dark:bg-charcoal-800 rounded-lg cursor-pointer"
                    />
                    <div className="font-arabic text-center mt-1 text-emerald-900 dark:text-emerald-200" style={{ fontSize: `${arabicFontSize * 0.75}px` }}>
                      بِسْمِ اللَّهِ
                    </div>
                  </div>

                  {/* Translation Font Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-charcoal-600 dark:text-charcoal-400 mb-1">
                      <span>{isUrdu ? 'ترجمہ کا سائز' : 'Translation Size'}</span>
                      <span className="font-semibold text-emerald-600">{translationFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="13"
                      max="24"
                      value={translationFontSize}
                      onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-1.5 bg-ivory-200 dark:bg-charcoal-800 rounded-lg cursor-pointer"
                    />
                    <div className="text-center mt-1 text-charcoal-700 dark:text-charcoal-300 text-xs font-urdu">
                      شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition"
              title={isUrdu ? "ڈارک / لائٹ موڈ تبدیل کریں" : "Toggle theme"}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-gold-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>

            {/* Bookmarks / Profile Link */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/profile"
                  className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800 relative transition"
                  title={isUrdu ? "آپ کی پروفائل اور بک مارکس" : "Your Profile & Bookmarks"}
                >
                  <Bookmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1 text-xs bg-gold-50 dark:bg-gold-950/40 text-gold-800 dark:text-gold-300 px-2.5 py-1.5 rounded-xl border border-gold-300 dark:border-gold-800/50 font-semibold"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'ایڈمن' : 'Admin'}</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-emerald-400 transition"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'لاگ ان' : 'Sign In'}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-ivory-100 dark:hover:bg-charcoal-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-charcoal-900 border-b border-ivory-300 dark:border-charcoal-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-charcoal-700 dark:text-charcoal-200 hover:bg-ivory-100 dark:hover:bg-charcoal-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-ivory-200 dark:border-charcoal-800 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{isUrdu ? `میری پروفائل (${user?.name})` : `My Profile (${user?.name})`}</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs bg-gold-100 dark:bg-gold-900 text-gold-800 dark:text-gold-200 px-2 py-1 rounded font-semibold"
                  >
                    {isUrdu ? 'ایڈمن کنٹرول' : 'Admin'}
                  </Link>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-emerald-800 text-white"
              >
                {isUrdu ? 'لاگ ان کریں / اکاؤنٹ بنائیں' : 'Sign In / Register'}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
