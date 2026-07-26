import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';
import { ObservabilityPlatformEngine } from './observabilityPlatformEngine.js';

class PlatformIntegrationEngineCore {
  constructor() {
    this.contracts = new Map();
    this.eventListeners = new Map();
    this.initDefaultContracts();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'integration_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'integration_history.json');
    }
  }

  getIntegrationHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[PlatformIntegrationEngine] Failed to read integration history:', { error: e.message });
    }
    return [];
  }

  saveIntegrationHistory(history) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[PlatformIntegrationEngine] Failed to save integration history:', { error: e.message });
      return false;
    }
  }

  initDefaultContracts() {
    const defaultServices = [
      { serviceId: 'srv.optimization', name: 'Optimization Engine', version: '1.0.0', dependencies: ['srv.windows_exec'], capabilities: ['apply', 'restore'], state: 'connected' },
      { serviceId: 'srv.scheduler', name: 'Scheduler Engine', version: '1.0.0', dependencies: ['srv.optimization'], capabilities: ['queue', 'batch'], state: 'connected' },
      { serviceId: 'srv.public_api', name: 'Public API Framework', version: '1.0.0', dependencies: [], capabilities: ['invoke', 'query'], state: 'connected' },
      { serviceId: 'srv.observability', name: 'Observability Platform', version: '1.0.0', dependencies: [], capabilities: ['snapshot', 'metrics'], state: 'connected' }
    ];

    for (const srv of defaultServices) {
      this.registerContract(srv);
    }
  }

  /**
   * Register a new subsystem integration contract
   */
  registerContract(contract) {
    this.contracts.set(contract.serviceId, contract);
    logInfo(`[PlatformIntegrationEngine] Registered Integration Contract: [${contract.serviceId}] - ${contract.name}`);
  }

  /**
   * Cross-engine event router
   */
  publishIntegrationEvent(channel, payload = {}) {
    const listeners = this.eventListeners.get(channel) || [];
    for (const listener of listeners) {
      try {
        listener(payload);
      } catch (err) {
        logError(`[PlatformIntegrationEngine] Listener error on channel [${channel}]:`, { error: err.message });
      }
    }
  }

  subscribeIntegrationEvent(channel, listenerFn) {
    if (!this.eventListeners.has(channel)) {
      this.eventListeners.set(channel, []);
    }
    this.eventListeners.get(channel).push(listenerFn);
  }

  /**
   * Synchronize platform state across all registered subsystems
   */
  async synchronizePlatformState() {
    const startTime = Date.now();
    logInfo('[PlatformIntegrationEngine] Synchronizing platform state across integration contracts...');

    const snapshot = await ObservabilityPlatformEngine.captureObservabilitySnapshot();
    let degradedCount = 0;

    for (const [id, contract] of this.contracts.entries()) {
      const match = snapshot.modules.find(m => m.moduleName.toLowerCase().includes(contract.name.toLowerCase().replace(/\s+/g, '')));
      if (match && match.status !== 'healthy') {
        contract.state = 'degraded';
        degradedCount++;
      } else {
        contract.state = 'connected';
      }
    }

    const report = {
      timestamp: new Date().toISOString(),
      registeredServicesCount: this.contracts.size,
      activeContractsCount: this.contracts.size - degradedCount,
      degradedServicesCount: degradedCount,
      syncDurationMs: Date.now() - startTime
    };

    const history = this.getIntegrationHistory();
    history.unshift(report);
    if (history.length > 50) history.pop();
    this.saveIntegrationHistory(history);

    logInfo(`[PlatformIntegrationEngine] State sync completed. Active Contracts: ${report.activeContractsCount}/${report.registeredServicesCount} in ${report.syncDurationMs}ms`);
    return report;
  }

  /**
   * Evaluate Platform Integration Health Score
   */
  getIntegrationHealthScore() {
    const total = this.contracts.size;
    const degraded = Array.from(this.contracts.values()).filter(c => c.state === 'degraded').length;
    const score = total > 0 ? Math.round(((total - degraded) / total) * 100) : 100;

    return {
      integrationScore: score,
      registeredServicesCount: total,
      activeContractsCount: total - degraded,
      degradedServicesCount: degraded
    };
  }
}

export const PlatformIntegrationEngine = new PlatformIntegrationEngineCore();
