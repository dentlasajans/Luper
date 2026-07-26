import { app } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { logError } from './logger.js';

class CrashPlatformEngineCore {
  constructor() {
    this.safeModeTriggered = false;
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'crashes.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'crashes.json');
    }
  }

  getCrashHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[CrashPlatformEngine] Failed to read crash database:', { error: e.message });
    }
    return [];
  }

  saveCrashHistory(crashes) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(crashes, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[CrashPlatformEngine] Failed to save crash database:', { error: e.message });
      return false;
    }
  }

  /**
   * Record and analyze a local crash report
   */
  recordCrash(type, error, component = 'main_process') {
    const message = typeof error === 'string' ? error : (error?.message || 'Unknown Exception');
    const stackTrace = error?.stack || '';

    const report = {
      id: `crash_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      stackTrace,
      component,
      systemSnapshot: {
        platform: os.platform(),
        arch: os.arch(),
        freeMemoryMB: Math.round(os.freemem() / (1024 * 1024))
      },
      recoverySuggestion: 'Lütfen uygulamayı yeniden başlatın. Sorun devam ederse güvenli modda çalıştırmayı deneyin.'
    };

    const history = this.getCrashHistory();
    history.unshift(report);
    if (history.length > 100) history.pop();
    this.saveCrashHistory(history);

    logError(`[CrashPlatformEngine] Recorded local crash report [${report.id}] (${type}): ${message}`);

    // Check if rapid consecutive crashes require Safe Mode recommendation
    const recentCrashes = history.filter(c => Date.now() - new Date(c.timestamp).getTime() < 5 * 60 * 1000);
    if (recentCrashes.length >= 3) {
      this.safeModeTriggered = true;
      logError('[CrashPlatformEngine] Multiple rapid crashes detected; Safe Mode flag set.');
    }

    return report;
  }
}

export const CrashPlatformEngine = new CrashPlatformEngineCore();
