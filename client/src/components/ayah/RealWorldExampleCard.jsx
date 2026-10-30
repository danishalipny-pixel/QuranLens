import React from 'react';
import { Compass, CheckCircle2, HelpCircle, Lightbulb } from 'lucide-react';

export default function RealWorldExampleCard({ example, lifeLessons = [], reflectionQuestion }) {
  return (
    <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-ivory-200 dark:border-charcoal-800 shadow-soft overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-ivory-200 dark:border-charcoal-800 flex items-center justify-between bg-ivory-50/60 dark:bg-charcoal-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-900 dark:text-white">
              Real-World Application & Life Lessons
            </h3>
            <p className="text-xs text-charcoal-500">
              Connecting timeless guidance to modern daily life
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Everyday Example */}
        {example && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-charcoal-400 mb-2">
              Everyday Real-World Example
            </h4>
            <div className="p-4 rounded-xl bg-ivory-100/70 dark:bg-charcoal-800/70 border border-ivory-200 dark:border-charcoal-700/60 text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed">
              {example}
            </div>
          </div>
        )}

        {/* Practical Life Lessons */}
        {lifeLessons && lifeLessons.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2.5">
              Practical Lessons to Embody
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {lifeLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-charcoal-800 dark:text-charcoal-200 leading-snug">
                    {lesson}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contemplation / Reflection Question */}
        {reflectionQuestion && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-gold-50 to-ivory-100 dark:from-gold-950/20 dark:to-charcoal-800 border border-gold-200 dark:border-gold-900/30">
            <div className="flex items-center gap-2 mb-1.5 text-gold-900 dark:text-gold-300 font-semibold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-gold-600 dark:text-gold-400" />
              <span>Contemplation Question</span>
            </div>
            <p className="text-sm font-serif italic text-charcoal-900 dark:text-ivory-100">
              "{reflectionQuestion}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
