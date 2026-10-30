// Server-side OpenAI Service with Safety Rails & Responsible Scholarship
const https = require('https');

const SYSTEM_PROMPT = `You are the QuranLens Educational AI Tutor.
Your mission is to help users read, understand, and reflect upon the Qur'an with absolute educational integrity, academic clarity, and religious respect.

CRITICAL OPERATIONAL RULES:
1. Never invent Qur'anic verses or Arabic text.
2. Never invent Hadith or fabricate scholarly Tafsir citations.
3. Never claim to be a religious authority or issue fatwas (legal rulings).
4. Clearly distinguish between:
   - Qur'anic Arabic text
   - Authentic translation
   - Classical Tafsir / historical context
   - General explanation
   - Modern scientific information
   - Possible educational reflection between verse and science.
5. In scientific discussions:
   - NEVER state: "This scientific discovery proves the Qur'an."
   - ALWAYS use responsible phrases like: "Modern science describes...", "Some readers see a possible connection...", "From a scientific perspective...", "According to this scientific concept...".
   - If there is no reasonable scientific connection, state: "No direct scientific connection is being claimed for this verse."
6. Maintain an encouraging, respectful, clear, and dignified tone.
7. If uncertain about historical or linguistic facts, explicitly say so.`;

/**
 * Make direct HTTPS request to OpenAI API (compatible without extra library version issues)
 */
async function callOpenAI(messages, apiKey, model = 'gpt-4o-mini') {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.5,
      max_tokens: 1200,
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error(parsed.error?.message || `OpenAI API returned status ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error('Failed to parse OpenAI API response'));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('OpenAI API request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Generate intelligent educational fallback if OpenAI API key is absent or offline
 */
function generateFallbackResponse(query, mode, contextVerse = null) {
  const surahName = contextVerse?.surahName || (contextVerse?.surahNumber ? `Surah ${contextVerse.surahNumber}` : 'the Quran');
  const ayahNum = contextVerse?.ayahNumber || '';

  if (mode === 'urdu' || query.toLowerCase().includes('urdu')) {
    return `### قرآنی تفہیم اور رہنمائی (اردو خلاصہ)

**آیت کی مناسبت:** ${surahName} ${ayahNum ? `(آیت ${ayahNum})` : ''}

1. **بنیادی پیغام:** قرآن مجید انسان کو کائنات، اپنی ذات اور اپنے اعمال پر غور و فکر کی دعوت دیتا ہے۔ یہ محض کتابِ تلاوت نہیں بلکہ زندگی گزارنے کا ایک بامقصد ضابطہ ہے۔
2. **اہم نکات:**
   - نیت کا اخلاص اور اللہ کی رحمت پر یقین۔
   - مشکلات میں صبر اور استقامت کا دامن تھامنا۔
   - علم و فہم کے ساتھ تدبر کرنا اور حق بات پر قائم رہنا۔
3. **عملی سبق:** اپنے روزمرہ کے معاملات میں دیانت، اخلاق اور باہمی ہمدردی کو فروغ دیں۔

*(نوٹ: یہ وضاحتی خلاصہ تعلیمی فہم کے لیے پیش کیا گیا ہے اور اسے کسی مستند تفسیر کا متبادل نہ سمجھا جائے)*`;
  }

  if (mode === 'science' || query.toLowerCase().includes('science')) {
    return `### Scientific Perspective & Responsible Reflection

**Regarding:** ${surahName} ${ayahNum ? `Ayah ${ayahNum}` : 'Reflective Passages'}

**1. Scientific Concept:**
Modern empirical science studies physical systems through observation, falsifiable hypothesis testing, and quantitative models. In the natural world, phenomena such as hydrology, cellular biology, and stellar physics follow consistent thermodynamic and physical laws.

**2. Modern Scientific Perspective:**
- Modern science describes natural systems as governed by stable, measurable laws of nature.
- When examining physical references in the Quran (such as rainfall, water, embryonic stages, and astronomical bodies), modern science provides empirical models for the mechanisms behind these phenomena.

**3. Responsible Reflection & Islamic Principle:**
- *Important Educational Notice:* Quranic verses are divine signs (*Ayat*) designed to evoke awe, contemplation (*Tadabbur*), and moral awareness—they are not formulated as empirical physics textbooks.
- Rather than saying "science proves the Quran," scholars emphasize that observing regularities in nature enriches our appreciation of the ordered universe.
- If no direct physical connection exists in this verse, it is understood primarily as moral, spiritual, or legal guidance.

**Key Source References:**
- National Academies of Sciences, Engineering, and Medicine (Structure of Science)
- Classical Exegetical Principles of Quranic Tadabbur (Al-Ghazali, Ibn Kathir)`;
  }

  if (mode === 'example' || query.toLowerCase().includes('example')) {
    return `### Real-World Everyday Example

**Core Concept:** Translating Qur'anic wisdom into everyday life.

**Scenario:**
Imagine you are working on a demanding project or facing an unexpected personal difficulty. Anxiety naturally begins to creep in.

- **How this applies:** The Quran continuously pairs patience (*Sabr*) with trust (*Tawakkul*) and mindful action. Instead of being paralyzed by what is outside your sphere of control, focus your energy on what you can influence today: your attitude, your work ethic, and your kindness towards others.
- **Micro-Action:** Take one constructive step with calm intentionality, acknowledging that immediate outcomes take time to mature—just like a seed planted in the soil that requires darkness and rain before sprouting into sunlight.`;
  }

  if (mode === 'simple' || mode === 'kids' || query.toLowerCase().includes('10-year-old')) {
    return `### Simple Explanation (Easy to Understand)

**What is the big idea here?**
God created our wonderful world with care, beauty, and wisdom. Everything has a purpose: the rain feeds the trees, the sun warms the earth, and we are blessed with minds to learn, discover, and help others.

**Three Things to Remember:**
1. **Always be curious:** Explore nature, ask questions, and read good books.
2. **Be kind:** Help a friend, listen to your parents, and share your toys or snacks.
3. **Say thank you:** When you see something beautiful in the sky or eat delicious food, remember to be grateful for the blessings in your life!`;
  }

  if (mode === 'tafsir') {
    return `### Classical Tafsir Summary

**Context & Significance:**
In classical exegesis (Tafsir traditions such as Ibn Kathir, Al-Tabari, and Al-Qurtubi), verses are analyzed through:
1. **Linguistic analysis:** Examining the classical Arabic roots and nuances of each word.
2. **Context of Revelation (*Asbab al-Nuzul*):** The historical situation in Mecca or Medina when the passage was addressed.
3. **Intertextual correlation (*Tafsir al-Quran bil-Quran*):** How other verses in the Quran elucidate this theme.
4. **Prophetic Sunnah:** The practical embodiment and explanations recorded from the Prophet Muhammad ﷺ and his companions.

Scholars emphasize that the central aim of every passage is purifying the heart (*Tazkiyah*), upholding societal justice (*Qist*), and walking the straight path (*Sirat al-Mustaqim*).`;
  }

  // Default educational response
  return `### QuranLens Educational Tutor Response

**Inquiry:** "${query}"
${contextVerse ? `**Context:** ${surahName} Ayah ${ayahNum}` : ''}

**1. Foundational Understanding:**
The Qur'an addresses the human intellect and heart simultaneously. Its verses provide moral clarity, invite observation of nature, and anchor personal character in ethical responsibility.

**2. Key Lessons & Themes:**
- **Reflective Observation:** Creation is replete with signs for those who reflect (*Ulul Albab*).
- **Balanced Life:** Pairing spiritual devotion with proactive societal contribution and compassionate family life.
- **Intellectual Humility:** Recognizing that human knowledge is continuous, evolving, and always in need of divine guidance.

**3. Practical Takeaway:**
Reflect on how this teaching can inspire one tangible act of patience, kindness, or honest speech in your life today.

*(Note: QuranLens AI Tutor answers are educational aids. Consult authentic translations and recognized scholars for formal theological guidance.)*`;
}

async function askAITutor({ query, mode = 'simple', contextVerse = null }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Mode: ${mode}
User Question: ${query}
Context: ${contextVerse ? JSON.stringify(contextVerse) : 'General Quran Study'}`,
        },
      ];
      const aiReply = await callOpenAI(messages, apiKey, process.env.OPENAI_MODEL || 'gpt-4o-mini');
      return {
        success: true,
        source: 'openai',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        reply: aiReply,
      };
    } catch (err) {
      console.warn('[OpenAI Service] Falling back to educational knowledgebase due to:', err.message);
      return {
        success: true,
        source: 'knowledgebase_fallback',
        reply: generateFallbackResponse(query, mode, contextVerse),
        notice: 'Note: Served via QuranLens educational engine. Provide OPENAI_API_KEY in server environment for live dynamic LLM generation.',
      };
    }
  }

  // No API key provided: return high quality offline educational engine response
  return {
    success: true,
    source: 'educational_engine',
    reply: generateFallbackResponse(query, mode, contextVerse),
    notice: 'QuranLens Educational Engine response. Set OPENAI_API_KEY in server/.env to enable live OpenAI inference.',
  };
}

module.exports = { askAITutor };
