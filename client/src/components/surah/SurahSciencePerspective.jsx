import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  FileText,
  Info,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Compass,
  HelpCircle,
  Layers,
  Scale,
} from 'lucide-react';
import { quranApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import SurahReportModal from './SurahReportModal';

export default function SurahSciencePerspective({ surah, analysis, onAnalysisUpdate }) {
  const { isUrdu, t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRegenerate = async () => {
    setAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await quranApi.regenerateSurahAnalysis(surah.number);
      if (res?.success && res?.data) {
        onAnalysisUpdate(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || (isUrdu ? 'سورت کے سائنسی تجزیے میں مسئلہ پیش آیا۔' : 'Failed to re-analyze Surah.'));
    } finally {
      setAnalyzing(false);
    }
  };

  const report = analysis;

  const getClassificationBadge = (classification) => {
    switch (classification) {
      case 'Direct scientific subject':
      case 'Direct Natural Phenomenon':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80',
          text: 'text-emerald-900 dark:text-emerald-300',
          border: 'border-emerald-300 dark:border-emerald-700',
          label: isUrdu ? 'براہِ راست سائنسی موضوع' : 'Direct Scientific Subject',
        };
      case 'Natural phenomenon':
        return {
          bg: 'bg-sky-100 dark:bg-sky-950/80',
          text: 'text-sky-900 dark:text-sky-300',
          border: 'border-sky-300 dark:border-sky-700',
          label: isUrdu ? 'قدرتی مظاہر' : 'Natural Phenomenon',
        };
      case 'Indirect conceptual relationship':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80',
          text: 'text-amber-900 dark:text-amber-300',
          border: 'border-amber-300 dark:border-amber-700',
          label: isUrdu ? 'ضمنی فکری و تصوراتی تعلق' : 'Indirect Conceptual Relationship',
        };
      case 'Ethical/spiritual message':
        return {
          bg: 'bg-purple-100 dark:bg-purple-950/80',
          text: 'text-purple-900 dark:text-purple-300',
          border: 'border-purple-300 dark:border-purple-700',
          label: isUrdu ? 'اخلاقی و روحانی پیغام' : 'Ethical / Spiritual Focus',
        };
      case 'No clear scientific relationship':
      default:
        return {
          bg: 'bg-charcoal-100 dark:bg-charcoal-800',
          text: 'text-charcoal-700 dark:text-charcoal-300',
          border: 'border-charcoal-300 dark:border-charcoal-700',
          label: isUrdu ? 'کوئی براہِ راست سائنسی دعویٰ نہیں' : 'No Direct Physical Science Subject',
        };
    }
  };

  const badgeStyle = getClassificationBadge(report?.classification);

  return (
    <div className="space-y-8 animate-fade-in font-urdu">
      
      {/* Top Banner & Control Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-charcoal-900 text-white shadow-soft-lg space-y-5 border border-emerald-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-300 border border-gold-400/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                {isUrdu ? `اس سورت میں سائنس کیا بیان کرتی ہے؟ (سورۃ ${surah.urduName || surah.englishName})` : `Scientific Perspective of Surah ${surah.englishName}`}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {isUrdu
                  ? 'مظاہرِ فطرت، کائناتی نظام، جنینیات اور معروضی سائنسی شواہد پر علمی و تدبری مکالمہ'
                  : 'Natural phenomena, cosmological observations & objective educational analysis'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Analyze This Surah Scientifically Button */}
            <button
              onClick={handleRegenerate}
              disabled={analyzing}
              className="px-4 py-2.5 rounded-2xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              title={isUrdu ? "اے آئی انجن کے ذریعے تمام آیات کا نیا سائنسی جائزہ لیں" : "Run on-demand AI analysis across all verses"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? (isUrdu ? 'تجزیہ کیا جا رہا ہے...' : 'Analyzing with AI...') : (isUrdu ? 'سائنسی تجزیہ دوبارہ کریں' : 'Analyze Scientifically')}</span>
            </button>

            {/* Export Science Report as PDF Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              title={isUrdu ? "مکمل علمی و سائنسی رپورٹ پی ڈی ایف ڈاؤن لوڈ کریں" : "View and export structured PDF report"}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'رپورٹ ڈاؤن لوڈ کریں (PDF)' : 'Export Report (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Classification Tag & Domains */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-emerald-300 font-semibold">{isUrdu ? 'سائنسی تعلق کی نوعیت:' : 'Relevance Category:'}</span>
          <span className={`px-3 py-1 rounded-full font-bold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
            {badgeStyle.label}
          </span>

          {report?.primaryDomains && report.primaryDomains.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 ml-2 rtl:ml-0 rtl:mr-2">
              <span className="text-emerald-300/80 text-[11px]">{isUrdu ? 'موضوعاتی شعبے:' : 'Domains:'}</span>
              {report.primaryDomains.map((dom, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-xl bg-emerald-800/60 border border-emerald-700 text-gold-300 text-[11px] font-medium"
                >
                  {dom}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between text-[11px] text-emerald-300/80 pt-2 border-t border-emerald-800/50">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {isUrdu ? 'حیثیت: ' : 'Status: '}<strong className="text-white capitalize">{report?.status === 'verified' ? (isUrdu ? 'مستند و منظور شدہ' : 'Verified') : report?.status}</strong>
              {report?.modelUsed && ` • ${isUrdu ? 'انجن' : 'Engine'}: ${report.modelUsed}`}
            </span>
          </div>
          <span>{isUrdu ? 'قرآن لینز ریسرچ بورڈ' : 'QuranLens Editorial Board'}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Overview & Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>{isUrdu ? 'سورت کے سائنسی اور فکری مضامین کا اجمالی خلاصہ' : 'Surah Science & Nature Overview'}</span>
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-charcoal-800 dark:text-charcoal-200">
          {report?.summary || `Surah ${surah.englishName} provides comprehensive moral and theological orientation.`}
        </p>
      </div>

      {/* Identified Concepts & Verses - 6 Structured Questions */}
      {report?.scientificConcepts && report.scientificConcepts.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-charcoal-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>
                {isUrdu
                  ? `مذکورہ سائنسی موضوعات اور کائناتی مظاہر (${report.scientificConcepts.length})`
                  : `Scientific Themes & Mentioned Phenomena (${report.scientificConcepts.length})`}
              </span>
            </h3>
            <span className="text-xs text-charcoal-500">
              {isUrdu ? 'مستند سوال و جواب کے ساتھ تفصیلی تجزیہ' : 'Responsible reflection (Tadabbur)'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {report.scientificConcepts.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft hover:shadow-soft-lg transition space-y-6"
              >
                {/* Concept Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ivory-100 dark:border-charcoal-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gold-100 dark:bg-gold-950/60 text-gold-800 dark:text-gold-300 font-bold text-xs flex items-center justify-center border border-gold-300 dark:border-gold-800 font-mono">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-charcoal-900 dark:text-white">
                        {item.concept}
                      </h4>
                      {item.domain && (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {isUrdu ? 'شعبہ: ' : 'Domain: '}{item.domain}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="self-start sm:self-auto text-xs px-3 py-1 rounded-full bg-ivory-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 font-medium border border-ivory-200 dark:border-charcoal-700">
                    {isUrdu ? 'سائنسی موضوع' : 'Scientific Context'}
                  </span>
                </div>

                {/* THE 6 MANDATORY QUESTIONS IN SECTION 3 */}
                <div className="space-y-6 divide-y divide-ivory-100 dark:divide-charcoal-800">
                  
                  {/* Q1: قرآن کی آیت کیا بیان کرتی ہے؟ */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>{isUrdu ? '۱. قرآن کی آیت کیا بیان کرتی ہے؟' : '1. What does the Qur’anic verse state?'}</span>
                    </h5>

                    {item.ayahReferences && item.ayahReferences.map((ref, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-5 rounded-2xl bg-ivory-50/80 dark:bg-charcoal-800/40 border border-ivory-200 dark:border-charcoal-700/60 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-800 dark:text-emerald-400 font-mono">
                            {isUrdu ? `آیت نمبر ${surah.number}:${ref.ayahNumber}` : `Ayah ${surah.number}:${ref.ayahNumber}`}
                          </span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-charcoal-900 text-charcoal-500 border border-ivory-200 dark:border-charcoal-700">
                            {ref.classification || 'Natural phenomenon'}
                          </span>
                        </div>

                        <div className="font-arabic text-2xl text-right text-emerald-950 dark:text-emerald-100 font-bold py-1 leading-loose">
                          {ref.arabicText}
                        </div>

                        <div className="text-xs sm:text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed font-semibold">
                          "{ref.translation}"
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Q2: مستند تفسیر کیا بتاتی ہے؟ */}
                  <div className="space-y-2 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>{isUrdu ? '۲. مستند تفسیر کیا بتاتی ہے؟' : '2. What does classical Tafsir explain?'}</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
                      {report.classicalTafsirSummary || 'سلف صالحین اور مفسرین (جیسے ابن کثیر اور قرطبی) نے ان آیات کو اللہ تعالیٰ کی ربوبیت، کائناتی نظم اور انسانی عقل کو غور و فکر پر آمادہ کرنے والی نشانیاں قرار دیا ہے۔'}
                    </p>
                  </div>

                  {/* Q3: جدید سائنس اس موضوع کو کیسے سمجھاتی ہے؟ */}
                  <div className="space-y-2 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>{isUrdu ? '۳. جدید سائنس اس موضوع کو کیسے سمجھاتی ہے؟' : '3. How does modern science explain this?'}</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
                      {item.modernExplanation}
                    </p>
                  </div>

                  {/* Q4: سائنسی تحقیق کیا کہتی ہے؟ (Peer-Reviewed References) */}
                  <div className="space-y-3 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isUrdu ? '۴. سائنسی تحقیق اور بین الاقوامی ادارے کیا کہتے ہیں؟' : '4. What do scientific research institutions state?'}</span>
                    </h5>
                    {item.sources && item.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs bg-ivory-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 border border-ivory-200 dark:border-charcoal-700 hover:text-emerald-600 transition"
                          >
                            <span className="font-bold">{src.title}</span>
                            <span className="text-[11px] text-charcoal-400 font-mono">
                              • {src.publisher} ({src.date || '2023'})
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-charcoal-400" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-500">
                        {isUrdu ? 'تحقیقات ناسا (NASA)، نووا (NOAA) اور بین الاقوامی تعلیمی رسائل پر مبنی ہیں۔' : 'Peer-reviewed academic repositories (NASA, NOAA, Nature).'}
                      </p>
                    )}
                  </div>

                  {/* Q5: اس کا حقیقی دنیا میں کیا مظاہرہ ہے؟ (Everyday Example) */}
                  <div className="space-y-2 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-gold-500" />
                      <span>{isUrdu ? '۵. اس کا حقیقی دنیا میں کیا مظاہرہ ہے؟' : '5. What is the real-world observable example?'}</span>
                    </h5>
                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs sm:text-sm text-charcoal-800 dark:text-charcoal-200 leading-relaxed">
                      {item.realWorldExample}
                    </div>
                  </div>

                  {/* Q6: ممکنہ تعلق اور اس کی حدود کیا ہیں؟ (Limits & Boundaries) */}
                  <div className="space-y-2 pt-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-emerald-600" />
                      <span>{isUrdu ? '۶. ممکنہ تعلق اور اس کی علمی و شرعی حدود کیا ہیں؟' : '6. What are the connections and limitations?'}</span>
                    </h5>
                    <div className="p-4 rounded-2xl bg-gold-50/60 dark:bg-gold-950/20 border border-gold-200 dark:border-gold-900/40 text-xs text-charcoal-800 dark:text-charcoal-200 leading-relaxed italic">
                      {item.ayahReferences?.[0]?.reflection ||
                        (isUrdu
                          ? 'قرآنی نصوص بنیادی طور پر انسان کو خالقِ کائنات کی کاریگری پر تدبر کی دعوت دیتی ہیں۔ سائنسی نظریات وقت کے ساتھ تبدیل یا بہتر ہوتے ہیں، اس لیے قرآن کو سائنسی کتاب کے طور پر پیش کرنے کے بجائے اسے عبرت و حکمت کا سرچشمہ سمجھنا چاہیے۔'
                          : 'Quranic verses invite contemplation. We note where observable regularities resonate with spiritual awe without claiming dogmatic empirical proof.')}
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Honest Disclosure when no direct scientific topic is present */
        <div className="p-8 rounded-3xl bg-ivory-100/70 dark:bg-charcoal-900/60 border border-ivory-300 dark:border-charcoal-800 space-y-3">
          <div className="flex items-center gap-2 text-charcoal-800 dark:text-charcoal-200">
            <Info className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold">
              {isUrdu ? 'علمی دیانت داری: اس سورت میں کوئی براہِ راست طبیعی سائنسی موضوع مذکور نہیں ہے' : 'Honest Analysis: No Direct Physical Science Subject in This Surah'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
            {isUrdu
              ? `سورۃ ${surah.urduName || surah.englishName} کا بنیادی محور عقیدۂ توحید، اخلاقی احکام، شریعت یا تاریخی تذکیر ہے، اس میں طبیعیاتی یا کائناتی قوانین کی تکنیکی تفصیل مذکور نہیں ہے۔`
              : `Surah ${surah.englishName} focuses directly on theological monotheism, prophetic narrative, legal ethics, and personal spiritual discernment.`}
          </p>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 italic">
            {isUrdu
              ? 'قرآن لینز سختی کے ساتھ اس اصول کی پاسداری کرتا ہے کہ جہاں سائنسی ربط موجود نہ ہو وہاں زبردستی کا تعلق نہ جوڑا جائے۔ قرآن مجید کا اصل مقصد انسانی روح کی اصلاح اور اخلاقی رہنمائی ہے۔'
              : 'QuranLens adheres to the scholarly rule: Do not force a scientific connection when none is supported. The Qur\'an addresses the human soul without requiring every chapter to serve as a physics textbook.'}
          </p>
        </div>
      )}

      {/* Academic Safety & Religious Notice */}
      <div className="p-6 rounded-3xl bg-gold-50/60 dark:bg-gold-950/20 border border-gold-200 dark:border-gold-900/40 space-y-2 text-xs text-charcoal-700 dark:text-charcoal-300">
        <div className="flex items-center gap-2 font-bold text-gold-900 dark:text-gold-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isUrdu ? 'علمی، سائنسی اور شرعی احتیاط کا ضابطہ' : 'Scientific & Theological Integrity Notice'}</span>
        </div>
        <p className="leading-relaxed">
          {report?.limitationsAndNotice ||
            (isUrdu
              ? 'یہ تجزیہ خالصتاً تعلیمی اور تدبری مقصد کے لیے ہے۔ قرآنی آیات غور و فکر کی دعوت دیتی ہیں اور وہ تکنیکی سائنسی درسی کتب نہیں ہیں۔ کبھی بھی یہ نہ کہیں کہ "سائنس نے قرآن کو ثابت کر دیا"، بلکہ یہ دیکھیں کہ کائنات کا متوازن نظام کس طرح خالق کے وجود پر دلالت کرتا ہے۔'
              : 'Educational reflection only. Quranic verses invite contemplation (Tadabbur) and are not technical science textbooks.')}
        </p>
      </div>

      {/* Printable Report Modal */}
      <SurahReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        report={report}
        surah={surah}
      />

    </div>
  );
}
