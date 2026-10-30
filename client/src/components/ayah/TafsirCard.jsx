import React from 'react';
import { BookOpen, ShieldAlert } from 'lucide-react';

export default function TafsirCard({ tafsir, context }) {
  if (!tafsir && !context) return null;

  return (
    <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-ivory-200 dark:border-charcoal-800 flex items-center justify-between bg-ivory-50/60 dark:bg-charcoal-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-900 dark:text-white">
              Classical Tafsir & Historical Context
            </h3>
            <p className="text-xs text-charcoal-500">
              Source: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{tafsir?.source || 'Recognized Exegetical Tradition'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Context of Revelation */}
        {context && (context.surahContext || context.historicalBackground) && (
          <div className="p-4 rounded-xl bg-ivory-100/70 dark:bg-charcoal-800/60 border border-ivory-200 dark:border-charcoal-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-300 mb-1.5">
              Historical Background & Surah Context
            </h4>
            {context.surahContext && (
              <p className="text-xs text-charcoal-700 dark:text-charcoal-300 leading-relaxed mb-1">
                {context.surahContext}
              </p>
            )}
            {context.historicalBackground && (
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 italic">
                {context.historicalBackground}
              </p>
            )}
          </div>
        )}

        {/* Exegetical Tafsir Content */}
        {tafsir?.content && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2">
              Scholarly Exegesis (Tafsir)
            </h4>
            <div className="text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed space-y-2 whitespace-pre-line">
              {tafsir.content}
            </div>
          </div>
        )}

        {/* Boundary Notice */}
        <div className="pt-3 border-t border-ivory-200 dark:border-charcoal-800 text-[11px] text-charcoal-400 italic">
          Note: In accordance with Islamic scholarly ethics, Tafsir represents human scholarly interpretation and is presented separately from the divine Qur'anic text and authentic literal translations.
        </div>

      </div>
    </div>
  );
}
