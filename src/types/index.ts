export type ImpactLevel = 'none' | 'positive_low' | 'positive_medium' | 'positive_high' | 'negative_low' | 'negative_medium' | 'negative_high';

export interface ImpactDetail {
  level: ImpactLevel;
  description: string;
}

export interface OptimizationSetting {
  id: string;
  name: string;
  description: string;
  status: 'optimized' | 'default' | 'checking';
  impacts?: {
    performance: ImpactDetail;
    latency: ImpactDetail;
    input: ImpactDetail;
    power: ImpactDetail;
    heat: ImpactDetail;
  };
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  features: string[];
  date: string;
}

export interface CategoryOptimizationCount {
  [categoryId: string]: number;
}

export interface SystemStatus {
  cpuUsage: number | null;
  ramUsage: { used: number; total: number } | null;
  network: { latency: number } | null;
  firewall: boolean | null;
  storage: { drives: { name: string; type: string; free: number; total: number }[] } | null;
}

export enum IpcChannels {
  WINDOW_MINIMIZE = 'window-minimize',
  WINDOW_MAXIMIZE = 'window-maximize',
  WINDOW_CLOSE = 'window-close',
  EXECUTE_QUICK_ACTION = 'execute-quick-action',
  GET_OPTIMIZATION_COUNTS = 'get-optimization-counts',
  GET_CATEGORY_SETTINGS = 'get-category-settings',
  GET_SYSTEM_STATUS = 'get-system-status',
}
