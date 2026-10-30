const https = require('https');

class GeminiAdapter {
  constructor(apiKey, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateChat(messages, options = {}) {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error('Google Gemini API Key is missing. Please configure LLM_API_KEY.');
    }

    const modelName = options.model || this.model;

    // Convert standard messages format (system, user, assistant) to Gemini format
    let systemInstruction = null;
    const contents = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = {
          parts: [{ text: msg.content }],
        };
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const payload = JSON.stringify({
      contents,
      ...(systemInstruction && { systemInstruction }),
      generationConfig: {
        temperature: options.temperature !== undefined ? options.temperature : 0.3,
        maxOutputTokens: options.max_tokens || 2048,
      },
    });

    const path = `/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(
      this.apiKey
    )}`;

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'generativelanguage.googleapis.com',
          port: 443,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (res.statusCode >= 200 && res.statusCode < 300) {
                const candidate = data.candidates?.[0];
                const text = candidate?.content?.parts?.[0]?.text || '';
                resolve({
                  content: text,
                  provider: 'gemini',
                  model: modelName,
                  usage: data.usageMetadata || null,
                });
              } else {
                reject(
                  new Error(
                    data.error?.message || `Google Gemini error status: ${res.statusCode}`
                  )
                );
              }
            } catch (err) {
              reject(new Error('Failed to parse Gemini response: ' + err.message));
            }
          });
        }
      );

      req.on('error', (err) => reject(new Error('Gemini network request failed: ' + err.message)));
      req.setTimeout(35000, () => {
        req.destroy();
        reject(new Error('Gemini request timed out after 35 seconds.'));
      });

      req.write(payload);
      req.end();
    });
  }

  async testConnection() {
    return this.generateChat(
      [{ role: 'user', content: 'Respond with "Connection Successful"' }],
      { max_tokens: 15 }
    );
  }
}

module.exports = GeminiAdapter;
