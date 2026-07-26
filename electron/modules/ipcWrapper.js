import { validateIpcPayload } from './ipcValidator.js';
import { logError, logInfo } from './logger.js';

export function wrapIpcHandler(channelName, handlerFn) {
  return async (event, ...args) => {
    const startTime = Date.now();
    try {
      if (args.length > 0) {
        validateIpcPayload(channelName, args[0]);
      }
      
      const result = await handlerFn(event, ...args);
      const executionTimeMs = Date.now() - startTime;
      
      logInfo(`IPC Call Succeeded: [${channelName}]`, { executionTimeMs });
      return result;
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      logError(`IPC Call Failed: [${channelName}]`, { 
        error: error.message, 
        stack: error.stack,
        executionTimeMs 
      });
      
      // Re-throw or return sanitized error
      throw error;
    }
  };
}
