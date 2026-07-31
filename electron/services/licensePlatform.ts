import crypto from 'crypto';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './logger.js';

class LicensePlatformCore {
  constructor() {
    this.cachedToken = null;
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'license.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'license.json');
    }
  }

  /**
   * Get unique hardware device identifier
   */
  getDeviceId() {
    const raw = `${process.env.COMPUTERNAME || 'LOCAL'}_${process.arch}_${process.platform}`;
    return crypto.createHash('md5').update(raw).digest('hex').substring(0, 16);
  }

  /**
   * Default Free Edition Entitlements
   */
  getDefaultFreeToken() {
    return {
      licenseKey: 'FREE-COMMUNITY-EDITION',
      edition: 'free',
      status: 'active',
      issuedAt: new Date().toISOString(),
      expiresAt: '2099-12-31T23:59:59.000Z',
      deviceId: this.getDeviceId(),
      entitlements: {
        maxDevices: 1,
        advancedOptimizations: true,
        gameBoosterUnlocked: true,
        aiRecommendationsUnlocked: true,
        customProfilesUnlocked: true,
        prioritySupport: false
      }
    };
  }

  /**
   * Read stored license token or return Free Edition default
   */
  getStoredLicenseToken() {
    try {
      const p = this.getStoragePath();
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {
      logError('[LicensePlatform] Failed to read stored license token:', { error: (e as Error).message });
    }
    return this.getDefaultFreeToken();
  }

  /**
   * Save license token to local storage
   */
  saveLicenseToken(token: unknown) {
    try {
      const p = this.getStoragePath();
      fs.writeFileSync(p, JSON.stringify(token, null, 2), 'utf8');
      this.cachedToken = token;
      return true;
    } catch (e) {
      logError('[LicensePlatform] Failed to save license token:', { error: (e as Error).message });
      return false;
    }
  }

  /**
   * Validate license token expiration and status
   */
  validateLicense() {
    const token = this.getStoredLicenseToken();
    const now = new Date();
    const expiresAt = new Date(token.expiresAt);

    if (token.status === 'revoked') {
      return { valid: false, status: 'revoked', edition: 'free' };
    }

    if (now > expiresAt) {
      return { valid: false, status: 'expired', edition: 'free' };
    }

    return {
      valid: true,
      status: token.status,
      edition: token.edition,
      token
    };
  }

  /**
   * Feature Gate check
   */
  isFeatureUnlocked(featureKey: unknown) {
    const validation = this.validateLicense();
    if (!validation.valid) return false;

    const token = validation.token;
    if (token.edition === 'enterprise' || token.edition === 'premium') {
      return true;
    }

    // @ts-expect-error - auto fixed
    return Boolean(token.entitlements[featureKey]);
  }

  /**
   * Activate a license key
   */
  async activateLicenseKey(licenseKey: unknown) {
    logInfo(`[LicensePlatform] Activating license key: [${licenseKey}]`);

    if (!licenseKey || typeof licenseKey !== 'string') {
      throw new Error('Geçersiz lisans anahtarı.');
    }

    // Mock validation logic for local activation
    const newToken = {
      licenseKey: licenseKey.trim(),
      edition: 'premium',
      status: 'active',
      issuedAt: new Date().toISOString(),
      expiresAt: '2099-12-31T23:59:59.000Z',
      deviceId: this.getDeviceId(),
      entitlements: {
        maxDevices: 3,
        advancedOptimizations: true,
        gameBoosterUnlocked: true,
        aiRecommendationsUnlocked: true,
        customProfilesUnlocked: true,
        prioritySupport: true
      }
    };

    this.saveLicenseToken(newToken);
    logInfo(`[LicensePlatform] License successfully activated for edition: Premium`);

    return {
      success: true,
      edition: 'premium',
      expiresAt: newToken.expiresAt
    };
  }

    cachedToken!: unknown;
}

export const LicensePlatform = new LicensePlatformCore();
