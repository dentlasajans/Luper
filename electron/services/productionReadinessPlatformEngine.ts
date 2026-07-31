import { CrashPlatformEngine } from './crashPlatformEngine.js';
import { logInfo } from './logger.js';
import { ObservabilityPlatformEngine } from './observabilityPlatformEngine.js';
import { QualityPlatformEngine } from './qualityPlatformEngine.js';
import { SecurityPlatformEngine } from './securityPlatformEngine.js';

class ProductionReadinessPlatformEngineCore {
  /**
   * Run full production readiness evaluation pipeline
   */
  async evaluateProductionReadiness() {
    const startTime = Date.now();
    logInfo('[ProductionReadinessPlatformEngine] Running production readiness release checks...');

    const checks: unknown[] = [];

    // 1. Continuous Quality Audit Check
    try {
      const qualityReport = await QualityPlatformEngine.runContinuousQualityAudit();
      const passed = qualityReport.overallStatus !== 'failed';
      checks.push({
        id: 'quality_audit',
        name: 'Continuous Quality Platform Audit',
        category: 'Quality',
        passed,
        score: passed ? 100 : 50,
        message: `Overall quality status: ${qualityReport.overallStatus.toUpperCase()}`
      });
    } catch (e) {
      checks.push({ id: 'quality_audit', name: 'Continuous Quality Platform Audit', category: 'Quality', passed: false, score: 0, message: (e as Error).message });
    }

    // 2. Security Health Score Check
    try {
      const secReport = SecurityPlatformEngine.getSecurityHealthScore();
      const passed = secReport.score >= 80;
      checks.push({
        id: 'security_audit',
        name: 'Security Hardening Platform Audit',
        category: 'Security',
        passed,
        score: secReport.score,
        message: `Security score: ${secReport.score}/100 (Violations: ${secReport.violationsCount})`
      });
    } catch (e) {
      checks.push({ id: 'security_audit', name: 'Security Hardening Platform Audit', category: 'Security', passed: false, score: 0, message: (e as Error).message });
    }

    // 3. Subsystem Observability Snapshot Check
    try {
      const obsReport = await ObservabilityPlatformEngine.captureObservabilitySnapshot();
      const passed = obsReport.overallHealthScore >= 75;
      checks.push({
        id: 'observability_audit',
        name: 'Observability & Subsystem Health Audit',
        category: 'Observability',
        passed,
        score: obsReport.overallHealthScore,
        message: `Observability score: ${obsReport.overallHealthScore}/100`
      });
    } catch (e) {
      checks.push({ id: 'observability_audit', name: 'Observability & Subsystem Health Audit', category: 'Observability', passed: false, score: 0, message: (e as Error).message });
    }

    // 4. Crash Reliability History Check
    try {
      const crashes = CrashPlatformEngine.getCrashHistory();
      // @ts-expect-error - auto fixed
      const recentCrashes = crashes.filter((c: unknown) => Date.now() - new Date(c.timestamp).getTime() < 10 * 60 * 1000);
      const passed = recentCrashes.length === 0;
      checks.push({
        id: 'reliability_audit',
        name: 'Crash Reliability Check',
        category: 'Reliability',
        passed,
        score: passed ? 100 : 50,
        message: passed ? 'Zero recent crashes detected.' : `${recentCrashes.length} recent crashes recorded.`
      });
    } catch (e) {
      checks.push({ id: 'reliability_audit', name: 'Crash Reliability Check', category: 'Reliability', passed: false, score: 0, message: (e as Error).message });
    }

    // Calculate aggregated Production Score
    // @ts-expect-error - auto fixed
    const totalScore = checks.reduce((acc: unknown, c: unknown) => acc + c.score, 0);
    // @ts-expect-error - auto fixed
    const productionScore = Math.round(totalScore / checks.length);
    // @ts-expect-error - auto fixed
    const allPassed = checks.every((c: unknown) => c.passed);

    let approvalStatus = 'rejected';
    if (allPassed && productionScore >= 85) {
      approvalStatus = 'approved';
    } else if (productionScore >= 70) {
      approvalStatus = 'pending';
    }

    const report = {
      timestamp: new Date().toISOString(),
      productionScore,
      approvalStatus,
      checks,
      scanDurationMs: Date.now() - startTime
    };

    logInfo(`[ProductionReadinessPlatformEngine] Readiness evaluation completed. Production Score: ${productionScore}/100 -> Status: [${approvalStatus.toUpperCase()}]`);
    return report;
  }
}

export const ProductionReadinessPlatformEngine = new ProductionReadinessPlatformEngineCore();
