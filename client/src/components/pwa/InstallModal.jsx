import React from 'react';
import {
  X,
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  WifiOff,
  Smartphone,
  BookOpen,
} from 'lucide-react';
import { usePWA } from '../../context/PWAContext';
import { useLanguage } from '../../context/LanguageContext';

export default function InstallModal() {
  const { showInstallModal, setShowInstallModal, promptInstall, isInstallable, isIOS, isInstalled } = usePWA();
  const { isUrdu } = useLanguage();

  if (!showInstallModal || isInstalled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 shadow-soft-lg max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6 ${
          isUrdu ? 'font-urdu' : ''
        }`}
      >
        {/* Header with App Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src="/icons/icon-192.png"
              alt="QuranLens"
              className="w-14 h-14 rounded-2xl shadow-soft border border-emerald-700/30 object-cover"
            />
            <div>
              <h3 className={`text-lg font-bold text-charcoal-900 dark:text-white ${isUrdu ? 'font-urdu-title leading-snug' : 'font-serif'}`}>
                {isUrdu ? 'قرآن لینز ایپ انسٹال کریں' : 'Install QuranLens App'}
              </h3>
              <p className="text-xs text-charcoal-500">
                {isUrdu ? 'پڑھیں، سمجھیں، غور و فکر کریں۔' : 'Read. Understand. Reflect.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInstallModal(false)}
            className="p-1.5 rounded-full text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200 hover:bg-ivory-100 dark:hover:bg-charcoal-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits list */}
        <div className="space-y-2.5 p-4 rounded-2xl bg-ivory-50 dark:bg-charcoal-800/60 border border-ivory-200 dark:border-charcoal-700/60 text-xs">
          <div className="flex items-start gap-2.5 text-charcoal-800 dark:text-charcoal-200">
            <WifiOff className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {isUrdu
                ? 'مکمل آف لائن مطالعہ: بغیر انٹرنیٹ سورتیں، آیات اور ترجمہ پڑھیں۔'
                : 'Offline Reading: Access verified Surahs and translations without internet.'}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-charcoal-800 dark:text-charcoal-200">
            <Smartphone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              {isUrdu
                ? 'فل اسکرین تجربہ: بغیر براؤزر بارز کے خالص تعلیمی انٹرفیس۔'
                : 'Native Full-Screen: Distraction-free standalone mobile app view.'}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-charcoal-800 dark:text-charcoal-200">
            <Sparkles className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
            <span>
              {isUrdu
                ? 'فوری رسائی: ہوم اسکرین پر ایک کلک سے دستیاب۔'
                : 'One-Tap Access: Launch instantly from your device Home Screen.'}
            </span>
          </div>
        </div>

        {/* iOS vs Android / Desktop Instructions */}
        {isIOS ? (
          <div className="space-y-3 pt-2 border-t border-ivory-200 dark:border-charcoal-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300">
              {isUrdu ? 'آئی فون / آئی پیڈ پر انسٹال کرنے کا طریقہ:' : 'How to install on iOS / iPadOS:'}
            </h4>
            <ol className="space-y-2 text-xs text-charcoal-600 dark:text-charcoal-400">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px]">
                  ۱
                </span>
                <span>
                  {isUrdu ? 'سفاری براؤزر کی نچلی پٹی میں ' : 'Tap the '}
                  <strong>{isUrdu ? 'شیئر آئیکن ' : 'Share icon '}</strong>
                  <Share className="w-3.5 h-3.5 inline mx-1 text-emerald-600" />
                  {isUrdu ? 'پر ٹیپ کریں۔' : 'in the Safari bar.'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px]">
                  ۲
                </span>
                <span>
                  {isUrdu ? 'نیچے اسکرول کریں اور ' : 'Scroll down and tap '}
                  <strong>{isUrdu ? 'Add to Home Screen (ہوم اسکرین پر شامل کریں)' : 'Add to Home Screen'}</strong>
                  <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-600" />
                  {isUrdu ? 'منتخب کریں۔' : '.'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px]">
                  ۳
                </span>
                <span>
                  {isUrdu ? 'اوپر دائیں کونے میں ' : 'Tap '}
                  <strong>{isUrdu ? 'Add (شامل کریں)' : 'Add'}</strong>
                  {isUrdu ? 'پر ٹیپ کریں۔' : ' in the top right.'}
                </span>
              </li>
            </ol>
            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 rounded-xl bg-ivory-100 dark:bg-charcoal-800 hover:bg-ivory-200 text-charcoal-800 dark:text-charcoal-200 text-xs font-semibold mt-2"
            >
              {isUrdu ? 'سمجھ آ گیا' : 'Got it'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              onClick={promptInstall}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>{isUrdu ? 'ابھی ایپ انسٹال کریں' : 'Install App Now'}</span>
            </button>
            <p className="text-[11px] text-center text-charcoal-400">
              {isUrdu
                ? 'یہ ویب ایپ براہِ راست آپ کے موبائل یا کمپیوٹر پر محفوظ ہوتی ہے، پلے اسٹور کے بغیر۔'
                : 'Installs directly to your device storage without third-party app stores.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
