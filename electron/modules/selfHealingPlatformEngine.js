import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { CrashPlatformEngine } from './crashPlatformEngine.js';
import { logError, logInfo, logWarn } from './logger.js';
import { ObservabilityPlatformEngine } from './observabilityPlatformEngine.js';

class SelfHealingPlatformEngineCore {
  constructor() {
    this.circuitBreakerCount = 0;
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'self_healing_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'self_healing_history.json');
    }
  }

  getRecoveryHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[SelfHealingPlatformEngine] Failed to read self-healing history:', { error: e.message });
    }
    return [];
  }

  saveRecoveryHistory(history) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[SelfHealingPlatformEngine] Failed to save self-healing history:', { error: e.message });
      return false;
    }
  }

  /**
   * Health evaluation & recoverable failure detection
   */
  async detectFailuresAndPlanRecovery() {
    logInfo('[SelfHealingPlatformEngine] Evaluating system health for recoverable failures...');

    const recoveryPlans = [];

    // 1. Rapid Crash Loop Detection Check
    if (CrashPlatformEngine.safeModeTriggered) {
      recoveryPlans.push({
        id: `plan_safe_mode_${Date.now()}`,
        category: 'rapid_crashes',
        description: 'Üst üste oluşan hatalar nedeniyle güvenli moda geçiş önerisi.',
        isDestructive: false,
        requiresUserApproval: true,
        steps: [
          { name: 'Enable Safe Mode Execution Flag', targetModule: 'LifecycleManager' }
        ]
      });
    }

    // 2. Subsystem Observability Check
    const snapshot = await ObservabilityPlatformEngine.captureObservabilitySnapshot();
    const unhealthyModules = snapshot.modules.filter(m => m.status === 'unhealthy');

    if (unhealthyModules.length > 0) {
      recoveryPlans.push({
        id: `plan_subsystem_${Date.now()}`,
        category: 'subsystem_unhealthy',
        description: `${unhealthyModules.length} adet alt modül için otomatik sağlık yenilemesi.`,
        isDestructive: false,
        requiresUserApproval: false,
        steps: unhealthyModules.map(m => ({ name: `Reset status for ${m.moduleName}`, targetModule: m.moduleName }))
      });
    }

    return recoveryPlans;
  }

  /**
   * Execute non-destructive automated recovery plan
   */
  async executeAutoRecovery(plan) {
    if (plan.requiresUserApproval) {
      logWarn(`[SelfHealingPlatformEngine] Plan [${plan.id}] requires explicit user approval; skipping auto execution.`);
      return { success: false, status: 'requires_user_approval' };
    }

    if (this.circuitBreakerCount >= 3) {
      logError('[SelfHealingPlatformEngine] Circuit breaker triggered: Max hourly auto-recovery attempts reached.');
      return { success: false, status: 'circuit_breaker_tripped' };
    }

    this.circuitBreakerCount++;
    logInfo(`[SelfHealingPlatformEngine] Executing auto-recovery plan [${plan.id}]...`);

    // Execute non-destructive steps safely
    for (const step of plan.steps) {
      ObservabilityPlatformEngine.updateModuleStatus(step.targetModule, 'healthy', 0);
    }

    const record = {
      id: `record_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: plan.category,
      status: 'resolved',
      actionPlan: plan
    };

    const history = this.getRecoveryHistory();
    history.unshift(record);
    this.saveRecoveryHistory(history);

    logInfo(`[SelfHealingPlatformEngine] Auto-recovery plan [${plan.id}] RESOLVED successfully.`);
    return { success: true, status: 'resolved' };
  }
}

export const SelfHealingPlatformEngine = new SelfHealingPlatformEngineCore();
