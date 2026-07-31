import pino from 'pino';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

// @ts-expect-error - auto fixed
let pinoLogger = null;

export function initPinoLogger() {
  // @ts-expect-error - auto fixed
  if (pinoLogger) return pinoLogger;
  const userDataPath = app ? app.getPath('userData') : process.cwd();
  const logDir = path.join(userDataPath, 'logs');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, 'app.log');

  const dest = pino.destination({
    dest: logFile,
    sync: false, // high speed async logging
    append: true,
    mkdir: true
  });

  pinoLogger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
  }, dest);

  return pinoLogger;
}

export function logInfo(message: unknown, meta: unknown = {}) {
  // @ts-expect-error - auto fixed
  const logger = pinoLogger || initPinoLogger();
  logger.info(meta, message);
}

export function logWarn(message: unknown, meta: unknown = {}) {
  // @ts-expect-error - auto fixed
  const logger = pinoLogger || initPinoLogger();
  logger.warn(meta, message);
}

export function logError(message: unknown, meta: unknown = {}) {
  // @ts-expect-error - auto fixed
  const logger = pinoLogger || initPinoLogger();
  logger.error(meta, message);
}
