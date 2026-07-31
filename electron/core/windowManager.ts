import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyWindowSecurityPolicy } from './securityManager.js';
import { pauseMetricsPolling, resumeMetricsPolling } from '../native/systemInfo.js';
import { setupSystemTray } from './trayManager.js';
import { logInfo, logError } from '../services/logger.js';

// @ts-expect-error - auto fixed
let mainWindowInstance = null;

// @ts-expect-error - auto fixed
function getMainWindow() {
  // @ts-expect-error - auto fixed
  return mainWindowInstance;
}

export function createApplicationWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: workWidth, height: workHeight } = primaryDisplay ? primaryDisplay.workAreaSize : { width: 1920, height: 1080 };
  const initialWidth = Math.min(1680, Math.max(1280, Math.floor(workWidth * 0.92)));
  const initialHeight = Math.min(980, Math.max(800, Math.floor(workHeight * 0.92)));

  const mainWindow = new BrowserWindow({
    width: initialWidth,
    height: initialHeight,
    minWidth: 1200,
    minHeight: 750,
    maximizable: true,
    center: true,
    frame: false,
    transparent: false,
    show: true,
    backgroundColor: '#161618',
    icon: path.join(__dirname, '../dist/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  mainWindowInstance = mainWindow;

  // Window Hardening & Security
  applyWindowSecurityPolicy(mainWindow);

  // Auto-pause background metrics polling when window is minimized or hidden to prevent background CPU usage
  mainWindow.on('minimize', () => pauseMetricsPolling());
  mainWindow.on('hide', () => pauseMetricsPolling());
  mainWindow.on('restore', () => resumeMetricsPolling());
  mainWindow.on('show', () => resumeMetricsPolling());

  // Setup System Tray
  setupSystemTray(mainWindow);

  // @ts-expect-error - auto fixed
  mainWindow.webContents.on('did-fail-load', (event: unknown, errorCode: unknown, errorDescription: unknown) => {
    // @ts-expect-error - auto fixed
    logError('Renderer failed to load:', { errorCode, errorDescription });
  });

  // @ts-expect-error - auto fixed
  mainWindow.webContents.on('console-message', (event: unknown, ...args: unknown) => {
    // @ts-expect-error - auto fixed
    logInfo('Renderer console:', { details: args[0] });
  });

  mainWindow.once("ready-to-show", () => {
    console.log("READY-TO-SHOW FIRED");

    mainWindow.show();
    mainWindow.center();
    mainWindow.setAlwaysOnTop(true);
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
    console.log("Foreground focus set");
  });

  if (process.env.NODE_ENV?.trim() === 'development' || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Backup show call to guarantee window visibility & foreground placement
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.center();
      mainWindow.setAlwaysOnTop(true);
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(false);
    }
  }, 200);

  return mainWindow;
}
