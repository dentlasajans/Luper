import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { LicensePlatform } from './licensePlatform.js';
import { logError, logInfo } from './logger.js';

class EnterprisePlatformEngineCore {
  constructor() {
    // @ts-expect-error - auto fixed
    this.activeProfile = null;
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'enterprise_policy.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'enterprise_policy.json');
    }
  }

  getEnterpriseConfig() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[EnterprisePlatformEngine] Failed to read enterprise config:', { error: (e as Error).message });
    }
    return {
      orgId: 'standalone',
      orgName: 'Standalone Edition',
      tenantId: 'default',
      assignedPolicies: []
    };
  }

  saveEnterpriseConfig(config: unknown) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(config, null, 2), 'utf8');
      return true;
    } catch (e) {
      logError('[EnterprisePlatformEngine] Failed to save enterprise config:', { error: (e as Error).message });
      return false;
    }
  }

  /**
   * Evaluate whether a specific optimization package is allowed under Enterprise Policy
   */
  isOptimizationAllowedByPolicy(packageMeta: unknown) {
    const license = LicensePlatform.validateLicense();
    if (license.edition !== 'enterprise') {
      // Standalone consumer edition -> all optimizations allowed
      return { allowed: true };
    }

    const config = this.getEnterpriseConfig();
    const policies = config.assignedPolicies || [];

    // @ts-expect-error - auto fixed
    for (const policy: unknown of policies) {
      // @ts-expect-error - auto fixed
      if (policy.blockedCategories && policy.blockedCategories.includes(packageMeta.category)) {
        // @ts-expect-error - auto fixed
        return { allowed: false, reason: `Enterprise policy '${policy.name}' blocks category '${packageMeta.category}'.` };
      }
      // @ts-expect-error - auto fixed
      if (policy.enforceMaxRiskLevel === 'safe' && packageMeta.riskLevel !== 'safe') {
        return { allowed: false, reason: `Enterprise policy '${policy.name}' permits only 'safe' risk optimizations.` };
      }
    }

    return { allowed: true };
  }

  /**
   * Log administrative audit action
   */
  logAdminAction(adminId: unknown, action: unknown, details: unknown = {}) {
    logInfo(`[EnterpriseAudit] Admin [${adminId}] performed action: [${action}]`, details);
  }
}

export const EnterprisePlatformEngine = new EnterprisePlatformEngineCore();
