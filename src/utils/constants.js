export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  HEALTH: '/api/v1/health',
  META: '/api/v1/meta',
  ANALYZE: '/api/v1/analyze',
  ANALYZE_FILE: '/api/v1/analyze/file',
};

export const NLP_TASKS = {
  SENTIMENT: 'sentiment',
  KEYWORDS: 'keywords',
  TOPICS: 'topics',
  SUMMARY: 'summary',
};

export const SENTIMENT_LABELS = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};

export const FILE_TYPES = {
  TXT: '.txt',
  CSV: '.csv',
  PDF: '.pdf',
  MD: '.md',
  SRT: '.srt',
};

// Security limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_TEXT_LENGTH = 100000; // 100,000 characters
export const MAX_BATCH_SIZE = 100; // Max texts per batch
export const RATE_LIMIT_REQUESTS = 10; // Requests per window
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
