import app from './app';
import env from './config/env';
import logger from './config/logger';

const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 AgriSentinel API running on port ${PORT}`);
  logger.info(`📝 Environment: ${env.NODE_ENV}`);
  logger.info(`🔥 Firebase Project: ${env.FIREBASE_PROJECT_ID}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default server;