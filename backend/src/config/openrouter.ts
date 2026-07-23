import OpenAI from 'openai';

/**
 * OpenRouter Client initialized using the OpenAI-compatible SDK.
 * Reads OPENROUTER_API_KEY and OPENROUTER_MODEL from environment variables.
 */
const apiKey = process.env.OPENROUTER_API_KEY || '';

if (!apiKey) {
  console.warn('[OpenRouter] Warning: OPENROUTER_API_KEY is not set in environment variables.');
}

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  defaultHeaders: {
    'HTTP-Referer': process.env.FRONTEND_URL || 'https://mychat.pages.dev',
    'X-Title': 'MyChat AI Assistant',
  },
});

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
