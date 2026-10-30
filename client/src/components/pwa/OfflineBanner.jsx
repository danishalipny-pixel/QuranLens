import React from 'react';
import { WifiOff, RefreshCw, Sparkles } from 'lucide-react';
import { usePWA } from '../../context/PWAContext';
import { useLanguage } from '../../context/LanguageContext';

export default function OfflineBanner() {
  const { isOnline, isUpdateAvailable, updateApp } = usePWA();
  const { isUrdu } = useLanguage();

  if (isOnline && !isUpdateAvailable) return null;

  return (
    <div className={`w-full z-40 transition-all ${isUrdu ? 'font-urdu' : ''}`}>
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
              <span>
                {isUrdu
                  ? 'آپ اس وقت آف لائن ہیں — آف لائن ریڈنگ موڈ فعال ہے۔ تمام سورتیں، آیات اور تراجم بغیر انٹرنیٹ دستیاب ہیں۔'
                  : 'You are currently offline — Offline Reading Mode active. All cached Surahs and verses remain accessible.'}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-[11px] underline font-bold px-2 py-0.5 rounded hover:bg-amber-900/40 transition whitespace-nowrap"
            >
              {isUrdu ? 'دوبارہ کوشش کریں' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {/* App Update Available Banner */}
      {isUpdateAvailable && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>
                {isUrdu
                  ? 'قرآن لینز کی نئی اپڈیٹ دستیاب ہے!'
                  : 'A new version of QuranLens is available!'}
              </span>
            </div>
            <button
              onClick={updateApp}
              className="bg-white text-emerald-900 text-xs font-bold px-3 py-1 rounded-lg hover:bg-gold-300 transition shadow-sm whitespace-nowrap flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isUrdu ? 'ابھی اپڈیٹ کریں' : 'Update Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
