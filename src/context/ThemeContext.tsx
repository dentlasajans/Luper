import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system' | 'high-contrast';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('luper_theme') as ThemeMode) || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem('luper_accent') || '#1a5efd';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('luper_theme', theme);

    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark', 'theme-high-contrast');
    } else if (theme === 'high-contrast') {
      root.classList.add('theme-high-contrast');
      root.classList.remove('theme-dark', 'theme-light');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light', 'theme-high-contrast');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--luper-brand', accentColor);
    localStorage.setItem('luper_accent', accentColor);
  }, [accentColor]);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
  const setAccentColor = (color: string) => setAccentColorState(color);

  const value = useMemo(() => ({ theme, setTheme, accentColor, setAccentColor }), [theme, accentColor]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
