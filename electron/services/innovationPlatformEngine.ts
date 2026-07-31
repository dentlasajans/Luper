import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo, logWarn } from './logger.js';
import { PlatformGovernanceEngine } from './platformGovernanceEngine.js';

class InnovationPlatformEngineCore {
  constructor() {
    this.experiments = new Map();
    this.initDefaultIncubations();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'innovation_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'innovation_history.json');
    }
  }

  getInnovationHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[InnovationPlatformEngine] Failed to read innovation history:', { error: (e as Error).message });
    }
    return [];
  }

  saveInnovationHistory(history: unknown) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[InnovationPlatformEngine] Failed to save innovation history:', { error: (e as Error).message });
      return false;
    }
  }

  initDefaultIncubations() {
    this.incubateFeature({
      experimentId: 'exp_directx_directstorage',
      name: 'DirectX DirectStorage Acceleration API',
      description: 'NVMe disk doğrudan GPU veri aktarımı deneysel modülü.',
      channel: 'canary',
      status: 'incubating',
      isIsolated: true,
      successRate: 95
    });
  }

  /**
   * Register a new feature incubation experiment in the Innovation Sandbox
   */
  incubateFeature(experimentSpec: unknown) {
    // @ts-expect-error - auto fixed
    this.experiments.set(experimentSpec.experimentId, experimentSpec);
    // @ts-expect-error - auto fixed
    logInfo(`[InnovationPlatformEngine] Incubating feature experiment in sandbox: [${experimentSpec.experimentId}] - ${experimentSpec.name}`);
  }

  /**
   * Promote an incubation experiment to production status after quality & governance validation
   */
  async promoteToProduction(experimentId: unknown) {
    // @ts-expect-error - auto fixed
    const exp = this.experiments.get(experimentId);
    if (!exp) {
      throw new Error(`Experiment '${experimentId}' not found.`);
    }

    // Verify Governance Compliance
    const govReport = await PlatformGovernanceEngine.evaluatePlatformGovernance();
    if (govReport.overallStatus === 'non_compliant') {
      logError(`[InnovationPlatformEngine] Cannot promote experiment [${experimentId}]; Platform Governance non-compliant.`);
      return { success: false, reason: 'Governance non-compliant' };
    }

    if (exp.successRate < 90) {
      logWarn(`[InnovationPlatformEngine] Experiment [${experimentId}] success rate (${exp.successRate}%) below 90% threshold.`);
      return { success: false, reason: 'Success rate threshold not met' };
    }

    exp.status = 'promoted';
    exp.isIsolated = false;
    // @ts-expect-error - auto fixed
    this.experiments.set(experimentId, exp);

    const history = this.getInnovationHistory();
    history.unshift({ timestamp: new Date().toISOString(), action: 'PROMOTED_TO_PRODUCTION', experiment: exp });
    this.saveInnovationHistory(history);

    logInfo(`[InnovationPlatformEngine] Successfully promoted experiment [${experimentId}] to production pipeline!`);
    return { success: true, experiment: exp };
  }

  /**
   * Evaluate Innovation Health Score
   */
  getInnovationHealthScore() {
    // @ts-expect-error - auto fixed
    const total = this.experiments.size;
    // @ts-expect-error - auto fixed
    const promoted = Array.from(this.experiments.values()).filter((e: unknown) => e.status === 'promoted').length;
    const score = Math.min(100, Math.max(50, 70 + (promoted * 10)));

    return {
      innovationScore: score,
      activeIncubationsCount: total - promoted,
      promotedFeaturesCount: promoted,
      retiredExperimentsCount: 0
    };
  }

    experiments!: unknown;
}

export const InnovationPlatformEngine = new InnovationPlatformEngineCore();
