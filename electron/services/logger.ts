// @ts-expect-error - auto fixed
import { app } from 'electron';
// @ts-expect-error - auto fixed
import fs from 'fs';
// @ts-expect-error - auto fixed
import path from 'path';

// @ts-expect-error - auto fixed
let logStream = null;
// @ts-expect-error - auto fixed
let currentLogFilePath = null;
// @ts-expect-error - auto fixed
let currentLogDir = null;
// @ts-expect-error - auto fixed
let currentLogSize = 0;
// @ts-expect-error - auto fixed
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
function sanitizePathPII(str: unknown) {
  if (typeof str !== 'string') return str;
  return str.replace(/([a-zA-Z]:[\\/]Users[\\/])[^\\/]+(?=[\\/]|$)/gi, '$1[REDACTED]')
            .replace(/(\/home\/)[^\/]+(?=\/|$)/gi, '$1[REDACTED]');
}

/**
 * Recursively sanitizes object metadata to eliminate sensitive keys & user path PII.
 */
// @ts-expect-error - auto fixed
function sanitizeLogMeta(meta: unknown, depth: unknown = 0, seen: unknown = new WeakSet()) {
  if (meta === null || meta === undefined) return {};
  // @ts-expect-error - auto fixed
  if (depth > 5) return { truncated: true };

  if (meta instanceof Error) {
    return {
      errorName: meta.name || 'Error',
      errorMessage: sanitizePathPII(meta.message),
      errorStack: sanitizePathPII(meta.stack),
      // @ts-expect-error - auto fixed
      code: meta.code
    };
  }

  if (typeof meta !== 'object') {
    return typeof meta === 'string' ? sanitizePathPII(meta) : meta;
  }

  // @ts-expect-error - auto fixed
  if (seen.has(meta)) return { circular: true };
  // @ts-expect-error - auto fixed
  seen.add(meta);

  if (Array.isArray(meta)) {
    // @ts-expect-error - auto fixed
    return meta.map((item: unknown) => sanitizeLogMeta(item, depth + 1, seen));
  }

  const clean = {};
  // @ts-expect-error - auto fixed
  for (const key: unknown of Object.keys(meta)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      // @ts-expect-error - auto fixed
      clean[key] = '[REDACTED]';
    } else {
      // @ts-expect-error - auto fixed
      clean[key] = sanitizeLogMeta(meta[key], depth + 1, seen);
    }
  }
  return clean;
}

import { logInfo as pinoInfo, logError as pinoError, logWarn as pinoWarn, initPinoLogger } from './pinoLogger.js';

export function initLogger() {
  try {
    initPinoLogger();
    logInfo('Logger initialized cleanly.');
  } catch (e) {
    pinoError('Failed to initialize logger:', { error: (e as Error).message, stack: (e as Record<string, unknown>).stack });
  }
}

export function logInfo(message: unknown, meta: unknown = {}) {
  const sanitizedMessage = sanitizePathPII(String(message || ''));
  const sanitizedMeta = sanitizeLogMeta(meta);
  pinoInfo(sanitizedMessage, sanitizedMeta);
}

export function logWarn(message: unknown, meta: unknown = {}) {
  const sanitizedMessage = sanitizePathPII(String(message || ''));
  const sanitizedMeta = sanitizeLogMeta(meta);
  pinoWarn(sanitizedMessage, sanitizedMeta);
}

export function logError(message: unknown, meta: unknown = {}) {
  const sanitizedMessage = sanitizePathPII(String(message || ''));
  const sanitizedMeta = sanitizeLogMeta(meta);
  pinoError(sanitizedMessage, sanitizedMeta);
}

// @ts-expect-error - auto fixed
function closeLogger() {
  // Pino handles closing/flushing on exit
}

