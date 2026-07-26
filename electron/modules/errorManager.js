import { CrashPlatformEngine } from './crashPlatformEngine.js';
import { logError } from './logger.js';

export function setupErrorHandling() {
  process.on('uncaughtException', (error) => {
    logError('Uncaught Exception in Main Process:', {
      error: error.message,
      stack: error.stack
    });
    CrashPlatformEngine.recordCrash('uncaughtException', error, 'main_process');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logError('Unhandled Rejection in Main Process:', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    });
    CrashPlatformEngine.recordCrash('unhandledRejection', reason, 'main_process');
  });
}
