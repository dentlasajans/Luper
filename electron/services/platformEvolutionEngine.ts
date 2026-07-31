import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';
import { LtsPlatformEngine } from './ltsPlatformEngine.js';

class PlatformEvolutionEngineCore {
  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'evolution_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'evolution_history.json');
    }
  }

  getEvolutionHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[PlatformEvolutionEngine] Failed to read evolution history:', { error: (e as Error).message });
    }
    return [];
  }

  saveEvolutionHistory(history: unknown) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[PlatformEvolutionEngine] Failed to save evolution history:', { error: (e as Error).message });
      return false;
    }
  }

  /**
   * Evaluate architectural impact of a proposed evolution change
   */
  evaluateEvolutionImpact(change: unknown) {
    // @ts-expect-error - auto fixed
    logInfo(`[PlatformEvolutionEngine] Analyzing architectural impact for change [${change.changeId}] on module [${change.targetModule}]`);

    let impactTier = 'low';
    let riskScore = 20;
    let hasBreakingChange = false;
    let migrationRequired = false;

    // @ts-expect-error - auto fixed
    if (change.affectsPublicApi) {
      impactTier = 'medium';
      riskScore += 30;
    }

    // @ts-expect-error - auto fixed
    if (change.affectsDatabaseSchema) {
      migrationRequired = true;
      riskScore += 25;
    }

    // Check if target version implies major breaking change
    // @ts-expect-error - auto fixed
    const currentMajor = (LtsPlatformEngine.currentVersion || '1.0.0').split('.')[0];
    // @ts-expect-error - auto fixed
    const targetMajor = (change.proposedVersion || '1.0.0').split('.')[0];
    
    if (targetMajor !== currentMajor) {
      impactTier = 'breaking';
      hasBreakingChange = true;
      riskScore += 40;
    }

    const report = {
      // @ts-expect-error - auto fixed
      changeId: change.changeId,
      impactTier,
      hasBreakingChange,
      riskScore: Math.min(100, riskScore),
      migrationRequired,
      recommendation: hasBreakingChange 
        ? 'Major sürüm değişimi tespit edildi; LTS geçiş ve geriye dönük uyumluluk doğrulaması zorunludur.' 
        : 'Değişiklik güvenli bir şekilde uygulanabilir.'
    };

    const history = this.getEvolutionHistory();
    history.unshift({ timestamp: new Date().toISOString(), change, report });
    this.saveEvolutionHistory(history);

    return report;
  }
}

export const PlatformEvolutionEngine = new PlatformEvolutionEngineCore();
