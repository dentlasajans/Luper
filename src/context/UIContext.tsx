import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface UIContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  isChangelogOpen: boolean;
  setIsChangelogOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    isChangelogOpen,
    setIsChangelogOpen
  }), [activeTab, activeCategory, isChangelogOpen]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
