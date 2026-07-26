import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 580,
    show: false, // Show gracefully
    frame: false, // Frameless
    resizable: false, // Non-resizable
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    transparent: true, // For rounded corners & soft shadows
    backgroundMaterial: 'mica', // Windows 11 Mica effect
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    }
  });

  // In development mode, load Vite server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // In production, load the built HTML file
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Window controls
ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

// System Check
ipcMain.handle('system-check', async () => {
  // Mocking system checks for now
  return {
    isAdmin: true,
    windowsVersion: 'Windows 11',
    diskSpace: { free: 150000000000, required: 500000000 },
    hasWritePermission: true,
    existingInstallation: false,
    runtimeOk: true
  };
});

// Install Simulator
ipcMain.handle('install-app', async (event) => {
  // Simulate an installation process
  const steps = [
    'Preparing installation...',
    'Checking Node.js & Electron runtime environment...',
    'Verifying Windows PowerShell 5.1+ compatibility...',
    'Creating folders...',
    'Copying application files...',
    'Installing optimization database...',
    'Creating shortcuts...',
    'Cleaning temporary files...',
    'Finalizing installation...'
  ];

  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const progress = Math.round(((i + 1) / steps.length) * 100);
    event.sender.send('install-progress', { step: steps[i], progress });
  }
  
  return { success: true };
});
