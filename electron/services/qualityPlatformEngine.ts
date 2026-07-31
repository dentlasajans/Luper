import { CrashPlatformEngine } from './crashPlatformEngine.js';
import { LicensePlatform } from './licensePlatform.js';
import { logError, logInfo } from './logger.js';
import { ObservabilityPlatformEngine } from './observabilityPlatformEngine.js';
import { PublicApiFramework } from './publicApiFramework.js';

class QualityPlatformEngineCore {
  constructor() {
    this.validators = new Map();
    this.initCoreValidators();
  }

  initCoreValidators() {
    // 1. Gate: Module & Subsystem Observability
    this.registerValidator('gate.observability', async () => {
      const snapshot = await ObservabilityPlatformEngine.captureObservabilitySnapshot();
      const isOk = snapshot.overallHealthScore >= 70;
      return {
        gateId: 'gate.observability',
        name: 'Observability & Subsystem Health Gate',
        status: isOk ? 'passed' : 'warning',
        score: snapshot.overallHealthScore,
        message: isOk ? 'Tüm alt sistemler sağlıklı çalışıyor.' : 'Sistem genel sağlık skoru kritik seviyenin altında.'
      };
    });

    // 2. Gate: License Integrity
    this.registerValidator('gate.license', async () => {
      const lic = LicensePlatform.validateLicense();
      return {
        gateId: 'gate.license',
        name: 'License & Entitlement Gate',
        status: lic.valid ? 'passed' : 'failed',
        score: lic.valid ? 100 : 0,
        message: lic.valid ? `Lisans aktif (${lic.edition}).` : 'Lisans doğrulama hatası.'
      };
    });

    // 3. Gate: Crash & Reliability
    this.registerValidator('gate.reliability', async () => {
      const crashes = CrashPlatformEngine.getCrashHistory();
      // @ts-expect-error - auto fixed
      const recentCount = crashes.filter((c: unknown) => Date.now() - new Date(c.timestamp).getTime() < 10 * 60 * 1000).length;
      const isFailed = recentCount >= 3;
      return {
        gateId: 'gate.reliability',
        name: 'Application Reliability & Crash Gate',
        status: isFailed ? 'failed' : (recentCount > 0 ? 'warning' : 'passed'),
        score: Math.max(0, 100 - (recentCount * 30)),
        message: isFailed ? 'Son 10 dakikada yüksek hata oranı tespit edildi.' : 'Çökme veya hata tespit edilmedi.'
      };
    });

    // 4. Gate: Public API Endpoint Integrity
    this.registerValidator('gate.publicApi', async () => {
      const res = await PublicApiFramework.invoke('query.systemHealth');
      return {
        gateId: 'gate.publicApi',
        name: 'Public API Framework Integrity Gate',
        status: res.success ? 'passed' : 'failed',
        score: res.success ? 100 : 0,
        message: res.success ? 'Public API servisleri yanıt veriyor.' : 'Public API servisi yanıt vermedi.'
      };
    });
  }

  registerValidator(gateId: unknown, validatorFn: unknown) {
    if (typeof validatorFn !== 'function') {
      throw new Error('Quality validator must be a function.');
    }
    // @ts-expect-error - auto fixed
    this.validators.set(gateId, validatorFn);
    logInfo(`[QualityPlatformEngine] Registered Quality Gate: [${gateId}]`);
  }

  /**
   * Run full continuous quality audit across all registered quality gates
   */
  async runContinuousQualityAudit() {
    const startTime = Date.now();
    logInfo('[QualityPlatformEngine] Executing continuous quality audit...');

    const gates: unknown[] = [];
    let hasFailure = false;
    let hasWarning = false;

    // @ts-expect-error - auto fixed
    for (const [gateId, validatorFn]: unknown of this.validators.entries()) {
      try {
        const res = await validatorFn();
        gates.push(res);
        if (res.status === 'failed') hasFailure = true;
        if (res.status === 'warning') hasWarning = true;
      } catch (err) {
        logError(`[QualityPlatformEngine] Quality Gate [${gateId}] exception:`, { error: (err as Error).message });
        gates.push({
          gateId,
          name: gateId,
          status: 'failed',
          score: 0,
          message: (err as Error).message
        });
        hasFailure = true;
      }
    }

    let overallStatus = 'passed';
    if (hasFailure) overallStatus = 'failed';
    else if (hasWarning) overallStatus = 'warning';

    const report = {
      timestamp: new Date().toISOString(),
      overallStatus,
      gates,
      scanDurationMs: Date.now() - startTime
    };

    logInfo(`[QualityPlatformEngine] Quality Audit completed with status [${overallStatus.toUpperCase()}] in ${report.scanDurationMs}ms`);
    return report;
  }

    validators!: unknown;
}

export const QualityPlatformEngine = new QualityPlatformEngineCore();
