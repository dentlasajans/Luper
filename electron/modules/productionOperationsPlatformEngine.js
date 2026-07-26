import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';
import { ObservabilityPlatformEngine } from './observabilityPlatformEngine.js';

class ProductionOperationsPlatformEngineCore {
  constructor() {
    this.currentMode = 'production';
    this.isMaintenanceActive = false;
    this.startTime = Date.now();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'operations_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'operations_history.json');
    }
  }

  getOperationsHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[ProductionOperationsPlatformEngine] Failed to read operations history:', { error: e.message });
    }
    return [];
  }

  saveOperationsHistory(history) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[ProductionOperationsPlatformEngine] Failed to save operations history:', { error: e.message });
      return false;
    }
  }

  /**
   * Log operational event into audit history
   */
  logOperationalEvent(action, actor = 'System', details = {}) {
    const event = {
      id: `op_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details
    };

    const history = this.getOperationsHistory();
    history.unshift(event);
    if (history.length > 200) history.pop();
    this.saveOperationsHistory(history);

    logInfo(`[ProductionOperationsPlatformEngine] Operational Event [${action}] by [${actor}]`);
    return event;
  }

  /**
   * Set platform operational mode
   */
  setOperationalMode(mode) {
    this.currentMode = mode;
    this.logOperationalEvent('SET_OPERATIONAL_MODE', 'System', { mode });
    logInfo(`[ProductionOperationsPlatformEngine] Operational mode set to: [${mode}]`);
  }

  /**
   * Enable Maintenance Mode
   */
  enableMaintenanceMode() {
    this.isMaintenanceActive = true;
    this.setOperationalMode('maintenance');
    this.logOperationalEvent('ENABLE_MAINTENANCE_MODE', 'System');
  }

  /**
   * Disable Maintenance Mode
   */
  disableMaintenanceMode() {
    this.isMaintenanceActive = false;
    this.setOperationalMode('production');
    this.logOperationalEvent('DISABLE_MAINTENANCE_MODE', 'System');
  }

  /**
   * Aggregate complete platform operational status
   */
  async getSystemOperationalStatus() {
    const snapshot = await ObservabilityPlatformEngine.captureObservabilitySnapshot();
    const unhealthyCount = snapshot.modules.filter(m => m.status === 'unhealthy').length;

    return {
      mode: this.currentMode,
      isMaintenanceActive: this.isMaintenanceActive,
      totalSubsystemsActive: snapshot.modules.length,
      unhealthySubsystemsCount: unhealthyCount,
      uptimeSeconds: Math.round((Date.now() - this.startTime) / 1000)
    };
  }
}

export const ProductionOperationsPlatformEngine = new ProductionOperationsPlatformEngineCore();
