import { app, BrowserWindow } from 'electron';
import { setupIpcHandlers } from '../ipc/ipcManager.js';
import { logInfo } from '../services/logger.js';
import { createApplicationWindow } from './windowManager.js';

export function setupAppLifecycle() {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    logInfo('Another instance of Luper is already running. Exiting second instance.');
    app.quit();
    return;
  }

  app.on('second-instance', () => {
    logInfo('Second instance detected, focusing main window.');
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length > 0) {
      const win = allWindows[0];
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });

  console.log("1. Main başladı");

  app.whenReady().then(() => {
    console.log("2. App Ready");
    logInfo('App ready signal received.');
    let mainWindow = createApplicationWindow();
    setupIpcHandlers(mainWindow);

    console.log("3. Window:", mainWindow ? "BrowserWindow instance created" : "null");
    console.log("4. isVisible:", mainWindow?.isVisible());
    console.log("5. isDestroyed:", mainWindow?.isDestroyed());
    console.log("6. Bounds:", mainWindow?.getBounds());
    
    const handleClosed = () => {
      // @ts-expect-error - auto fixed
      mainWindow = null;
      // @ts-expect-error - auto fixed
      import('../native/systemInfo.js').then((mod: unknown) => mod.pauseMetricsPolling());
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
    // @ts-expect-error - auto fixed
    app.isQuitting = true;
    logInfo('App before-quit signal triggered.');
  });
}
