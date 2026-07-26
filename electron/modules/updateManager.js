import { logInfo } from './logger.js';
import { UpdatePlatformEngine } from './updatePlatformEngine.js';

export function setupUpdateManager() {
  logInfo('Setting up Update & Package Delivery Platform...');
  UpdatePlatformEngine.checkForApplicationUpdates('stable').catch(() => {});
}

function checkForUpdatesManual() {
  return UpdatePlatformEngine.checkForApplicationUpdates('stable');
}
