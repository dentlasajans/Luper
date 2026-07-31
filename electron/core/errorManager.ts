import { CrashPlatformEngine } from '../services/crashPlatformEngine.js';
import { logError } from '../services/logger.js';

export function setupErrorHandling() {
  process.on('uncaughtException', (error: unknown) => {
    logError('Uncaught Exception in Main Process:', {
      // @ts-expect-error - auto fixed
      error: error.message,
      // @ts-expect-error - auto fixed
      stack: error.stack
    });
    CrashPlatformEngine.recordCrash('uncaughtException', error, 'main_process');
  });

  // @ts-expect-error - auto fixed
  process.on('unhandledRejection', (reason: unknown, promise: unknown) => {
    logError('Unhandled Rejection in Main Process:', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    });
    CrashPlatformEngine.recordCrash('unhandledRejection', reason, 'main_process');
  });
}
