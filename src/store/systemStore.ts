import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getHardwareSpecs, getSystemMetrics } from '../services/SystemEngine';
import { HardwareSpecs, SystemMetricsResponse } from '../types';

export interface UserSettings {
  lowQualityMode: boolean;
  autoStart: boolean;
  minimizeToTray: boolean;
  startMinimized: boolean;
  autoRamClean: boolean;
  autoUpdateCheck: boolean;
}

export interface SystemState {
  specs: HardwareSpecs | null;
  metrics: SystemMetricsResponse | null;
  settings: UserSettings;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  lowQualityMode: false,
  autoStart: false,
  minimizeToTray: true,
  startMinimized: false,
  autoRamClean: false,
  autoUpdateCheck: true,
};

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      specs: null,
      metrics: null,
      settings: DEFAULT_SETTINGS,
      loading: true,
      refreshing: false,
      error: null,

      updateSettings: (newSettings: Partial<UserSettings>) => {
        set((state: SystemState) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      loadData: async () => {
        set((state: SystemState) => ({ refreshing: true, loading: state.specs === null, error: null }));
        try {
          const [hSpecs, sMetrics] = await Promise.all([
            getHardwareSpecs(),
            getSystemMetrics()
          ]);
          set({ 
            specs: hSpecs, 
            metrics: sMetrics.success ? sMetrics : null,
            loading: false,
            refreshing: false
          });
        } catch (e) {
          const errorMessage = e instanceof Error ? (e as Error).message : 'Sistem özellikleri yüklenemedi';
          set({ 
            error: errorMessage,
            loading: false,
            refreshing: false
          });
        }
      }
    }),
    {
      name: 'luper-system-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: SystemState) => ({
        specs: state.specs,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state?: SystemState, error?) => {
        if (error) {
          console.error('SystemStore rehydration error:', error);
        } else if (state) {
          if (state.specs) {
            state.loading = false;
          }
        }
      },
    }
  )
);

