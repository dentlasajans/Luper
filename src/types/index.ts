import { z } from 'zod';

export const ImpactLevelSchema = z.enum(['none', 'positive_low', 'positive_medium', 'positive_high', 'negative_low', 'negative_medium', 'negative_high']);
export type ImpactLevel = z.infer<typeof ImpactLevelSchema>;

export const ImpactDetailSchema = z.object({
  level: ImpactLevelSchema,
  description: z.string(),
});
export type ImpactDetail = z.infer<typeof ImpactDetailSchema>;

export const OptimizationSettingSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  uiType: z.enum(['toggle', 'select']).optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  applyCode: z.string().optional(),
  restoreCode: z.string().optional(),
  impacts: z.object({
    performance: ImpactDetailSchema,
    latency: ImpactDetailSchema,
    input: ImpactDetailSchema,
    power: ImpactDetailSchema,
    heat: ImpactDetailSchema,
  }).optional(),
});
export type OptimizationSetting = z.infer<typeof OptimizationSettingSchema>;

export const ChangelogEntrySchema = z.object({
  id: z.string(),
  version: z.string(),
  title: z.string(),
  features: z.array(z.string()),
  date: z.string(),
});
export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>;

export const CategoryOptimizationCountSchema = z.record(z.string(), z.number());
export type CategoryOptimizationCount = z.infer<typeof CategoryOptimizationCountSchema>;

export const SystemStatusSchema = z.object({
  cpuUsage: z.number().nullable().optional(),
  ramUsage: z.object({ used: z.number().optional(), total: z.number().optional() }).passthrough().nullable().optional(),
  network: z.object({ latency: z.number().optional() }).passthrough().nullable().optional(),
  firewall: z.boolean().nullable().optional(),
  storage: z.object({ drives: z.array(z.object({ name: z.string().optional(), type: z.string().optional(), free: z.number().optional(), total: z.number().optional() }).passthrough()).optional() }).passthrough().nullable().optional(),
}).passthrough();
export type SystemStatus = z.infer<typeof SystemStatusSchema>;

export enum IpcChannels {
  WINDOW_MINIMIZE = 'window-minimize',
  WINDOW_MAXIMIZE = 'window-maximize',
  WINDOW_CLOSE = 'window-close',
  EXECUTE_QUICK_ACTION = 'execute-quick-action',
  GET_OPTIMIZATION_COUNTS = 'get-optimization-counts',
  GET_CATEGORY_SETTINGS = 'get-category-settings',
  GET_SYSTEM_STATUS = 'get-system-status',
  APPLY_OPTIMIZATION = 'apply-optimization',
  RESTORE_OPTIMIZATION = 'restore-optimization',
  GET_STARTUP_ITEMS = 'get-startup-items',
  TOGGLE_STARTUP_ITEM = 'toggle-startup-item',
  GET_INSTALLED_APPS = 'get-installed-apps',
  UNINSTALL_APP = 'uninstall-app',
  GET_CLEANER_ITEMS = 'get-cleaner-items',
  EXECUTE_CLEANER = 'execute-cleaner',
  GET_ALL_INSTALLED_GAMES = 'get-all-installed-games',
  LAUNCH_GAME = 'launch-game',
  GET_APPLIED_OPTIMIZATIONS = 'get-applied-optimizations',
  SET_AUTO_START = 'set-auto-start',
  GET_SYSTEM_METRICS = 'get-system-metrics',
  SAVE_SETTINGS = 'save-settings',
  LOAD_SETTINGS = 'load-settings',
  GET_HARDWARE_SPECS = 'get-hardware-specs',
  CHECK_FOR_UPDATES = 'check-for-updates',
  APPLY_NVIDIA_PROFILE = 'apply-nvidia-profile',
  GET_FPS_STATS = 'get-fps-stats',
  GENERATE_DEMO_FPS_DATA = 'generate-demo-fps-data',
}

export const SystemMetricsDataSchema = z.object({
  cpuUsage: z.number().optional(),
  cpuName: z.string().nullable().optional(),
  freeMemoryMB: z.number().optional(),
  totalMemoryMB: z.number().optional(),
  usedMemoryMB: z.number().optional(),
  ramUsagePercent: z.number().optional(),
  osUptimeSeconds: z.number().optional(),
  osRelease: z.string().optional(),
  platform: z.string().optional(),
  arch: z.string().optional(),
}).passthrough();
export type SystemMetricsData = z.infer<typeof SystemMetricsDataSchema>;

export const SystemMetricsResponseSchema = z.object({
  success: z.boolean(),
  data: SystemMetricsDataSchema.nullable().optional(),
  error: z.object({ code: z.string(), message: z.string() }).passthrough().optional(),
}).passthrough();
export type SystemMetricsResponse = z.infer<typeof SystemMetricsResponseSchema>;

export const StartupItemSchema = z.object({
  name: z.string(),
  command: z.string().optional(),
  location: z.string().optional(),
  user: z.string().optional(),
  enabled: z.boolean(),
});
export type StartupItem = z.infer<typeof StartupItemSchema>;

export const InstalledAppSchema = z.object({
  id: z.string(),
  name: z.string(),
  publisher: z.string(),
  version: z.string(),
  type: z.enum(['desktop', 'uwp']),
  uninstallString: z.string(),
  packageFullName: z.string(),
});
export type InstalledApp = z.infer<typeof InstalledAppSchema>;

export const CleanerItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  sizeBytes: z.number(),
});
export type CleanerItem = z.infer<typeof CleanerItemSchema>;

export const GameSchema = z.object({
  appid: z.any().transform((v) => String(v)),
  name: z.string(),
  launcher: z.any().transform((v) => (['steam', 'epic', 'riot', 'ea', 'pc'].includes(String(v).toLowerCase()) ? String(v).toLowerCase() : 'pc')),
  sizeBytes: z.any(),
  installDir: z.any(),
  lastPlayed: z.any(),
  localCover: z.any(),
  localHeader: z.any(),
  headerImage: z.any(),
  coverImage: z.any(),
  heroImage: z.any(),
  isOptimized: z.any(),
}).passthrough();
export type Game = z.infer<typeof GameSchema>;

export const HardwareSpecsSchema = z.object({
  bios: z.object({ manufacturer: z.string().optional(), version: z.string().optional(), serial: z.string().optional(), tpm: z.string().optional(), secureBoot: z.string().optional() }).passthrough().optional(),
  cpu: z.object({ model: z.string(), cores: z.number().optional(), threads: z.number().optional(), speed: z.string().optional(), cache: z.string().optional() }).passthrough(),
  gpu: z.array(z.object({ name: z.string().optional(), memory: z.string().optional(), driver: z.string().optional() }).passthrough()).optional(),
  ram: z.object({ total: z.string().optional(), free: z.string().optional(), speed: z.string().optional(), formFactor: z.string().optional(), memoryType: z.string().optional() }).passthrough(),
  motherboard: z.object({ manufacturer: z.string().optional(), product: z.string().optional(), version: z.string().optional() }).passthrough().optional(),
  storage: z.array(z.object({ name: z.string().optional(), size: z.string().optional(), type: z.string().optional(), model: z.string().optional(), interface: z.string().optional() }).passthrough()).optional(),
}).passthrough();
export type HardwareSpecs = z.infer<typeof HardwareSpecsSchema>;
