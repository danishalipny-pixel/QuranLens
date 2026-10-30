import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, Heart, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { isUrdu } = useLanguage();

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 ${isUrdu ? 'font-urdu' : ''}`}>
      
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'قرآن لینز کا تعارف اور مشن' : 'About QuranLens'}</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-950 dark:text-emerald-200' : 'font-serif text-charcoal-900 dark:text-white'}`}>
          {isUrdu ? 'پڑھیں، سمجھیں، غور و فکر کریں۔' : 'Read. Understand. Reflect.'}
        </h1>
        <p className="text-base sm:text-lg text-charcoal-600 dark:text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
          {isUrdu
            ? '”قرآن مجید کی تعلیمات کو آسان و مستند ترجمہ، کلاسیکی تفاسیر، سائنسی تدبر اور روزمرہ زندگی کی ٹھوس مثالوں کے ذریعے ہر انسان کے لیے قابل فہم بنانا۔“'
            : '"To make Qur\'anic learning accessible through clear translation, context, reflection, and responsible exploration of modern knowledge."'}
        </p>
      </div>

      {/* Why QuranLens Exists */}
      <div className="bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 p-8 shadow-soft space-y-4">
        <h2 className={`text-xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-900 dark:text-emerald-300' : 'font-serif text-charcoal-900 dark:text-white'}`}>
          {isUrdu ? 'قرآن لینز کی ضرورت کیوں پیش آئی؟' : 'Why QuranLens Exists'}
        </h2>
        <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
          {isUrdu
            ? 'صدیوں سے مسلمان اور حقیقت کے متلاشی قرآن پاک کی تلاوت عقیدت و احترام سے کرتے آئے ہیں۔ تاہم، بے شمار قارئین کے لیے محض عربی الفاظ کی تلاوت سے آگے بڑھ کر آیات کے گہرے مفہوم، اسبابِ نزول، اور عملی زندگی پر ان کے اطلاق کو سمجھنا مشکل ہوتا ہے۔'
            : 'For centuries, Muslims and curious learners worldwide have recited the Qur\'an with reverence. However, many readers struggle to move from recitation to deep cognitive comprehension, contextual understanding, and practical reflection.'}
        </p>
        <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed">
          {isUrdu
            ? 'ساتھ ہی ساتھ، انٹرنیٹ پر "سائنسی معجزات" کے مباحث اکثر دو انتہاؤں میں بٹ جاتے ہیں: یا تو غیر مصدقہ دعوے جو سائنس اور مذہب دونوں کو مسخ کرتے ہیں، یا پھر شکوک و شبہات۔ قرآن لینز نے ایک ذمہ دارانہ اور معتدل علمی راستہ اختیار کیا ہے: اصل الہامی متن کی غیر متزلزل حفاظت کے ساتھ جدید ذہن کے سوالات کا دیانت دارانہ جواب دینا۔'
            : 'Simultaneously, internet discussions regarding "scientific miracles" often swing between sensationalist speculation that distorts both theology and science, or cynical rejection. QuranLens was built to pioneer a responsible, scholarly middle path: preserving the divine text with pristine accuracy while engaging modern questions with intellectual integrity.'}
        </p>
      </div>

      {/* Core Principles */}
      <div className="space-y-4">
        <h2 className={`text-xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-900 dark:text-emerald-300' : 'font-serif text-charcoal-900 dark:text-white'}`}>
          {isUrdu ? 'ہمارے چار بنیادی علمی و تحقیقی اصول' : 'Our Four Foundational Principles'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              titleUrdu: 'اصل قرآنی عربی متن کا تحفظ',
              titleEn: 'Preservation of Sacred Arabic Text',
              descUrdu: 'قرآن مجید کا اصل عربی متن مجمع الملک فہد مدینہ منورہ کے مصحف عثمانی کے مطابق سختی سے محفوظ رکھا گیا ہے۔ اس میں کوئی انسان یا اے آئی ماڈل تبدیلی کا مجاز نہیں ہے۔',
              descEn: 'The original Qur’anic Arabic text is maintained strictly in accordance with recognized Uthmanic standards. No AI, algorithm, or human commentary is ever mixed into the Qur’anic text.',
            },
            {
              titleUrdu: 'ترجمہ، تفسیر اور متن میں واضح تفریق',
              titleEn: 'Separation of Translation & Tafsir',
              descUrdu: 'مستند تراجم (مولانا جالندھری، صحیح انٹرنیشنل) اور کلاسیکی تفاسیر (ابن کثیر، قرطبی) کو الگ الگ واضح کارڈز میں پیش کیا جاتا ہے تاکہ الہامی کلام اور انسانی تشریح میں التباس نہ ہو۔',
              descEn: 'Authentic translations (Sahih International, Jalandhry) and classical exegesis (Tafsir Ibn Kathir, Al-Qurtubi) are displayed in distinct, clearly labeled cards to prevent conflating human commentary with divine revelation.',
            },
            {
              titleUrdu: 'ذمہ دارانہ سائنسی تدبر (Tadabbur)',
              titleEn: 'Responsible Scientific Reflections',
              descUrdu: 'ہم کبھی یہ دعویٰ نہیں کرتے کہ "سائنس نے قرآن کو ثابت کر دیا"، بلکہ کائنات کے مظاہر کو قرآنی نشانیوں (آیات) کے طور پر دیکھتے ہیں اور بین الاقوامی معتبر سائنسی جرائد (NASA, Nature) کے حوالے دیتے ہیں۔',
              descEn: 'We never claim that "science proves the Quran" or force speculative scientific hypotheses onto verses. We cite verified academic publications (NASA, USGS, NOAA, Nature) and present connections as reflective signs (Tadabbur).',
            },
            {
              titleUrdu: 'مستند مآخذ اور اے آئی کا باحفاظت استعمال',
              titleEn: 'Source Verification & AI Safety',
              descUrdu: 'ہمارا اے آئی اتالیق مصدقہ علمی فریم ورک کے اندر کام کرتا ہے، فرضی احادیث یا اقوال گھڑنے سے محفوظ ہے، اور شرعی فتاویٰ کے لیے مستند علماء کی طرف رجوع کا مشورہ دیتا ہے۔',
              descEn: 'Our AI Quran Tutor is strictly grounded to avoid inventing verses or Hadith, to clarify uncertainty, and to direct users to recognized scholars for formal religious rulings.',
            },
          ].map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-ivory-200 dark:border-charcoal-800 shadow-soft space-y-2"
            >
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className={isUrdu ? 'font-urdu-title' : ''}>
                  {isUrdu ? p.titleUrdu : p.titleEn}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
                {isUrdu ? p.descUrdu : p.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sources & Citations */}
      <div id="sources" className="bg-white dark:bg-charcoal-900 rounded-3xl border border-ivory-200 dark:border-charcoal-800 p-8 shadow-soft space-y-4">
        <h2 className={`text-xl font-bold ${isUrdu ? 'font-urdu-title text-emerald-900 dark:text-emerald-300' : 'font-serif text-charcoal-900 dark:text-white'}`}>
          {isUrdu ? 'مستند علمی مآخذ اور مراجع' : 'Verified Sources & Academic Partners'}
        </h2>
        <p className="text-xs text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
          {isUrdu
            ? 'قرآن لینز درج ذیل معتبر متنی اور سائنسی مآخذ پر انحصار کرتا ہے:'
            : 'QuranLens relies on the following authentic textual and empirical resources:'}
        </p>
        <ul className="space-y-2.5 text-xs text-charcoal-700 dark:text-charcoal-300">
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">{isUrdu ? '• قرآنی عربی متن:' : '• Qur\'anic Arabic:'}</span>
            <span>{isUrdu ? 'مجمع الملک فہد لطباعۃ المصحف الشریف (مدینہ منورہ عثمانی رسم الخط)۔' : 'King Fahd Complex for the Printing of the Holy Quran (Madinah Uthmanic Text).'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">{isUrdu ? '• مستند اردو ترجمہ:' : '• Urdu Translation:'}</span>
            <span>{isUrdu ? 'مولانا فتح محمد جالندھری اور تفہیم القرآن کے مراجع۔' : 'Maulana Fateh Muhammad Jalandhry & Tafheem-ul-Quran references.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">{isUrdu ? '• انگریزی ترجمہ:' : '• English Translation:'}</span>
            <span>{isUrdu ? 'صحیح انٹرنیشنل (دار ابوالقاسم، ریاض)۔' : 'Sahih International (Dar Abul-Qasim, Riyadh).'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">{isUrdu ? '• کلاسیکی تفاسیر:' : '• Classical Exegesis:'}</span>
            <span>{isUrdu ? 'تفسیر ابن کثیر، تفسیر القرطبی، اور تفسیر الجلالین۔' : 'Tafsir Ibn Kathir, Tafsir al-Jalalayn, Tafsir al-Qurtubi.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">{isUrdu ? '• سائنسی حوالہ جات:' : '• Scientific References:'}</span>
            <span>{isUrdu ? 'ناسا (NASA)، امریکی جیولوجیکل سروے (USGS)، نووا (NOAA)، نیچر جرنل (Nature)، اور ڈاکٹر کیتھ مور (The Developing Human)۔' : 'NASA, NOAA, U.S. Geological Survey (USGS), Nature Publishing Group, Keith L. Moore (The Developing Human).'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-emerald-700">{isUrdu ? '• صوتی تلاوت:' : '• Audio Recitations:'}</span>
            <span>{isUrdu ? 'مشاری راشد العفاسی، محمود خلیل الحصری، اور عبد الباسط عبد الصمد۔' : 'Mishary Rashid Alafasy, Mahmoud Khalil Al-Husary, Abdul Basit Murattal.'}</span>
          </li>
        </ul>
      </div>

      {/* Official Disclaimer */}
      <div className="p-6 rounded-2xl bg-charcoal-900 text-ivory-200 border border-charcoal-800 flex items-start gap-3.5 text-xs sm:text-sm leading-relaxed">
        <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-1">
            {isUrdu ? 'شرعی اور علمی اعلامیہ (Academic & Religious Disclaimer):' : 'Academic & Religious Disclaimer:'}
          </span>
          {isUrdu
            ? 'قرآن لینز ایک خالصتاً تعلیمی اور فکری پلیٹ فارم ہے۔ سائنسی نقطۂ نظر فہم و تدبر کی آسانی کے لیے پیش کیا گیا ہے اور اسے قطعی شرعی حکم یا کلاسیکی تفسیر کا متبادل قرار نہیں دیا جا سکتا۔ فقہی و شرعی مسائل (فتاویٰ) کے لیے ہمیشہ مستند علمائے کرام سے رجوع فرمائیں۔'
            : 'QuranLens is an educational platform. Scientific perspectives presented here are educational interpretations and should not be treated as replacements for established Tafsir or scholarly guidance. For formal legal rulings (Fatawa), please consult qualified scholars.'}
        </div>
      </div>

    </div>
  );
}
