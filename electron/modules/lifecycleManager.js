import { app, BrowserWindow } from 'electron';
import { setupIpcHandlers } from './ipcManager.js';
import { logInfo } from './logger.js';
import { createApplicationWindow } from './windowManager.js';

export function setupAppLifecycle() {
  app.whenReady().then(() => {
    logInfo('App ready signal received.');
    let mainWindow = createApplicationWindow();
    setupIpcHandlers(mainWindow);
    
    const handleClosed = () => {
      mainWindow = null;
      import('./systemInfo.js').then(mod => mod.pauseMetricsPolling());
    };
    
    mainWindow.on('closed', handleClosed);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createApplicationWindow();
        setupIpcHandlers(mainWindow);
        mainWindow.on('closed', handleClosed);
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      logInfo('All windows closed; quitting app.');
      app.quit();
    }
  });

  app.on('before-quit', () => {
    app.isQuitting = true;
    logInfo('App before-quit signal triggered.');
  });
}
