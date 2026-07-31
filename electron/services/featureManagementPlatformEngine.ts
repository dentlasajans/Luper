import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { EnterprisePlatformEngine } from './enterprisePlatformEngine.js';
import { LicensePlatform } from './licensePlatform.js';
import { logInfo } from './logger.js';

class FeatureManagementPlatformEngineCore {
  constructor() {
    this.features = new Map();
    this.initDefaultFeatures();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'features_history.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'features_history.json');
    }
  }

  initDefaultFeatures() {
    const defaults = [
      { featureId: 'feat_optimization_engine', name: 'Optimization Engine Core', description: 'Windows tweak execution pipeline', category: 'core', state: 'enabled' },
      { featureId: 'feat_game_booster', name: 'Game Booster Suite', description: 'Game optimization & process priority tuning', category: 'gaming', state: 'enabled', requiredEdition: 'free' },
      { featureId: 'feat_ai_recommendations', name: 'AI Recommendation Engine', description: 'Intelligent profile-aware recommendations', category: 'ai', state: 'enabled', requiredEdition: 'free' },
      { featureId: 'feat_custom_profiles', name: 'Custom Profiles Manager', description: 'User defined optimization profiles', category: 'profiles', state: 'premium_only', requiredEdition: 'premium' }
    ];

    // @ts-expect-error - auto fixed
    for (const f: unknown of defaults) {
      this.registerFeature(f);
    }
  }

  /**
   * Register feature into centralized Feature Catalog
   */
  registerFeature(feature: unknown) {
    // @ts-expect-error - auto fixed
    this.features.set(feature.featureId, feature);
    // @ts-expect-error - auto fixed
    logInfo(`[FeatureManagementPlatformEngine] Registered Feature: [${feature.featureId}] - ${feature.name}`);
  }

  /**
   * Evaluate whether a feature is available for current user & system
   */
  isFeatureAvailable(featureId: unknown) {
    // @ts-expect-error - auto fixed
    const feature = this.features.get(featureId);
    if (!feature) return false;

    if (feature.state === 'disabled') return false;

    // Check License Entitlement
    if (feature.requiredEdition && feature.requiredEdition !== 'free') {
      const license = LicensePlatform.validateLicense();
      if (license.edition !== 'premium' && license.edition !== 'enterprise') {
        return false;
      }
    }

    // Check Enterprise Policy Gate
    const policyCheck = EnterprisePlatformEngine.isOptimizationAllowedByPolicy({ category: feature.category, riskLevel: 'safe' });
    if (!policyCheck.allowed) return false;

    return true;
  }

  /**
   * Get complete Feature Catalog status summary
   */
  getFeatureCatalogStatus() {
    // @ts-expect-error - auto fixed
    const all = Array.from(this.features.values());
    return {
      totalRegisteredFeatures: all.length,
      // @ts-expect-error - auto fixed
      enabledFeaturesCount: all.filter((f: unknown) => f.state === 'enabled').length,
      // @ts-expect-error - auto fixed
      premiumFeaturesCount: all.filter((f: unknown) => f.state === 'premium_only').length,
      // @ts-expect-error - auto fixed
      experimentalFeaturesCount: all.filter((f: unknown) => f.state === 'experimental').length
    };
  }

    features!: unknown;
}

export const FeatureManagementPlatformEngine = new FeatureManagementPlatformEngineCore();
