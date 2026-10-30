import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Compass, Bot, Heart, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { isUrdu, t } = useLanguage();

  return (
    <footer className="bg-charcoal-900 text-ivory-100 border-t border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-charcoal-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-arabic text-xl font-bold shadow-soft flex-shrink-0">
                قرآن
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">
                {isUrdu ? 'قرآن لینز' : 'QuranLens'}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-charcoal-300 max-w-sm leading-relaxed font-urdu">
              {isUrdu
                ? 'ایک ممتاز علمی و تربیتی پلیٹ فارم جو مستند ترجمہ، تفہیم، تاریخی پس منظر، جدید سائنسی مطالعہ اور اخلاقی تدبر کے ذریعے فہمِ قرآن کو آسان بناتا ہے۔'
                : 'An educational platform dedicated to authentic Qur\'anic understanding through translation, context, responsible scientific exploration, and contemplative reflection.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold tracking-wide font-urdu">
              <span>{isUrdu ? 'پڑھیں' : 'Read'}</span>
              <span>•</span>
              <span>{isUrdu ? 'سمجھیں' : 'Understand'}</span>
              <span>•</span>
              <span>{isUrdu ? 'غور و فکر کریں' : 'Reflect'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-urdu">
              {isUrdu ? 'قرآن مجید کا مطالعہ' : 'Explore Quran'}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-300 font-urdu">
              <li>
                <Link to="/surahs" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'تمام 114 سورتیں' : 'All 114 Surahs'}
                </Link>
              </li>
              <li>
                <Link to="/surah/1" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'سورۃ الفاتحہ' : 'Surah Al-Fatihah'}
                </Link>
              </li>
              <li>
                <Link to="/surah/36" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'سورۃ یٰسٓ' : 'Surah Ya-Sin'}
                </Link>
              </li>
              <li>
                <Link to="/surah/55" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'سورۃ الرحمٰن' : 'Surah Ar-Rahman'}
                </Link>
              </li>
              <li>
                <Link to="/surah/67" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'سورۃ الملک' : 'Surah Al-Mulk'}
                </Link>
              </li>
              <li>
                <Link to="/topics" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'قرآنی موضوعات' : 'Thematic Explorer'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Science & AI Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-urdu">
              {isUrdu ? 'تدبر و سائنسی تجزیہ' : 'Reflection & AI'}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-300 font-urdu">
              <li>
                <Link to="/science" className="hover:text-emerald-300 transition flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <span>{isUrdu ? 'سائنس اور قرآن' : 'Science Section'}</span>
                </Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="hover:text-emerald-300 transition flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{isUrdu ? 'اردو اے آئی اتالیق' : 'AI Quran Tutor'}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'علمی اصول و طریقہ کار' : 'Principles & Methodology'}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'محفوظ شدہ بک مارکس' : 'Saved Bookmarks'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Methodology */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-urdu">
              {isUrdu ? 'مستند مآخذ و رہنمائی' : 'Platform & Legal'}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-300 font-urdu">
              <li>
                <Link to="/about#sources" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'مستند مآخذ و تفاسیر' : 'Verified Sources'}
                </Link>
              </li>
              <li>
                <Link to="/about#safety" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'مواد کی تصدیق و حدود' : 'Content Safety'}
                </Link>
              </li>
              <li>
                <Link to="/about#contact" className="hover:text-emerald-300 transition">
                  {isUrdu ? 'رابطہ و علمی مشاورت' : 'Contact Academic Team'}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Educational & Religious Disclaimer */}
        <div className="my-8 p-4 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 text-xs text-charcoal-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-urdu">
            <span className="font-semibold text-white">
              {isUrdu ? 'اہم علمی و شرعی وضاحت: ' : 'Important Educational Disclaimer: '}
            </span>
            {isUrdu
              ? 'قرآن لینز ایک تعلیمی و تدبری پلیٹ فارم ہے۔ یہاں بیان کردہ سائنسی معلومات اور افکار انسان کو غور و فکر اور تخلیقِ کائنات میں تدبر کی دعوت دیتے ہیں، یہ سائنسی آراء مستند تفاسیر یا شرعی احکامات کا متبادل نہیں ہیں، اور نہ ہی یہ دعویٰ کیا جاتا ہے کہ سائنس قرآن کو ثابت کرتی ہے۔'
              : 'QuranLens is an educational platform. Scientific perspectives presented here are educational interpretations and should not be treated as replacements for established Tafsir or scholarly guidance.'}
          </p>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4 font-urdu">
          <p>
            © {new Date().getFullYear()} قرآن لینز (QuranLens)۔ مستند قرآنی تعلیم اور فہمِ دین کے لیے وقف۔
          </p>
          <div className="flex items-center gap-4 text-charcoal-400">
            <span>{isUrdu ? 'عثمانی رسم الخط کا تحفظ' : 'Uthmanic Text Preservation'}</span>
            <span>•</span>
            <span>{isUrdu ? 'غیر متنازع سائنسی و تفسیری منہج' : 'Non-Speculative Scholarship'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
