import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
import { sanitizeInput, checkRateLimit } from '../utils/security';
import { logger } from '../utils/logger';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - Sanitize, validate, and log
api.interceptors.request.use(
  (config) => {
    // Add correlation ID to all requests
    config.headers['X-Correlation-ID'] = logger.getCorrelationId();

    // Store start time for duration tracking
    config.metadata = { startTime: Date.now() };

    // Log request start
    logger.info('API Request Started', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      correlationId: logger.getCorrelationId(),
    });

    // Check client-side rate limiting
    if (!checkRateLimit(10, 60000)) {
      logger.warn('Rate limit exceeded', {
        url: config.url,
        correlationId: logger.getCorrelationId(),
      });
      return Promise.reject({
        status: 429,
        message: 'Too many requests. Please wait a moment.',
      });
    }

    // Sanitize request data if it's a POST/PUT/PATCH
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      if (typeof config.data === 'object' && config.data.texts) {
        // Sanitize text inputs
        config.data.texts = config.data.texts.map(text => sanitizeInput(text));
      }
    }

    return config;
  },
  (error) => {
    logger.error('API Request Failed', {
      error: error.message,
      correlationId: logger.getCorrelationId(),
    });
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors securely and log responses
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = response.config.metadata?.startTime
      ? Date.now() - response.config.metadata.startTime
      : 0;

    // Extract correlation ID from response or request
    const correlationId =
      response.headers['x-correlation-id'] || logger.getCorrelationId();

    // Log successful response
    logger.info('API Response Received', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      correlationId,
      processTime: response.headers['x-process-time'],
    });

    // Update correlation ID if backend provided a different one
    if (response.headers['x-correlation-id']) {
      logger.setCorrelationId(response.headers['x-correlation-id']);
    }

    return response;
  },
  (error) => {
    // Calculate request duration
    const duration = error.config?.metadata?.startTime
      ? Date.now() - error.config.metadata.startTime
      : 0;

    const correlationId =
      error.response?.headers['x-correlation-id'] || logger.getCorrelationId();

    // Don't expose sensitive error details
    if (error.response) {
      const { status, data } = error.response;

      logger.error('API Response Error', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status,
        statusText: error.response.statusText,
        errorMessage: data.detail || data.message || 'An error occurred',
        duration: `${duration}ms`,
        correlationId,
      });

      return Promise.reject({
        status,
        message: data.detail || data.message || 'An error occurred',
        data: import.meta.env.DEV ? data : undefined,
      });
    } else if (error.request) {
      logger.error('Network Error', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        duration: `${duration}ms`,
        correlationId,
        errorType: 'network',
      });

      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    } else {
      logger.error('Unexpected Error', {
        error: error.message || 'An unexpected error occurred',
        correlationId,
        errorType: 'unexpected',
      });

      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

// Analysis functions
export const analyzeTexts = async (texts, tasks = null) => {
  const response = await api.post(API_ENDPOINTS.ANALYZE, {
    texts,
    tasks,
  });
  return response.data;
};

export const analyzeFile = async (file, tasks = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (tasks) {
    formData.append('tasks', tasks.join(','));
  }

  const response = await api.post(API_ENDPOINTS.ANALYZE_FILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get(API_ENDPOINTS.HEALTH);
  return response.data;
};

export const getMeta = async () => {
  const response = await api.get(API_ENDPOINTS.META);
  return response.data;
};

export default api;
