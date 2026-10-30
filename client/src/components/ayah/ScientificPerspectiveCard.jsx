import React from 'react';
import { Sparkles, ExternalLink, ShieldCheck, Info, BookOpen, Layers } from 'lucide-react';

export default function ScientificPerspectiveCard({ perspective, classification, ayahData }) {
  // Extract data from either perspective or ayahData
  const hasConnection =
    perspective?.hasConnection ||
    (classification && classification !== 'No clear scientific relationship' && classification !== 'Ethical/spiritual message');

  const concept = perspective?.concept || ayahData?.scientificTopic || 'Theological & Moral Guidance';
  const modernExplanation = perspective?.modernExplanation || ayahData?.modernScientificExplanation;
  const possibleReflection = perspective?.possibleReflection || ayahData?.possibleRelationship;
  const sources = perspective?.sources || ayahData?.scientificReferences || [];
  const relClassification = classification || ayahData?.scientificClassification || (hasConnection ? 'Natural phenomenon' : 'Ethical/spiritual message');

  const getBadgeStyle = (cls) => {
    switch (cls) {
      case 'Direct scientific subject':
      case 'Direct Natural Phenomenon':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80',
          text: 'text-emerald-900 dark:text-emerald-300',
          border: 'border-emerald-300 dark:border-emerald-700',
        };
      case 'Natural phenomenon':
        return {
          bg: 'bg-sky-100 dark:bg-sky-950/80',
          text: 'text-sky-900 dark:text-sky-300',
          border: 'border-sky-300 dark:border-sky-700',
        };
      case 'Indirect conceptual relationship':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80',
          text: 'text-amber-900 dark:text-amber-300',
          border: 'border-amber-300 dark:border-amber-700',
        };
      case 'Ethical/spiritual message':
        return {
          bg: 'bg-purple-100 dark:bg-purple-950/80',
          text: 'text-purple-900 dark:text-purple-300',
          border: 'border-purple-300 dark:border-purple-700',
        };
      case 'No clear scientific relationship':
      default:
        return {
          bg: 'bg-charcoal-100 dark:bg-charcoal-800',
          text: 'text-charcoal-700 dark:text-charcoal-300',
          border: 'border-charcoal-300 dark:border-charcoal-700',
        };
    }
  };

  const badgeStyle = getBadgeStyle(relClassification);

  if (!hasConnection) {
    return (
      <div className="bg-ivory-100/70 dark:bg-charcoal-900/60 rounded-3xl border border-ivory-300 dark:border-charcoal-800 p-6 sm:p-8 space-y-4 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-charcoal-800 dark:text-charcoal-200">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold font-serif">Scientific Relationship Classification</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
            {relClassification}
          </span>
        </div>

        <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
          No direct physical scientific connection is claimed for this verse.
        </p>

        <p className="text-xs text-charcoal-500 dark:text-charcoal-400 leading-relaxed italic">
          QuranLens strictly distinguishes spiritual, ethical, and legal verses from empirical physical phenomena. This verse directs the human conscience toward purpose, piety, and moral accountability without presenting technical physical mechanics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-gold-200 dark:border-charcoal-700 shadow-soft-lg overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-charcoal-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-300 border border-gold-400/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-serif">
              Scientific Perspective & Conceptual Reflection
            </h3>
            <p className="text-xs text-emerald-200">
              Concept: <span className="text-gold-300 font-semibold">{concept}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
            {relClassification}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Modern Scientific Explanation */}
        {modernExplanation && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Modern Scientific Explanation</span>
            </h4>
            <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
              {modernExplanation}
            </p>
          </div>
        )}

        {/* Relationship or Possible Reflection */}
        {possibleReflection && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <span>Possible Reflection & Connection</span>
            </h4>
            <p className="text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed italic">
              "{possibleReflection}"
            </p>
          </div>
        )}

        {/* Academic Sources */}
        {sources && sources.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-charcoal-400">
              Verified Scientific Citations & Institutional Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 border border-ivory-200 dark:border-charcoal-700 hover:text-emerald-600 transition"
                >
                  <span className="font-semibold">{src.name || src.title}</span>
                  {(src.publisher || src.type) && (
                    <span className="text-[10px] text-charcoal-400 font-mono">
                      ({src.publisher || src.type})
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-charcoal-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mandatory Educational Notice */}
        <div className="pt-4 border-t border-ivory-200 dark:border-charcoal-800 flex items-start gap-2.5 text-xs text-charcoal-500 dark:text-charcoal-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Educational reflection only. Quranic verses invite contemplation (Tadabbur) and are not technical science textbooks. Never state that modern science "proves" the Quran; rather, explore how observable regularities in nature harmonize with spiritual consciousness.
          </p>
        </div>

      </div>
    </div>
  );
}
