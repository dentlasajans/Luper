import { Tray, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildTrayContextMenu } from './menuManager.js';
import { resumeMetricsPolling } from '../native/systemInfo.js';
import { logError } from '../services/logger.js';

// @ts-expect-error - auto fixed
let trayInstance = null;

export function setupSystemTray(mainWindow: unknown) {
  const iconPath = path.join(__dirname, '../dist/icon.ico');
  if (fs.existsSync(iconPath)) {
    try {
      trayInstance = new Tray(iconPath);
      const contextMenu = buildTrayContextMenu(mainWindow, () => {
        // @ts-expect-error - auto fixed
        app.isQuitting = true;
        app.quit();
      });
      
      trayInstance.setToolTip('Luper Windows Optimizer');
      trayInstance.setContextMenu(contextMenu);
      
      trayInstance.on('double-click', () => {
        if (mainWindow) {
          // @ts-expect-error - auto fixed
          mainWindow.show();
          // @ts-expect-error - auto fixed
          mainWindow.focus();
          resumeMetricsPolling();
        }
      });
    } catch (e) {
      logError('Failed to create tray icon:', { error: (e as Error).message, stack: (e as Record<string, unknown>).stack });
    }
  }
  // @ts-expect-error - auto fixed
  return trayInstance;
}
