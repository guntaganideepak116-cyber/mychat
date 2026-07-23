import OpenAI from 'openai';

/**
 * Groq AI Client initialized using the OpenAI-compatible SDK.
 * Reads GROQ_API_KEY and GROQ_MODEL from environment variables.
 */
const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || '';

if (!apiKey) {
  console.warn('[Groq] Warning: GROQ_API_KEY is not set in environment variables.');
}

export const openrouter = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: apiKey,
});

export const OPENROUTER_MODEL =
  process.env.GROQ_MODEL || process.env.OPENROUTER_MODEL || 'llama-3.1-8b-instant';
