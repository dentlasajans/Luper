import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';
import { ObservabilityPlatformEngine } from './observabilityPlatformEngine.js';
import { PublicApiFramework } from './publicApiFramework.js';

class AutonomousPlatformEngineCore {
  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'autonomous_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'autonomous_history.json');
    }
  }

  getDecisionHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[AutonomousPlatformEngine] Failed to read autonomous decision history:', { error: e.message });
    }
    return [];
  }

  saveDecisionHistory(history) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[AutonomousPlatformEngine] Failed to save autonomous decision history:', { error: e.message });
      return false;
    }
  }

  /**
   * Autonomous decision-making engine that analyzes context and plans workflow execution
   */
  async makeAutonomousDecision(goalDescription, context = {}) {
    const decisionId = `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    logInfo(`[AutonomousPlatformEngine] Formulating autonomous decision for goal: "${goalDescription}"`);

    // Fetch system health snapshot for context awareness
    const snapshot = await ObservabilityPlatformEngine.captureObservabilitySnapshot();
    const hasUnhealthy = snapshot.overallHealthScore < 75;

    let riskLevel = 'safe';
    let confidenceScore = 92;
    let requiresHumanApproval = false;
    let explanation = 'Sistem kararlı durumda; standart optimizasyon iş akışı onaylandı.';

    if (hasUnhealthy) {
      riskLevel = 'moderate';
      confidenceScore = 78;
      explanation = 'Sistem sağlık skoru ideal seviyenin altında; kontrollü optimizasyon önerilir.';
    }

    if (context.isHighRiskTweak) {
      riskLevel = 'high';
      requiresHumanApproval = true;
      explanation = 'Yüksek riskli sistem değişikliği tespit edildi; kullanıcı onayı gereklidir.';
    }

    const decision = {
      decisionId,
      goalDescription,
      recommendedWorkflow: context.targetPackages || [],
      confidenceScore,
      riskLevel,
      requiresHumanApproval,
      explanation
    };

    let executionStatus = 'pending_approval';

    // Auto-execute if safe and human approval not required
    if (!requiresHumanApproval && decision.recommendedWorkflow.length > 0) {
      try {
        await PublicApiFramework.invoke('command.scheduleTask', {
          name: `Autonomous Task: ${goalDescription}`,
          packageIds: decision.recommendedWorkflow
        });
        executionStatus = 'auto_executed';
        logInfo(`[AutonomousPlatformEngine] Auto-executed decision [${decisionId}]`);
      } catch (err) {
        executionStatus = 'rejected';
        logError(`[AutonomousPlatformEngine] Failed to auto-execute decision [${decisionId}]: ${err.message}`);
      }
    }

    const auditRecord = {
      timestamp: new Date().toISOString(),
      decision,
      executionStatus
    };

    const history = this.getDecisionHistory();
    history.unshift(auditRecord);
    if (history.length > 100) history.pop();
    this.saveDecisionHistory(history);

    return auditRecord;
  }
}

export const AutonomousPlatformEngine = new AutonomousPlatformEngineCore();
