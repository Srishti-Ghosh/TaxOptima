export const monitor = {
  error: (error, context) => {
    console.error('Error:', error);
    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  },

  performance: (metric) => {
    // Track performance metrics
    if (window.performance && window.performance.mark) {
      window.performance.mark(metric.name);
    }
  },

  userAction: (action) => {
    // Track user actions
    console.log('User Action:', action);
    // Send to analytics service
  }
}; 