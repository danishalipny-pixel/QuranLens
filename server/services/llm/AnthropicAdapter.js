const https = require('https');

class AnthropicAdapter {
  constructor(apiKey, model = 'claude-3-5-sonnet-20241022') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateChat(messages, options = {}) {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error('Anthropic API Key is missing. Please configure LLM_API_KEY.');
    }

    const modelName = options.model || this.model;

    let systemPrompt = '';
    const formattedMessages = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += (systemPrompt ? '\n\n' : '') + msg.content;
      } else {
        formattedMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    if (formattedMessages.length === 0) {
      formattedMessages.push({ role: 'user', content: 'Hello' });
    }

    const payload = JSON.stringify({
      model: modelName,
      max_tokens: options.max_tokens || 2048,
      temperature: options.temperature !== undefined ? options.temperature : 0.3,
      ...(systemPrompt && { system: systemPrompt }),
      messages: formattedMessages,
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.anthropic.com',
          port: 443,
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
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
                const text = data.content?.[0]?.text || '';
                resolve({
                  content: text,
                  provider: 'anthropic',
                  model: modelName,
                  usage: data.usage || null,
                });
              } else {
                reject(
                  new Error(
                    data.error?.message || `Anthropic error status: ${res.statusCode}`
                  )
                );
              }
            } catch (err) {
              reject(new Error('Failed to parse Anthropic response: ' + err.message));
            }
          });
        }
      );

      req.on('error', (err) => reject(new Error('Anthropic network request failed: ' + err.message)));
      req.setTimeout(35000, () => {
        req.destroy();
        reject(new Error('Anthropic request timed out after 35 seconds.'));
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

module.exports = AnthropicAdapter;
