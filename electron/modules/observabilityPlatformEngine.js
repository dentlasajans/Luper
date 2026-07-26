import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { DiagnosticsHealthEngine } from './healthEngine.js';
import { logInfo } from './logger.js';

class ObservabilityPlatformEngineCore {
  constructor() {
    this.moduleHealthRegistry = new Map();
    this.startTime = Date.now();
    this.initDefaultModuleStatus();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'observability_metrics.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'observability_metrics.json');
    }
  }

  initDefaultModuleStatus() {
    const modules = [
      'OptimizationEngine',
      'WindowsExecutionEngine',
      'ValidationEngine',
      'BackupRestoreEngine',
      'BenchmarkEngine',
      'DiagnosticsHealthEngine',
      'OptimizationSchedulerEngine',
      'PluginManager',
      'CloudContentPlatform',
      'LicensePlatform',
      'PublicApiFramework',
      'LocalAnalyticsPlatform'
    ];

    for (const name of modules) {
      this.moduleHealthRegistry.set(name, {
        moduleName: name,
        status: 'healthy',
        lastChecked: new Date().toISOString(),
        uptimeSeconds: 0,
        errorCount: 0
      });
    }
  }

  /**
   * Update subsystem module status
   */
  updateModuleStatus(moduleName, status = 'healthy', errorCount = 0) {
    const current = this.moduleHealthRegistry.get(moduleName) || {
      moduleName,
      status: 'healthy',
      uptimeSeconds: 0,
      errorCount: 0
    };

    current.status = status;
    current.errorCount += errorCount;
    current.lastChecked = new Date().toISOString();
    current.uptimeSeconds = Math.round((Date.now() - this.startTime) / 1000);

    this.moduleHealthRegistry.set(moduleName, current);
  }

  /**
   * Capture system-wide observability snapshot
   */
  async captureObservabilitySnapshot() {
    const diagScan = await DiagnosticsHealthEngine.runDiagnosticScan();
    const modules = Array.from(this.moduleHealthRegistry.values());

    const activeAlerts = diagScan.alerts.map(a => ({
      id: `alert_${Date.now()}_${a.code}`,
      level: a.severity === 'critical' ? 'critical' : (a.severity === 'warning' ? 'warning' : 'info'),
      message: a.message,
      sourceModule: 'DiagnosticsHealthEngine',
      timestamp: new Date().toISOString()
    }));

    const snapshot = {
      timestamp: new Date().toISOString(),
      overallHealthScore: diagScan.overallScore,
      modules,
      activeAlerts
    };

    logInfo(`[ObservabilityPlatformEngine] Captured snapshot. System Health Score: ${diagScan.overallScore}/100`);
    return snapshot;
  }
}

export const ObservabilityPlatformEngine = new ObservabilityPlatformEngineCore();
