import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WordByWordCard({ words = [] }) {
  const [selectedWord, setSelectedWord] = useState(null);

  if (!words || words.length === 0) {
    return (
      <div className="p-6 text-center text-charcoal-400 bg-ivory-50 dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 text-sm">
        Word-by-word morphological breakdown is being compiled for this passage.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-charcoal-400">
        <span>Tap any word to inspect meaning and grammatical role:</span>
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
          {words.length} Words
        </span>
      </div>

      {/* Grid of Word Cards (RTL Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3" dir="rtl">
        {words.map((w, idx) => {
          const isSelected = selectedWord === idx;
          return (
            <div
              key={idx}
              onClick={() => setSelectedWord(isSelected ? null : idx)}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-soft scale-105'
                  : 'bg-white dark:bg-charcoal-900 border-ivory-300 dark:border-charcoal-800 hover:border-emerald-400 hover:bg-ivory-50 dark:hover:bg-charcoal-800'
              }`}
            >
              {/* Arabic Word */}
              <div className="font-arabic text-2xl font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                {w.word}
              </div>

              {/* Transliteration */}
              {w.transliteration && (
                <div className="text-[11px] font-mono text-charcoal-400 mb-1" dir="ltr">
                  {w.transliteration}
                </div>
              )}

              {/* English Meaning */}
              <div className="text-xs font-semibold text-charcoal-800 dark:text-charcoal-200 mb-0.5" dir="ltr">
                {w.english}
              </div>

              {/* Urdu Meaning */}
              <div className="text-xs text-charcoal-600 dark:text-charcoal-400 font-arabic font-medium">
                {w.urdu}
              </div>

              {/* Tag / Grammar */}
              {w.grammar && (
                <span className="inline-block mt-2 text-[9px] px-1.5 py-0.5 rounded bg-ivory-200 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 font-medium" dir="ltr">
                  {w.grammar}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Word Detail Banner */}
      {selectedWord !== null && words[selectedWord] && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-arabic text-2xl font-bold text-emerald-900 dark:text-emerald-300">
              {words[selectedWord].word}
            </span>
            <div>
              <p className="font-semibold text-charcoal-900 dark:text-white">
                {words[selectedWord].english} • <span className="font-arabic">{words[selectedWord].urdu}</span>
              </p>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400">
                Grammar: {words[selectedWord].grammar || 'Root & Morphological Component'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedWord(null)}
            className="text-xs text-emerald-800 dark:text-emerald-400 hover:underline font-semibold"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
