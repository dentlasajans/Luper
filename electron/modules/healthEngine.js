import { app } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { logInfo } from './logger.js';
import {
    cachedCpuName,
    cachedOsName,
    cachedStorageDrives,
    getCpuUsageInstant
} from './systemInfo.js';

class DiagnosticsHealthEngineCore {
  constructor() {
    this.healthHistory = [];
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'health_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'health_history.json');
    }
  }

  /**
   * Execute full multi-collector diagnostic scan
   */
  async runDiagnosticScan() {
    const startTime = Date.now();
    
    const cpuUsage = getCpuUsageInstant();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsagePercent = Math.round((usedMem / totalMem) * 100);

    const drives = cachedStorageDrives || [];

    // Compute Health Sub-scores
    const cpuSubScore = Math.max(0, 100 - cpuUsage);
    const ramSubScore = Math.max(0, 100 - ramUsagePercent);

    // Overall Weighted Health Score (0 - 100)
    const overallScore = Math.round(
      (cpuSubScore * 0.50) + 
      (ramSubScore * 0.50)
    );

    let statusGrade = 'EXCELLENT';
    if (overallScore < 50) statusGrade = 'CRITICAL';
    else if (overallScore < 75) statusGrade = 'FAIR';
    else if (overallScore < 90) statusGrade = 'GOOD';

    // Bottleneck & Alert Detection
    const alerts = [];
    if (cpuUsage > 85) {
      alerts.push({ code: 'HIGH_CPU_LOAD', severity: 'warning', message: 'Yüksek CPU kullanımı tespit edildi.' });
    }
    if (ramUsagePercent > 85) {
      alerts.push({ code: 'HIGH_RAM_LOAD', severity: 'warning', message: 'Bellek kullanımı sınır seviyede.' });
    }

    const snapshot = {
      timestamp: new Date().toISOString(),
      osName: cachedOsName || `Windows ${os.release()}`,
      cpuName: cachedCpuName,
      cpuUsagePercent: cpuUsage,
      ramUsagePercent,
      ramFreeMB: Math.round(freeMem / (1024 * 1024)),
      ramTotalMB: Math.round(totalMem / (1024 * 1024)),
      storageDrives: drives,
      overallScore,
      statusGrade,
      alerts,
      scanDurationMs: Date.now() - startTime
    };

    logInfo(`[DiagnosticsHealthEngine] Completed health scan. Score: ${overallScore}/100 [${statusGrade}]`);
    return snapshot;
  }
}

export const DiagnosticsHealthEngine = new DiagnosticsHealthEngineCore();
