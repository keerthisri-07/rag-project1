/**
 * Simple Logger Utility
 * 
 * Provides colored console output with timestamps.
 * Methods: info, warn, error, success, debug
 */

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

/**
 * Get formatted timestamp
 * @returns {string} Formatted timestamp string
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * Format a log message with timestamp and level
 * @param {string} level - Log level label
 * @param {string} color - ANSI color code
 * @param {string} message - Log message
 * @param {any[]} args - Additional arguments
 */
const formatLog = (level, color, message, ...args) => {
  const timestamp = `${colors.dim}[${getTimestamp()}]${colors.reset}`;
  const levelTag = `${color}${colors.bright}[${level}]${colors.reset}`;
  const msg = `${color}${message}${colors.reset}`;

  console.log(`${timestamp} ${levelTag} ${msg}`, ...args);
};

const logger = {
  /**
   * Log informational message (blue)
   * @param {string} message - Info message
   * @param {...any} args - Additional arguments
   */
  info: (message, ...args) => {
    formatLog('INFO', colors.blue, message, ...args);
  },

  /**
   * Log warning message (yellow)
   * @param {string} message - Warning message
   * @param {...any} args - Additional arguments
   */
  warn: (message, ...args) => {
    formatLog('WARN', colors.yellow, message, ...args);
  },

  /**
   * Log error message (red)
   * @param {string} message - Error message
   * @param {...any} args - Additional arguments
   */
  error: (message, ...args) => {
    formatLog('ERROR', colors.red, message, ...args);
  },

  /**
   * Log success message (green)
   * @param {string} message - Success message
   * @param {...any} args - Additional arguments
   */
  success: (message, ...args) => {
    formatLog('SUCCESS', colors.green, message, ...args);
  },

  /**
   * Log debug message (magenta) - only in development
   * @param {string} message - Debug message
   * @param {...any} args - Additional arguments
   */
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      formatLog('DEBUG', colors.magenta, message, ...args);
    }
  },

  /**
   * Log a separator line for visual clarity
   * @param {string} title - Optional title for the separator
   */
  separator: (title = '') => {
    const line = '═'.repeat(60);
    if (title) {
      console.log(`\n${colors.cyan}${line}${colors.reset}`);
      console.log(`${colors.cyan}${colors.bright}  ${title}${colors.reset}`);
      console.log(`${colors.cyan}${line}${colors.reset}\n`);
    } else {
      console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`);
    }
  },
};

module.exports = logger;
