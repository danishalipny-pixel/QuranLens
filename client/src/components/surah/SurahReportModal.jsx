import React from 'react';
import { Printer, Download, X, ExternalLink, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function SurahReportModal({ isOpen, onClose, report, surah }) {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white dark:bg-charcoal-900 border border-ivory-300 dark:border-charcoal-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Header - Screen Only */}
        <div className="flex items-center justify-between p-6 border-b border-ivory-200 dark:border-charcoal-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold font-serif text-charcoal-900 dark:text-white">
                Surah Science & Conceptual Report
              </h2>
              <p className="text-xs text-charcoal-500">
                Surah {report.surahNumber} — {report.surahName} ({report.nameArabic})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" className="p-8 sm:p-12 space-y-8 print:p-6 text-charcoal-900 dark:text-charcoal-100 print:text-black">
          
          {/* Document Header */}
          <div className="text-center pb-6 border-b border-ivory-200 dark:border-charcoal-800 space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold print:border-black">
              QuranLens Academic & Scientific Perspective Series
            </div>
            <h1 className="text-3xl font-bold font-serif text-charcoal-950 dark:text-white print:text-black">
              Comprehensive Analysis: Surah {report.surahName}
            </h1>
            <div className="font-arabic text-3xl text-gold-600 dark:text-gold-400 font-bold py-1 print:text-black">
              {report.nameArabic}
            </div>
            <p className="text-xs text-charcoal-500 print:text-charcoal-600">
              Surah #{report.surahNumber} • {report.totalAyahs} Ayahs • {report.revelationType} Revelation • Generated: {new Date(report.generatedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          {/* Classification & Summary */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Scientific Relationship:
              </span>
              <span className="px-3 py-1 rounded-xl bg-gold-100 dark:bg-gold-950/80 text-gold-800 dark:text-gold-300 font-bold text-xs border border-gold-300 dark:border-gold-800 print:border-black print:text-black">
                {report.classification || 'Natural phenomenon'}
              </span>
              {report.primaryDomains && report.primaryDomains.map((dom, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 text-xs border border-ivory-200 dark:border-charcoal-700 print:border-black print:text-black">
                  {dom}
                </span>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-ivory-50 dark:bg-charcoal-800/40 border border-ivory-200 dark:border-charcoal-700 print:border-black">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2">
                Executive Overview
              </h3>
              <p className="text-sm leading-relaxed text-charcoal-800 dark:text-charcoal-200 print:text-black">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Scientific Concepts Breakdown */}
          {report.scientificConcepts && report.scientificConcepts.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-lg font-bold font-serif text-charcoal-950 dark:text-white border-b border-ivory-200 dark:border-charcoal-800 pb-2 print:text-black">
                Identified Scientific & Natural Themes
              </h2>

              {report.scientificConcepts.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-ivory-200 dark:border-charcoal-800 space-y-4 bg-white dark:bg-charcoal-900 print:border-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center print:border print:border-black">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-charcoal-900 dark:text-white print:text-black">
                        {item.concept}
                      </h3>
                    </div>
                    {item.domain && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gold-50 dark:bg-gold-950/40 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-800 print:text-black">
                        {item.domain}
                      </span>
                    )}
                  </div>

                  {item.ayahReferences && item.ayahReferences.map((ref, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-xl bg-ivory-50 dark:bg-charcoal-800/50 space-y-2 border border-ivory-100 dark:border-charcoal-700 print:border-black">
                      <div className="flex items-center justify-between text-xs text-charcoal-500 font-semibold">
                        <span>Ayah {report.surahNumber}:{ref.ayahNumber}</span>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          {ref.classification || 'Natural phenomenon'}
                        </span>
                      </div>
                      <div className="font-arabic text-xl text-right text-emerald-950 dark:text-emerald-100 font-bold print:text-black">
                        {ref.arabicText}
                      </div>
                      <p className="text-xs text-charcoal-700 dark:text-charcoal-300 italic print:text-black">
                        "{ref.translation}"
                      </p>
                      {ref.reflection && (
                        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 pt-1 border-t border-ivory-200 dark:border-charcoal-700">
                          <strong className="text-charcoal-800 dark:text-charcoal-200">Reflection:</strong> {ref.reflection}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider">
                      Modern Scientific Explanation:
                    </h4>
                    <p className="text-charcoal-700 dark:text-charcoal-300 leading-relaxed print:text-black">
                      {item.modernExplanation}
                    </p>
                  </div>

                  {item.realWorldExample && (
                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-xs text-charcoal-700 dark:text-charcoal-300 border border-emerald-100 dark:border-emerald-900/40">
                      <strong className="text-emerald-900 dark:text-emerald-300">Everyday Example:</strong> {item.realWorldExample}
                    </div>
                  )}

                  {item.sources && item.sources.length > 0 && (
                    <div className="text-xs space-y-1 pt-2">
                      <span className="font-bold text-charcoal-500 uppercase tracking-wider">Research Citations:</span>
                      <ul className="list-disc pl-5 text-charcoal-600 dark:text-charcoal-400 space-y-1">
                        {item.sources.map((s, sIdx) => (
                          <li key={sIdx}>
                            <strong>{s.title}</strong> — {s.publisher} ({s.date || 'Recent'}).
                            {s.url && <span className="text-emerald-700 dark:text-emerald-400 ml-1">[{s.url}]</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-ivory-100/70 dark:bg-charcoal-800/40 border border-ivory-300 dark:border-charcoal-700 space-y-2 print:border-black">
              <h3 className="text-sm font-bold text-charcoal-900 dark:text-white print:text-black">
                No Direct Physical Science Theme Claimed
              </h3>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed print:text-black">
                QuranLens strictly avoids forcing modern scientific parallels where none are supported by classical hermeneutics or context. Surah {report.surahName} addresses core moral, spiritual, and theological principles.
              </p>
            </div>
          )}

          {/* Classical Tafsir Context */}
          {report.classicalTafsirSummary && (
            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 space-y-2 print:border-black">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-charcoal-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Classical Exegetical Commentary (*Tafsir*)</span>
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed print:text-black">
                {report.classicalTafsirSummary}
              </p>
            </div>
          )}

          {/* Ethical & Religious Boundary Disclaimer */}
          <div className="p-5 rounded-2xl bg-gold-50/60 dark:bg-gold-950/20 border border-gold-200 dark:border-gold-900/40 space-y-2 print:border-black text-xs text-charcoal-700 dark:text-charcoal-300">
            <div className="flex items-center gap-2 font-bold text-gold-900 dark:text-gold-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Academic & Religious Safety Notice</span>
            </div>
            <p className="leading-relaxed print:text-black">
              {report.limitationsAndNotice || 'Educational reflection only. The Qur’an is a book of spiritual, ethical, and theological guidance. Scientific observations provide educational context and Tadabbur without claiming final empirical proof.'}
            </p>
          </div>

          {/* Document Footer */}
          <div className="pt-6 border-t border-ivory-200 dark:border-charcoal-800 text-center text-xs text-charcoal-400 print:text-charcoal-600">
            <p>QuranLens — Read. Understand. Reflect. • www.quranlens.org</p>
            <p className="text-[10px] mt-0.5">Verified educational content curated with peer-reviewed scientific repositories.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
