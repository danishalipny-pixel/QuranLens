const OpenAIAdapter = require('./OpenAIAdapter');
const GeminiAdapter = require('./GeminiAdapter');
const AnthropicAdapter = require('./AnthropicAdapter');
const InternalAdapter = require('./InternalAdapter');

class LLMManager {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || (process.env.OPENAI_API_KEY ? 'openai' : 'internal');
    this.model = process.env.LLM_MODEL || (this.provider === 'openai' ? 'gpt-4o-mini' : 'quranlens-educational-engine-v2');
    this.apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '';
    this.temperature = parseFloat(process.env.LLM_TEMPERATURE || '0.3');
    this.maxTokens = parseInt(process.env.LLM_MAX_TOKENS || '2500', 10);
    this.systemPrompt = process.env.LLM_SYSTEM_PROMPT || this.getDefaultSystemPrompt();

    // Stats & Error tracking
    this.usageStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastError: null,
      lastRequestTime: null,
    };
  }

  getDefaultSystemPrompt() {
    return `You are the QuranLens Educational Intelligence & Science Analysis Engine.
Your mission is to provide scholarly, accurate, and responsible educational analysis of the Qur'an.

MANDATORY RELIGIOUS & SCIENTIFIC SAFETY RULES:
1. NEVER alter, invent, or speculate regarding original Qur'anic Arabic text.
2. NEVER fabricate Hadith or scholarly citations.
3. NEVER claim to be a religious authority or issue legal rulings (Fatwas).
4. Strictly distinguish between:
   - Sacred Qur'anic Text
   - Authentic Translations (English: Sahih International, Urdu: Jalandhry)
   - Classical Tafsir / Historical Context
   - Modern Scientific Knowledge from Peer-Reviewed Institutions
   - Responsible Contemplative Reflections (Tadabbur)
5. IN SCIENTIFIC ANALYSES:
   - NEVER write "This scientific discovery proves the Qur'an."
   - ALWAYS write: "Modern science describes...", "Some readers see a possible connection...", "From a scientific perspective...", "According to this scientific concept...".
   - If a verse has no direct physical scientific connection, state: "No direct scientific connection is being claimed for this verse."
   - Prioritize verified scientific bodies: NASA, NOAA, WHO, NIH, Nature, USGS.
6. Tone: Dignified, objective, encouraging, respectful, and academically grounded.`;
  }

  getAdapter(overrideConfig = {}) {
    const provider = overrideConfig.provider || this.provider;
    const apiKey = overrideConfig.apiKey !== undefined ? overrideConfig.apiKey : this.apiKey;
    const model = overrideConfig.model || this.model;

    switch (provider.toLowerCase()) {
      case 'openai':
        return new OpenAIAdapter(apiKey, model || 'gpt-4o-mini');
      case 'gemini':
      case 'google':
        return new GeminiAdapter(apiKey, model || 'gemini-1.5-flash');
      case 'anthropic':
      case 'claude':
        return new AnthropicAdapter(apiKey, model || 'claude-3-5-sonnet-20241022');
      case 'internal':
      default:
        return new InternalAdapter();
    }
  }

  async generateChat(messages, options = {}) {
    this.usageStats.totalRequests += 1;
    this.usageStats.lastRequestTime = new Date().toISOString();

    const mergedOptions = {
      temperature: options.temperature !== undefined ? options.temperature : this.temperature,
      max_tokens: options.max_tokens || this.maxTokens,
      model: options.model || this.model,
      ...options,
    };

    // Prepend System Prompt if not explicitly provided
    const hasSystem = messages.some((m) => m.role === 'system');
    const finalMessages = hasSystem
      ? messages
      : [{ role: 'system', content: this.systemPrompt }, ...messages];

    try {
      const adapter = this.getAdapter(options);
      const result = await adapter.generateChat(finalMessages, mergedOptions);
      this.usageStats.successfulRequests += 1;
      return result;
    } catch (error) {
      this.usageStats.failedRequests += 1;
      this.usageStats.lastError = {
        message: error.message,
        timestamp: new Date().toISOString(),
      };
      console.warn(`[LLMManager] Provider '${this.provider}' failed: ${error.message}. Falling back to Internal Educational Engine.`);

      // Fallback seamlessly to Internal Engine if external API fails
      try {
        const fallbackAdapter = new InternalAdapter();
        const fallbackResult = await fallbackAdapter.generateChat(finalMessages, mergedOptions);
        return {
          ...fallbackResult,
          notice: `Note: Switched to QuranLens Educational Engine fallback due to: ${error.message}`,
        };
      } catch (fallbackError) {
        throw new Error(`LLM Generation failed: ${error.message}`);
      }
    }
  }

  getConfig() {
    return {
      provider: this.provider,
      model: this.model,
      hasApiKey: !!this.apiKey && this.apiKey.length > 0,
      apiKeyMasked: this.apiKey ? `${this.apiKey.substring(0, 4)}••••••••${this.apiKey.slice(-4)}` : '',
      temperature: this.temperature,
      maxTokens: this.maxTokens,
      systemPrompt: this.systemPrompt,
      supportedProviders: [
        {
          id: 'openai',
          name: 'OpenAI (GPT)',
          models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
          status: 'Supported',
        },
        {
          id: 'gemini',
          name: 'Google Gemini',
          models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
          status: 'Supported',
        },
        {
          id: 'anthropic',
          name: 'Anthropic Claude',
          models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
          status: 'Supported',
        },
        {
          id: 'internal',
          name: 'QuranLens Internal Educational Engine',
          models: ['quranlens-educational-engine-v2'],
          status: 'Built-in & Resilient',
        },
      ],
      usageStats: this.usageStats,
    };
  }

  updateConfig(newConfig = {}) {
    if (newConfig.provider) this.provider = newConfig.provider;
    if (newConfig.model) this.model = newConfig.model;
    if (newConfig.apiKey !== undefined && newConfig.apiKey.trim() !== '') {
      this.apiKey = newConfig.apiKey.trim();
    }
    if (newConfig.temperature !== undefined) this.temperature = parseFloat(newConfig.temperature);
    if (newConfig.maxTokens !== undefined) this.maxTokens = parseInt(newConfig.maxTokens, 10);
    if (newConfig.systemPrompt) this.systemPrompt = newConfig.systemPrompt;

    return this.getConfig();
  }

  async testConnection(config = {}) {
    const adapter = this.getAdapter(config);
    return adapter.testConnection();
  }
}

// Singleton instance
const llmManager = new LLMManager();

module.exports = llmManager;
