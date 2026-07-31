import React from 'react';

export const ROUTE_IMPORTS: Record<string, () => Promise<any>> = {
  'optimization': () => import('../components/Optimization').then((m) => ({ default: m.Optimization })),
  'tools': () => import('../components/categories/ToolsCategory'),
  'settings': () => import('../components/info/AdvancedSettingsCenterTools').then((m) => ({ default: m.AdvancedSettingsCenterTools })),
  'advanced-settings': () => import('../components/info/AdvancedSettingsCenterTools').then((m) => ({ default: m.AdvancedSettingsCenterTools })),
  'startup': () => import('../components/tools/StartupTools').then((m) => ({ default: m.StartupTools })),
  'debloat': () => import('../components/tools/DebloatTools').then((m) => ({ default: m.DebloatTools })),
  'cleaner': () => import('../components/info/MaintenanceCenterTools').then((m) => ({ default: m.MaintenanceCenterTools })),
  'maintenance-center': () => import('../components/info/MaintenanceCenterTools').then((m) => ({ default: m.MaintenanceCenterTools })),
  'games': () => import('../components/tools/GamesTools').then((m) => ({ default: m.GamesTools })),
  'health-scanner': () => import('../components/info/DiagnosticsRecoveryCenterTools').then((m) => ({ default: m.DiagnosticsRecoveryCenterTools })),
  'diagnostics-recovery': () => import('../components/info/DiagnosticsRecoveryCenterTools').then((m) => ({ default: m.DiagnosticsRecoveryCenterTools })),
  'health-recommendations': () => import('../components/info/HealthRecommendationsTools').then((m) => ({ default: m.HealthRecommendationsTools })),
  'repair-plan': () => import('../components/info/RepairExecutionPreviewTools').then((m) => ({ default: m.RepairExecutionPreviewTools })),
  'repair-execution': () => import('../components/info/RepairExecutionEngineTools').then((m) => ({ default: m.RepairExecutionEngineTools })),
  'snapshot-center': () => import('../components/info/SnapshotCenterTools').then((m) => ({ default: m.SnapshotCenterTools })),
  'cloud-sync': () => import('../components/info/CloudBackupSyncTools').then((m) => ({ default: m.CloudBackupSyncTools })),
  'backup': () => import('../components/info/CloudBackupSyncTools').then((m) => ({ default: m.CloudBackupSyncTools })),
  'hardware-explorer': () => import('../components/info/HardwareExplorerTools').then((m) => ({ default: m.HardwareExplorerTools })),
  'optimization-simulator': () => import('../components/info/OptimizationSimulatorTools').then((m) => ({ default: m.OptimizationSimulatorTools })),
  'optimization-library': () => import('../components/info/OptimizationLibraryTools').then((m) => ({ default: m.OptimizationLibraryTools })),
  'optimization-packs': () => import('../components/info/OptimizationPacksTools').then((m) => ({ default: m.OptimizationPacksTools })),
  'automation-engine': () => import('../components/info/VisualWorkflowDesignerTools').then((m) => ({ default: m.VisualWorkflowDesignerTools })),
  'workflow-designer': () => import('../components/info/VisualWorkflowDesignerTools').then((m) => ({ default: m.VisualWorkflowDesignerTools })),
  'extension-sdk': () => import('../components/info/ExtensionSdkTools').then((m) => ({ default: m.ExtensionSdkTools })),
  'extension-manager': () => import('../components/info/ExtensionManagerTools').then((m) => ({ default: m.ExtensionManagerTools })),
  'marketplace': () => import('../components/info/MarketplaceTools').then((m) => ({ default: m.MarketplaceTools })),
  'update': () => import('../components/info/AdvancedUpdateCenterTools').then((m) => ({ default: m.AdvancedUpdateCenterTools })),
  'advanced-update': () => import('../components/info/AdvancedUpdateCenterTools').then((m) => ({ default: m.AdvancedUpdateCenterTools })),
  'developer-mode': () => import('../components/info/DeveloperModeTools').then((m) => ({ default: m.DeveloperModeTools })),
  'ui-polish': () => import('../components/info/FinalUiUxPolishTools').then((m) => ({ default: m.FinalUiUxPolishTools })),
  'release-notes': () => import('../components/info/StableReleaseTools').then((m) => ({ default: m.StableReleaseTools })),
  'release': () => import('../components/info/StableReleaseTools').then((m) => ({ default: m.StableReleaseTools })),
  'my-system': () => import('../components/categories/MySystemCategory'),
  'system-insights': () => import('../components/info/SystemInsightsActionCenterTools').then((m) => ({ default: m.SystemInsightsActionCenterTools })),
  'advanced-latency': () => import('../components/tools/AdvancedLatencyTools').then((m) => ({ default: m.AdvancedLatencyTools })),
};

export const COMPONENT_MAP = Object.fromEntries(
  Object.entries(ROUTE_IMPORTS).map(([key, importFn]) => [key, React.lazy(importFn)])
) as Record<string, React.LazyExoticComponent<any>>;

export const Dashboard = React.lazy(() => import(/* webpackChunkName: "dashboard" */ '../components/Dashboard').then((m) => ({ default: m.Dashboard })));
export const CategoryOptimization = React.lazy(() => import('../components/CategoryOptimization').then((m) => ({ default: m.CategoryOptimization })));
export const ChangelogModal = React.lazy(() => import('../components/ChangelogModal').then((module) => ({ default: module.ChangelogModal })));

export const OPTIMIZATION_SUBCATEGORIES = [
  'network', 'cpu', 'storage', 'mouse', 'privacy', 
  'gpu', 'power', 'security', 'personalization', 
  'keyboard', 'audio', 'browser', 'telemetry'
];
