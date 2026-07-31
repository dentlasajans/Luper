import { logInfo } from '../services/logger.js';
import { UpdatePlatformEngine } from '../services/updatePlatformEngine.js';

export function setupUpdateManager() {
  logInfo('Setting up Update & Package Delivery Platform...');
  UpdatePlatformEngine.checkForApplicationUpdates('stable').catch(() => {});
}

// @ts-expect-error - auto fixed
function checkForUpdatesManual() {
  return UpdatePlatformEngine.checkForApplicationUpdates('stable');
}
