/**
 * Security utilities for input validation and sanitization
 */

// XSS Prevention - Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  // Remove potentially dangerous HTML tags and attributes
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers
  ];

  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // HTML entity encoding
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return sanitized.replace(/[&<>"'/]/g, (s) => entityMap[s]);
};

// Validate text length
export const validateTextLength = (text, maxLength = 100000) => {
  if (!text || typeof text !== 'string') return false;
  return text.length <= maxLength;
};

// Validate file type
export const validateFileType = (filename, allowedTypes = ['.txt', '.csv', '.pdf']) => {
  if (!filename) return false;
  const extension = '.' + filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Validate file size
export const validateFileSize = (fileSize, maxSizeBytes = 10 * 1024 * 1024) => {
  return fileSize <= maxSizeBytes;
};

// Rate limiting helper (client-side)
let requestTimestamps = [];

export const checkRateLimit = (maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  // Remove requests older than the window
  requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < windowMs);

  if (requestTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  requestTimestamps.push(now);
  return true; // OK to proceed
};
