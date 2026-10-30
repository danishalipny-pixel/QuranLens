# QuranLens — قرآن کو سمجھیں، غور کریں، علم حاصل کریں
> **Tagline:** پڑھیں، سمجھیں، غور و فکر کریں۔ (Read. Understand. Reflect.)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_Tailwind-10b981.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js_%7C_Express-059669.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB_%7C_Hybrid_Fallback-047857.svg)](https://www.mongodb.com/)
[![AI Engine](https://img.shields.io/badge/AI_Engine-OpenAI_%7C_Gemini_%7C_Claude_%7C_Internal-065f46.svg)](https://openai.com/)

**QuranLens** is an AI-powered Quran learning and reflection platform that helps users understand all 114 Surahs through authentic translations, detailed classical Tafsir, responsible scientific perspectives, real-world life examples, and interactive LLM-powered explanations. Designed with a fully responsive **Urdu-first RTL experience** (`Noto Nastaliq Urdu`, `Amiri`, `Noto Naskh Arabic`) and an optional English toggle.

---

## 🌟 Key Platform Features

### 1. 📖 Complete Urdu Language Experience (اردو فرسٹ تجربہ)
- **Urdu-first RTL layout:** Loaded by default with `lang="ur"` and `dir="rtl"`.
- **Authentic Nastaliq Typography:** Beautifully formatted with `Noto Nastaliq Urdu`, `Amiri`, and `Noto Naskh Arabic` (line-height: 2.2 to prevent ligature collision).
- **One-click Language Switcher:** Seamless bilingual toggle (`English / اردو`) in the navbar.
- All navigation, home page, 114 Surahs catalog, 14 Ayah sections, scientific topics, thematic studies, and admin controls are fully localized.

### 2. 💎 14 VIP Explanation Sections per Ayah (۱۴ تفصیلی علمی و تدبری نکات)
Every Ayah detailed view provides 14 structured, deep-learning sections:
1. **اصل قرآنی عربی متن** — Original Quranic Arabic text (Madinah Uthmanic Text)
2. **لفظ بہ لفظ اردو معنی** — Word-by-word Urdu root meanings
3. **مستند اردو ترجمہ** — Authentic Urdu Translation (Fateh Muhammad Jalandhry)
4. **آسان اردو ترجمہ و عام فہم خلاصہ** — Simplified Urdu meaning and summary
5. **آیت کا پس منظر اور سببِ نزول** — Context and Asbab al-Nuzul
6. **مستند تفسیر** — Classical exegesis (Tafsir Ibn Kathir & Al-Qurtubi)
7. **تفصیلی علمی وضاحت** — Step-by-step breakdown tailored for children, students, and adults
8. **سائنسی نقطۂ نظر و درجہ بندی** — 5-tier scientific relationship classification
9. **جدید سائنسی معلومات و شواہد** — Modern scientific consensus (NASA, NOAA, USGS, NIH)
10. **حقیقی زندگی کی ٹھوس مثال** — Tangible real-world modern scenarios
11. **روزمرہ زندگی سے تعلق** — Practical application to contemporary challenges
12. **عملی سبق و اخلاقی رہنمائی** — Actionable character takeaways
13. **غور و فکر کے سوالات (تدبر)** — Probing contemplation and reflection questions
14. **مستند مآخذ و حوالہ جات** — Scholarly bibliography and citations

### 3. 🔬 Scientific Analysis of All 114 Surahs (اس سورت میں سائنس کیا بیان کرتی ہے؟)
Dedicated science perspective engine covering all 114 Surahs:
- Explores 11 natural themes: *Cosmology, Hydrology, Oceanography, Embryology, Geology, Zoology, Botany, Meteorology, and Ecology*.
- Answers **6 structured questions in Urdu** for each scientific concept:
  1. *قرآن کی آیت کیا بیان کرتی ہے؟* (What does the Qur’anic verse state?)
  2. *مستند تفسیر کیا بتاتی ہے؟* (What does classical Tafsir explain?)
  3. *جدید سائنس اس موضوع کو کیسے سمجھاتی ہے؟* (How does modern science explain this?)
  4. *سائنسی تحقیق کیا کہتی ہے؟* (What do peer-reviewed studies state?)
  5. *اس کا حقیقی دنیا میں کیا مظاہرہ ہے؟* (How is this observed in the physical world?)
  6. *ممکنہ تعلق اور اس کی حدود کیا ہیں؟* (What are the connections and limitations?)
- **Strict Academic Honesty:** Never forces scientific claims when none exist.
- **Exportable PDF Report:** Comprehensive analysis export in Urdu & English.

### 4. 🤖 Contextual AI Quran Tutor (ذہین سیاقی اے آئی اتالیق)
- **10 Interactive Explanation Modes:**
  - `simple-urdu`: آسان اردو میں سمجھائیں
  - `kids`: بچوں کے لیے وضاحت (Explain Like I'm 10)
  - `scholarly`: تفصیلی علمی وضاحت (Scholarly In-depth)
  - `scientific`: سائنسی تجزیہ (Scientific Analysis)
  - `real-life`: حقیقی زندگی کی مثال (Real-Life Example)
  - `word-by-word`: لفظ بہ لفظ تشریح (Linguistic Nuances)
  - `historical`: تاریخی پس منظر (Historical Context & Asbab al-Nuzul)
  - `tafsir`: مستند تفسیر کا خلاصہ (Classical Tafsir Summary)
  - `lessons`: عملی زندگی کے اسباق (Actionable Life Lessons)
  - `follow-up`: سوال و جواب (Contemplation & Tadabbur Questions)
- **Configurable LLM Architecture:** Modular adapter pattern supporting OpenAI (GPT-4o), Google Gemini, Anthropic Claude, and the built-in resilient QuranLens Internal Educational Engine.

### 5. 🛡️ Theological & Scientific Safety Principles
- **No Scientific Dogmatism:** QuranLens strictly forbids claims that *"science proves the Quran"*. Instead, it uses responsible language: *"Modern science describes..."*, *"Some readers observe a possible connection..."*.
- **Sacred Text Preservation:** Arabic Quranic text is preserved according to King Fahd Complex Uthmanic standards. AI models never generate or alter Quranic Arabic text.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Lucide React, React Router v7, HTML5 Audio Player |
| **Typography** | Noto Nastaliq Urdu, Noto Naskh Arabic, Amiri, Inter, Playfair Display |
| **Backend** | Node.js, Express.js, Helmet, CORS, Rate Limiting, JWT Authentication, Bcrypt |
| **Database** | MongoDB with Mongoose ODM + Dual-layer in-memory fallback for zero downtime |
| **AI Integration** | Modular Provider Layer (OpenAI GPT, Google Gemini, Anthropic Claude, Internal Engine) |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional; built-in local fallback data store works without MongoDB)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/danishalipny-pixel/QuranLens.git
cd QuranLens
npm run install:all
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your optional AI provider credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
LLM_PROVIDER=internal # internal | openai | gemini | anthropic
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 4. Running the Platform
Start both backend and frontend concurrently:
```bash
npm run dev
```
- **Frontend URL:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

### 5. Default Admin Credentials
- **Email:** `admin@quranlens.com`
- **Password:** `Admin@QuranLens2026`

---

## 📱 Responsive Testing
Tested across modern screen dimensions with zero horizontal overflow:
- **Mobile (320px, 375px, 390px)**: Compact bottom bars, scrollable pill carousels, responsive Nastaliq typography.
- **Tablet (768px, 820px)**: 2-column card layouts, sticky audio bar.
- **Desktop & 4K (1024px, 1366px, 1920px)**: 3-column analysis grid, dual-pane AI study interface.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
