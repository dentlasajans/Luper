import { SecurityPlatformEngine } from './securityPlatformEngine.js';

export function sanitizeId(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}

export function sanitizeRegPath(str) {
  return SecurityPlatformEngine.sanitizeRegPath(str);
}

export function sanitizeRegName(str) {
  return SecurityPlatformEngine.sanitizeRegName(str);
}

function sanitizeInput(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/["'&|;`$\r\n]/g, '').trim();
}

function setupSecurityPolicies() {
  // Configured in webPreferences
}

export function applyWindowSecurityPolicy(win) {
  if (!win || !win.webContents) return;
  
  // Prevent unauthorized external navigation
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  // Deny new window creation from renderer
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}
