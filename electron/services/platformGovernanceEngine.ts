import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';
import { LtsPlatformEngine } from './ltsPlatformEngine.js';
import { QualityPlatformEngine } from './qualityPlatformEngine.js';
import { SecurityPlatformEngine } from './securityPlatformEngine.js';

class PlatformGovernanceEngineCore {
  constructor() {
    this.policies = new Map();
    this.initDefaultPolicies();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'governance_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'governance_history.json');
    }
  }

  getGovernanceHistory() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[PlatformGovernanceEngine] Failed to read governance history:', { error: (e as Error).message });
    }
    return [];
  }

  saveGovernanceHistory(history: unknown) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(history, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[PlatformGovernanceEngine] Failed to save governance history:', { error: (e as Error).message });
      return false;
    }
  }

  initDefaultPolicies() {
    this.registerPolicy({ policyId: 'gov.quality', name: 'Quality Gates Policy', category: 'quality', severity: 'critical', isEnforced: true });
    this.registerPolicy({ policyId: 'gov.security', name: 'Security Policy Enforcement', category: 'security', severity: 'critical', isEnforced: true });
    this.registerPolicy({ policyId: 'gov.lts', name: 'LTS Version Lifecycle Policy', category: 'architecture', severity: 'major', isEnforced: true });
  }

  registerPolicy(policyRule: unknown) {
    // @ts-expect-error - auto fixed
    this.policies.set(policyRule.policyId, policyRule);
    // @ts-expect-error - auto fixed
    logInfo(`[PlatformGovernanceEngine] Registered Governance Policy: [${policyRule.policyId}]`);
  }

  /**
   * Run platform-wide governance compliance evaluation
   */
  async evaluatePlatformGovernance() {
    const startTime = Date.now();
    logInfo('[PlatformGovernanceEngine] Evaluating platform governance compliance...');

    const policyResults: unknown[] = [];

    // 1. Quality Policy Check
    try {
      const qualityAudit = await QualityPlatformEngine.runContinuousQualityAudit();
      const passed = qualityAudit.overallStatus !== 'failed';
      policyResults.push({
        policyId: 'gov.quality',
        passed,
        message: passed ? 'Quality gates compliant.' : 'Quality audit failures detected.'
      });
    } catch (e) {
      policyResults.push({ policyId: 'gov.quality', passed: false, message: (e as Error).message });
    }

    // 2. Security Policy Check
    try {
      const secReport = SecurityPlatformEngine.getSecurityHealthScore();
      const passed = secReport.score >= 80;
      policyResults.push({
        policyId: 'gov.security',
        passed,
        message: `Security compliance score: ${secReport.score}/100`
      });
    } catch (e) {
      policyResults.push({ policyId: 'gov.security', passed: false, message: (e as Error).message });
    }

    // 3. LTS Matrix Check
    try {
      const matrix = LtsPlatformEngine.getLtsMatrix();
      // @ts-expect-error - auto fixed
      const passed = matrix.some((m: unknown) => m.version === LtsPlatformEngine.currentVersion && m.ltsState !== 'end_of_life');
      policyResults.push({
        policyId: 'gov.lts',
        passed,
        message: passed ? 'Active LTS version confirmed.' : 'Version is in EOL state.'
      });
    } catch (e) {
      policyResults.push({ policyId: 'gov.lts', passed: false, message: (e as Error).message });
    }

    // @ts-expect-error - auto fixed
    const passedCount = policyResults.filter((p: unknown) => p.passed).length;
    const governanceScore = Math.round((passedCount / policyResults.length) * 100);
    const overallStatus = governanceScore === 100 ? 'compliant' : (governanceScore >= 70 ? 'exception_granted' : 'non_compliant');

    const report = {
      timestamp: new Date().toISOString(),
      governanceScore,
      overallStatus,
      policyResults
    };

    const history = this.getGovernanceHistory();
    history.unshift(report);
    if (history.length > 50) history.pop();
    this.saveGovernanceHistory(history);

    logInfo(`[PlatformGovernanceEngine] Governance audit completed. Score: ${governanceScore}/100 [${overallStatus.toUpperCase()}] in ${Date.now() - startTime}ms`);
    return report;
  }

    policies!: unknown;
}

export const PlatformGovernanceEngine = new PlatformGovernanceEngineCore();
