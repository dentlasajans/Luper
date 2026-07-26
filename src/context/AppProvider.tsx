import { ReactNode } from 'react';
import { OptimizationProvider } from './OptimizationContext';
import { SettingsProvider } from './SettingsContext';
import { SystemStatusProvider } from './SystemStatusContext';
import { ThemeProvider } from './ThemeContext';
import { UIProvider } from './UIContext';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <SystemStatusProvider>
          <OptimizationProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </OptimizationProvider>
        </SystemStatusProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
