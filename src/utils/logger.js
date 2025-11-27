/**
 * Comprehensive Frontend Logger
 * Captures all console logs and sends critical logs to backend
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor() {
    try {
      this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      this.level = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
      this.logBatch = [];
      this.batchSize = 50;
      this.flushInterval = 5000; // 5 seconds
      this.correlationId = this.generateCorrelationId();

      // Preserve original console methods
      this.originalConsole = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        debug: console.debug.bind(console),
      };

      // Initialize only if window is available
      if (typeof window !== 'undefined') {
        this.interceptConsole();
        this.startBatchFlushing();
        this.setupErrorHandlers();
      }
    } catch (error) {
      // Fallback to basic console if logger fails
      console.error('Logger initialization failed:', error);
      this.originalConsole = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        debug: console.debug.bind(console),
      };
    }
  }

  generateCorrelationId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  interceptConsole() {
    /**
     * Intercept all console methods to capture logs
     */
    const self = this;

    ['log', 'info', 'warn', 'error', 'debug'].forEach((method) => {
      console[method] = function (...args) {
        // Call original method
        self.originalConsole[method](...args);

        // Log to our system
        const levelMap = {
          log: 'debug',
          debug: 'debug',
          info: 'info',
          warn: 'warn',
          error: 'error',
        };

        self._log(levelMap[method], args);
      };
    });

    this.originalConsole.info('🔍 Logger initialized - All console logs are being captured');
  }

  setupErrorHandlers() {
    /**
     * Capture unhandled errors and rejections
     */
    window.addEventListener('error', (event) => {
      this.error('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason?.toString(),
        promise: event.promise,
      });
    });
  }

  _log(level, args) {
    const levelValue = LOG_LEVELS[level.toUpperCase()];

    if (levelValue < this.level) {
      return; // Skip if below current log level
    }

    const logEntry = {
      level: level.toUpperCase(),
      message: args.map((arg) => this._formatArg(arg)).join(' '),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      correlationId: this.correlationId,
      data: this._extractData(args),
    };

    // Add to batch
    this.logBatch.push(logEntry);

    // Send critical logs immediately
    if (level === 'error') {
      this.sendToBackend(logEntry);
    }

    // Flush if batch is full
    if (this.logBatch.length >= this.batchSize) {
      this.flushBatch();
    }
  }

  _formatArg(arg) {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return String(arg);
      }
    }
    return String(arg);
  }

  _extractData(args) {
    return args
      .filter((arg) => typeof arg === 'object' && arg !== null)
      .reduce((acc, obj, idx) => {
        acc[`arg${idx}`] = obj;
        return acc;
      }, {});
  }

  debug(...args) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      this.originalConsole.debug('[DEBUG]', ...args);
      this._log('debug', args);
    }
  }

  info(...args) {
    if (this.level <= LOG_LEVELS.INFO) {
      this.originalConsole.info('[INFO]', ...args);
      this._log('info', args);
    }
  }

  warn(...args) {
    if (this.level <= LOG_LEVELS.WARN) {
      this.originalConsole.warn('[WARN]', ...args);
      this._log('warn', args);
    }
  }

  error(...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      this.originalConsole.error('[ERROR]', ...args);
      this._log('error', args);
    }
  }

  async sendToBackend(logEntry) {
    /**
     * Send log entry to backend
     */
    try {
      await fetch(`${this.apiUrl}/api/v1/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': this.correlationId,
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Silently fail to avoid infinite loops
      this.originalConsole.error('Failed to send log to backend:', error);
    }
  }

  async flushBatch() {
    /**
     * Send batch of logs to backend
     */
    if (this.logBatch.length === 0) return;

    const batch = [...this.logBatch];
    this.logBatch = [];

    try {
      await fetch(`${this.apiUrl}/api/v1/logs/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': this.correlationId,
        },
        body: JSON.stringify({ logs: batch }),
      });
    } catch (error) {
      this.originalConsole.error('Failed to send log batch:', error);
    }
  }

  startBatchFlushing() {
    /**
     * Periodically flush log batch
     */
    setInterval(() => {
      this.flushBatch();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushBatch();
    });
  }

  setCorrelationId(id) {
    this.correlationId = id;
  }

  getCorrelationId() {
    return this.correlationId;
  }
}

// Create and export singleton instance
export const logger = new Logger();

// Also export the class for testing
export { Logger };
