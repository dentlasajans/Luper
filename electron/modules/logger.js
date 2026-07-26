import { app } from 'electron';
import fs from 'fs';
import path from 'path';

let logStream = null;
let currentLogFilePath = null;
let currentLogDir = null;
let currentLogSize = 0;
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10 MB

const SENSITIVE_KEYS = new Set([
  'password', 'pass', 'token', 'authtoken', 'accesstoken', 'refreshtoken',
  'secret', 'apikey', 'key', 'ssn', 'creditcard', 'credit_card',
  'auth', 'authorization', 'cookie', 'credentials', 'privatekey', 'private_key'
]);

/**
 * Sanitizes Windows & Unix user directory paths to remove PII (usernames)
 * e.g., "C:\Users\JohnDoe\AppData" -> "C:\Users\[REDACTED]\AppData"
 */
function sanitizePathPII(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/([a-zA-Z]:[\\/]Users[\\/])[^\\/]+(?=[\\/]|$)/gi, '$1[REDACTED]')
            .replace(/(\/home\/)[^\/]+(?=\/|$)/gi, '$1[REDACTED]');
}

/**
 * Recursively sanitizes object metadata to eliminate sensitive keys & user path PII.
 */
function sanitizeLogMeta(meta, depth = 0, seen = new WeakSet()) {
  if (meta === null || meta === undefined) return {};
  if (depth > 5) return { truncated: true };

  if (meta instanceof Error) {
    return {
      errorName: meta.name || 'Error',
      errorMessage: sanitizePathPII(meta.message),
      errorStack: sanitizePathPII(meta.stack),
      code: meta.code
    };
  }

  if (typeof meta !== 'object') {
    return typeof meta === 'string' ? sanitizePathPII(meta) : meta;
  }

  if (seen.has(meta)) return { circular: true };
  seen.add(meta);

  if (Array.isArray(meta)) {
    return meta.map(item => sanitizeLogMeta(item, depth + 1, seen));
  }

  const clean = {};
  for (const key of Object.keys(meta)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      clean[key] = '[REDACTED]';
    } else {
      clean[key] = sanitizeLogMeta(meta[key], depth + 1, seen);
    }
  }
  return clean;
}

/**
 * Performs log rotation if log file size exceeds 10MB
 */
function checkAndRotateLog() {
  if (!currentLogFilePath || !fs.existsSync(currentLogFilePath)) return;

  try {
    const stats = fs.statSync(currentLogFilePath);
    currentLogSize = stats.size;

    if (currentLogSize >= MAX_LOG_SIZE) {
      if (logStream) {
        logStream.end();
        logStream = null;
      }

      const backupLog = path.join(currentLogDir, 'app.old.log');
      if (fs.existsSync(backupLog)) {
        fs.unlinkSync(backupLog);
      }
      fs.renameSync(currentLogFilePath, backupLog);

      logStream = fs.createWriteStream(currentLogFilePath, { flags: 'a' });
      currentLogSize = 0;
      writeLogDirect('INFO', 'Log rotated automatically after reaching 10MB limit.');
    }
  } catch (e) {
    console.error('Failed log rotation check:', e);
  }
}

export function initLogger() {
  try {
    const userDataPath = app ? app.getPath('userData') : process.cwd();
    currentLogDir = path.join(userDataPath, 'logs');

    if (!fs.existsSync(currentLogDir)) {
      fs.mkdirSync(currentLogDir, { recursive: true });
    }

    currentLogFilePath = path.join(currentLogDir, 'app.log');

    // Initial check on boot
    checkAndRotateLog();

    if (!logStream) {
      logStream = fs.createWriteStream(currentLogFilePath, { flags: 'a' });
    }

    logInfo('Logger initialized cleanly.');
  } catch (e) {
    console.error('Failed to initialize logger:', e);
  }
}

export function logInfo(message, meta = {}) {
  writeLog('INFO', message, meta);
}

export function logWarn(message, meta = {}) {
  writeLog('WARN', message, meta);
}

export function logError(message, meta = {}) {
  writeLog('ERROR', message, meta);
}

function writeLog(level, message, meta) {
  const sanitizedMessage = sanitizePathPII(String(message || ''));
  const sanitizedMeta = sanitizeLogMeta(meta);

  // Check active log rotation during runtime
  if (logStream && currentLogSize > MAX_LOG_SIZE) {
    checkAndRotateLog();
  }

  writeLogDirect(level, sanitizedMessage, sanitizedMeta);
}

function writeLogDirect(level, message, sanitizedMeta = {}) {
  const timestamp = new Date().toISOString();
  const logObj = { timestamp, level, message, ...sanitizedMeta };
  
  let logEntry;
  try {
    logEntry = JSON.stringify(logObj) + '\n';
  } catch (err) {
    logEntry = JSON.stringify({ timestamp, level, message: '[LOG_SERIALIZATION_ERROR]', error: err.message }) + '\n';
  }

  if (logStream) {
    currentLogSize += Buffer.byteLength(logEntry, 'utf8');
    logStream.write(logEntry);
  } else {
    if (level === 'ERROR') {
      console.error(`[${level}] ${message}`, sanitizedMeta);
    } else if (level === 'WARN') {
      console.warn(`[${level}] ${message}`, sanitizedMeta);
    } else {
      console.log(`[${level}] ${message}`, sanitizedMeta);
    }
  }
}

function closeLogger() {
  if (logStream) {
    logStream.end();
    logStream = null;
  }
}

