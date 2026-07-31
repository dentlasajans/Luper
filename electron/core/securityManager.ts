import { app } from 'electron';
import { SecurityPlatformEngine } from '../services/securityPlatformEngine.js';

export function sanitizeId(str: unknown) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}

export function sanitizeRegPath(str: unknown) {
  return SecurityPlatformEngine.sanitizeRegPath(str);
}

export function sanitizeRegName(str: unknown) {
  return SecurityPlatformEngine.sanitizeRegName(str);
}

export function sanitizeInput(str: unknown) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/["'&|;`$\r\n]/g, '').trim();
}

export function setupSecurityPolicies() {
  // Configured in webPreferences
}

export function applyWindowSecurityPolicy(win: any) {
  if (!win || !win.webContents) return;
  
  // Prevent unauthorized external navigation, but allow Firebase auth flow
  win.webContents.on('will-navigate', (event: any, url: string) => {
    if (url && (url.includes('firebaseapp.com') || url.includes('accounts.google.com'))) {
      return;
    }
    event.preventDefault();
  });

  // Allow new window creation for Firebase Auth popups
  win.webContents.setWindowOpenHandler((details: { url: string }) => {
    if (details.url === 'about:blank' || details.url.includes('firebaseapp.com') || details.url.includes('accounts.google.com')) {
      return { action: 'allow' };
    }
    return { action: 'deny' };
  });

  // Lock down DevTools in production
  if (app.isPackaged) {
    win.webContents.on('devtools-opened', () => {
      win.webContents.closeDevTools();
    });
  }
}

