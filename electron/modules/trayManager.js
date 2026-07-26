import { Tray, app } from 'electron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildTrayContextMenu } from './menuManager.js';
import { resumeMetricsPolling } from './systemInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let trayInstance = null;

export function setupSystemTray(mainWindow) {
  const iconPath = path.join(__dirname, '../../public/icon.ico');
  if (fs.existsSync(iconPath)) {
    try {
      trayInstance = new Tray(iconPath);
      const contextMenu = buildTrayContextMenu(mainWindow, () => {
        app.isQuitting = true;
        app.quit();
      });
      
      trayInstance.setToolTip('Luper Windows Optimizer');
      trayInstance.setContextMenu(contextMenu);
      
      trayInstance.on('double-click', () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          resumeMetricsPolling();
        }
      });
    } catch (e) {
      console.error('Failed to create tray icon:', e);
    }
  }
  return trayInstance;
}
