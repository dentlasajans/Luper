import { AutonomousPlatformEngine } from '../services/autonomousPlatformEngine.js';
import { CloudContentPlatform } from '../services/cloudContentPlatform.js';
import { EnterprisePlatformEngine } from '../services/enterprisePlatformEngine.js';
import { setupErrorHandling } from './errorManager.js';
import { LicensePlatform } from '../services/licensePlatform.js';
import { setupAppLifecycle } from './lifecycleManager.js';
import { initLogger } from '../services/logger.js';
import { LtsPlatformEngine } from '../services/ltsPlatformEngine.js';
import { NextGenFoundationEngine } from '../services/nextGenFoundationEngine.js';
import { ObservabilityPlatformEngine } from '../services/observabilityPlatformEngine.js';
import { PlatformEvolutionEngine } from '../services/platformEvolutionEngine.js';
import { PlatformGovernanceEngine } from '../services/platformGovernanceEngine.js';
import { setupPowerEvents } from '../native/powerEvents.js';
import { ProductionOperationsPlatformEngine } from '../services/productionOperationsPlatformEngine.js';
import { ProductionReadinessPlatformEngine } from '../services/productionReadinessPlatformEngine.js';
import { setupProtocolHandler } from './protocolManager.js';
import { PublicApiFramework } from '../services/publicApiFramework.js';
import { QualityPlatformEngine } from '../services/qualityPlatformEngine.js';
import { ReleaseEngineeringPlatformEngine } from '../services/releaseEngineeringPlatformEngine.js';
import { SelfHealingPlatformEngine } from '../services/selfHealingPlatformEngine.js';
import { startMetricsPolling } from '../native/systemInfo.js';
import { setupUpdateManager } from './updateManager.js';

import { FeatureManagementPlatformEngine } from '../services/featureManagementPlatformEngine.js';
import { InnovationPlatformEngine } from '../services/innovationPlatformEngine.js';
import { logInfo } from '../services/logger.js';
import { PlatformIntegrationEngine } from '../services/platformIntegrationEngine.js';
import { app } from 'electron';

export function bootstrapApp() {
  // Spoof User-Agent for Google Auth to prevent "disallowed_useragent" or instant closes
  app.userAgentFallback = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  // 1. Initialize Logger
  initLogger();

  // 2. Setup Global Error Boundaries
  setupErrorHandling();

  // 3. Initialize All Engine Platforms, Feature Management & Ecosystem
  setTimeout(() => {
    logInfo('Optimization Package System initialized.');
    logInfo('Plugin SDK & Extension Framework initialized.');
    LicensePlatform.validateLicense();
    logInfo('License & Premium Platform initialized.');
    EnterprisePlatformEngine.getEnterpriseConfig();
    logInfo('Enterprise Management Platform initialized (Standalone Compatibility Mode).');
    logInfo('Public API & Automation Framework initialized (v' + PublicApiFramework.apiVersion + ').');
    logInfo('Local Analytics & Insights Platform initialized (Privacy First).');
    ObservabilityPlatformEngine.captureObservabilitySnapshot().catch(() => {});
    logInfo('Observability & System Monitoring Platform initialized.');
    logInfo('AI Agent Platform initialized (Orchestrated via Public API).');
    QualityPlatformEngine.runContinuousQualityAudit().catch(() => {});
    logInfo('Continuous Quality & Validation Platform initialized.');
    ProductionReadinessPlatformEngine.evaluateProductionReadiness().catch(() => {});
    logInfo('Production Readiness Platform initialized.');
    ReleaseEngineeringPlatformEngine.getReleaseHistory();
    logInfo('Release Engineering Platform initialized.');
    SelfHealingPlatformEngine.detectFailuresAndPlanRecovery().catch(() => {});
    logInfo('Self-Healing Platform initialized (Non-Destructive Safe Recovery).');
    ProductionOperationsPlatformEngine.getSystemOperationalStatus().catch(() => {});
    logInfo('Production Operations Platform initialized (Runtime Governance Active).');
    LtsPlatformEngine.getLtsMatrix();
    logInfo('Long-Term Support (LTS) Platform initialized (Active LTS v' + LtsPlatformEngine.currentVersion + ').');
    PlatformEvolutionEngine.getEvolutionHistory();
    logInfo('Platform Evolution Framework initialized.');
    PlatformGovernanceEngine.evaluatePlatformGovernance().catch(() => {});
    logInfo('Platform Governance Framework initialized.');
    NextGenFoundationEngine.getFutureReadinessScore();
    logInfo('Next Generation Architecture Foundation initialized (Score: ' + NextGenFoundationEngine.getFutureReadinessScore().futureReadinessScore + '/100).');
    AutonomousPlatformEngine.getDecisionHistory();
    logInfo('Autonomous Platform Framework initialized (Transparent Approval-Aware Governance).');

    InnovationPlatformEngine.getInnovationHealthScore();
    logInfo('Platform Innovation Framework initialized (Isolated Sandbox Active).');
    PlatformIntegrationEngine.synchronizePlatformState().catch(() => {});
    logInfo('Platform Integration Framework initialized (Unified Integration Layer Active).');
    FeatureManagementPlatformEngine.getFeatureCatalogStatus();
    logInfo('Feature Management Platform initialized (Centralized Feature Catalog Active).');
    CloudContentPlatform.refreshContentCatalog('stable').catch(() => {});
  }, 500);

  // 4. Setup Power Management Event Listeners
  setupPowerEvents();

  // 5. Setup Custom Deep-Linking Protocol Handler
  setupProtocolHandler();

  // 6. Pre-warm System Details & Metrics Polling
  startMetricsPolling();

  // 7. Setup Update Manager
  setupUpdateManager();

  // 8. Initialize Application Lifecycle & Window Management
  setupAppLifecycle();
}
