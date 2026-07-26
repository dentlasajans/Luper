import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyWindowSecurityPolicy } from './securityManager.js';
import { pauseMetricsPolling, resumeMetricsPolling } from './systemInfo.js';
import { setupSystemTray } from './trayManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindowInstance = null;

function getMainWindow() {
  return mainWindowInstance;
}

export function createApplicationWindow() {
  const mainWindow = new BrowserWindow({
    width: 1520,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    maximizable: false,
    center: true,
    frame: false,
    transparent: false,
    backgroundColor: '#121214',
    icon: path.join(__dirname, '../../public/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.cjs')
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

  if (process.env.NODE_ENV?.trim() === 'development' || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  return mainWindow;
}
