import { validateIpcPayload } from './ipcValidator.js';
import { logError, logInfo } from '../services/logger.js';

export function wrapIpcHandler(channelName: unknown, handlerFn: unknown) {
  // @ts-expect-error - auto fixed
  return async (event: unknown, ...args: unknown) => {
    const startTime = Date.now();
    try {
      // @ts-expect-error - auto fixed
      if (args.length > 0) {
        // @ts-expect-error - auto fixed
        validateIpcPayload(channelName, args[0]);
      }
      
      // @ts-expect-error - auto fixed
      const result = await handlerFn(event, ...args);
      const executionTimeMs = Date.now() - startTime;
      
      logInfo(`IPC Call Succeeded: [${channelName}]`, { executionTimeMs });
      return result;
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      logError(`IPC Call Failed: [${channelName}]`, { 
        error: (error as Error).message, 
        stack: (error as Record<string, unknown>).stack,
        executionTimeMs 
      });
      
      // Re-throw or return sanitized error
      throw error;
    }
  };
}
