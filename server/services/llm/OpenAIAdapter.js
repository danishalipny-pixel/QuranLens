const https = require('https');

class OpenAIAdapter {
  constructor(apiKey, model = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateChat(messages, options = {}) {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error('OpenAI API Key is missing. Please configure LLM_API_KEY or OPENAI_API_KEY.');
    }

    const payload = JSON.stringify({
      model: options.model || this.model,
      messages: messages,
      temperature: options.temperature !== undefined ? options.temperature : 0.3,
      max_tokens: options.max_tokens || 2000,
      ...(options.response_format && { response_format: options.response_format }),
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.openai.com',
          port: 443,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
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
                const text = data.choices[0]?.message?.content || '';
                resolve({
                  content: text,
                  provider: 'openai',
                  model: data.model || this.model,
                  usage: data.usage || null,
                });
              } else {
                reject(new Error(data.error?.message || `OpenAI error code: ${res.statusCode}`));
              }
            } catch (err) {
              reject(new Error('Failed to parse OpenAI JSON response: ' + err.message));
            }
          });
        }
      );

      req.on('error', (err) => reject(new Error('OpenAI network request failed: ' + err.message)));
      req.setTimeout(35000, () => {
        req.destroy();
        reject(new Error('OpenAI request timed out after 35 seconds.'));
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

module.exports = OpenAIAdapter;
