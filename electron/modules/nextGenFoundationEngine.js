import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { logInfo } from './logger.js';

class NextGenFoundationEngineCore {
  constructor() {
    this.abstractions = new Map();
    this.experimentalFeatures = new Map();
    this.initDefaultAbstractions();
  }

  getStoragePath() {
    try {
      const dir = app.getPath('userData');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return path.join(dir, 'nextgen_foundation.json');
    } catch (e) {
      return path.join(app.getAppPath(), 'nextgen_foundation.json');
    }
  }

  initDefaultAbstractions() {
    // 1. AI Provider Abstraction
    this.registerAbstraction('ai_provider', { name: 'Local Ollama & Open-Source AI Bridge', version: '1.0.0' });
    // 2. Hardware Abstraction Layer
    this.registerAbstraction('hardware', { name: 'Unified Hardware Sensor Adapter', version: '1.0.0' });
    // 3. Storage Abstraction Layer
    this.registerAbstraction('storage', { name: 'Dual-Layer Offline Persistence Store', version: '1.0.0' });

    // Experimental Feature Preview
    this.registerExperimentalFeature({
      featureId: 'exp_directx_nvme_boost',
      name: 'DirectX & NVMe Direct Storage Acceleration (Preview)',
      description: 'Düşük seviye DirectStorage sürücü yapılandırmaları.',
      isEnabled: false,
      minApiVersion: '1.0.0',
      abstractionType: 'hardware'
    });
  }

  /**
   * Register a new technology or provider abstraction
   */
  registerAbstraction(type, providerSpec) {
    this.abstractions.set(type, providerSpec);
    logInfo(`[NextGenFoundationEngine] Registered Abstraction Adapter: [${type}] - ${providerSpec.name}`);
  }

  /**
   * Register experimental feature preview
   */
  registerExperimentalFeature(featureSpec) {
    this.experimentalFeatures.set(featureSpec.featureId, featureSpec);
    logInfo(`[NextGenFoundationEngine] Registered Experimental Feature Preview: [${featureSpec.featureId}]`);
  }

  /**
   * Toggle experimental feature flag
   */
  toggleExperimentalFeature(featureId, enabled) {
    const feat = this.experimentalFeatures.get(featureId);
    if (!feat) {
      throw new Error(`Experimental feature '${featureId}' not found.`);
    }
    feat.isEnabled = Boolean(enabled);
    this.experimentalFeatures.set(featureId, feat);
    logInfo(`[NextGenFoundationEngine] Toggled experimental feature [${featureId}] -> ${feat.isEnabled}`);
    return feat;
  }

  /**
   * Evaluate Future Readiness Score
   */
  getFutureReadinessScore() {
    const abstractionsCount = this.abstractions.size;
    const expCount = this.experimentalFeatures.size;
    const score = Math.min(100, Math.max(50, (abstractionsCount * 25) + (expCount * 15)));

    return {
      futureReadinessScore: score,
      registeredAbstractionsCount: abstractionsCount,
      experimentalFeaturesCount: expCount,
      compatibilityLayerActive: true
    };
  }
}

export const NextGenFoundationEngine = new NextGenFoundationEngineCore();
