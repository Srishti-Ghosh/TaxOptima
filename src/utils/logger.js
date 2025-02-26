const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

export const logger = {
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(message, ...args);
    }
  },

  info: (message, ...args) => {
    console.info(message, ...args);
  },

  warn: (message, ...args) => {
    console.warn(message, ...args);
  },

  error: (message, error) => {
    console.error(message, error);
    monitor.error(error, message);
  }
}; 