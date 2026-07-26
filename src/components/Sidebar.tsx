import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
    Archive,
    ArrowCircleUp,
    CaretDown,
    Cpu,
    FileText,
    GameController,
    GithubLogo,
    Globe,
    House,
    SpinnerGap,
    SignOut,
    Gear,
    Sparkle,
    TwitterLogo,
    Wrench,
    Lightning
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import React, { useEffect, useMemo, useState } from 'react';
import { auth, loginWithGoogle, logoutGoogle } from '../services/FirebaseService';
import { AppLogo } from './Icons';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

type SubItem = {
  id: string;
  label: string;
};

type NavItem = {
  id: string;
  icon: React.ElementType;
  label: string;
  group: string;
  badge?: string;
  subItems?: SubItem[];
};

const navItems: NavItem[] = [
  // Group 1: Ana Menü
  { id: 'dashboard', icon: House, label: 'Anasayfa', group: 'Ana Menü' },
  { 
    id: 'optimization', 
    icon: Lightning, 
    label: 'Optimizasyon',
    group: 'Ana Menü',
    subItems: [
      { id: 'network', label: 'Ağ & İnternet' },
      { id: 'cpu', label: 'CPU' },
      { id: 'storage', label: 'Depolama' },
      { id: 'mouse', label: 'Fare' },
      { id: 'privacy', label: 'Gizlilik' },
      { id: 'gpu', label: 'GPU' },
      { id: 'power', label: 'Güç' },
      { id: 'security', label: 'Güvenlik' },
      { id: 'personalization', label: 'Kişiselleştirme' },
      { id: 'keyboard', label: 'Klavye' },
      { id: 'audio', label: 'Ses' },
      { id: 'browser', label: 'Tarayıcı' },
      { id: 'telemetry', label: 'Telemetri' }
    ]
  },
  { 
    id: 'tools', 
    icon: Wrench, 
    label: 'Araçlar',
    group: 'Ana Menü',
    subItems: [
      { id: 'startup', label: 'Başlangıç' },
      { id: 'cleaner', label: 'Temizlik' },
      { id: 'debloat', label: 'Debloat' }
    ]
  },
  { id: 'games', icon: GameController, label: 'Oyunlar', group: 'Ana Menü' },
  { id: 'my-system', icon: Cpu, label: 'Sistemim', group: 'Ana Menü' },


  // Group 3: Sistem & Yönetim
  { id: 'update', icon: ArrowCircleUp, label: 'Güncelleme', group: 'Sistem & Yönetim' },
  { id: 'backup', icon: Archive, label: 'Yedekleme', group: 'Sistem & Yönetim' },
  { id: 'release-notes', icon: FileText, label: 'Sürüm Notları', group: 'Sistem & Yönetim' },
  { id: 'settings', icon: Gear, label: 'Ayarlar', group: 'Sistem & Yönetim' }
];

navItems.forEach(item => {
  if (item.subItems) {
    item.subItems.sort((a, b) => a.label.localeCompare(b.label));
  }
});

const SidebarSubItem = React.memo(({ sub, isSubActive, onClick }: { sub: SubItem, isSubActive: boolean, onClick: (id: string) => void }) => {
  return (
    <button
      onClick={() => onClick(sub.id)}
      className={`w-full flex items-center px-3 py-2 rounded-xl transition-all duration-200 relative group focus-visible:ring-1 focus-visible:ring-[#1a5efd] focus-visible:outline-none ${
        isSubActive ? 'text-white font-medium' : 'text-[#86868b] hover:text-white'
      }`}
    >
      {isSubActive && (
        <motion.div
          layoutId="sidebar-active-sub"
          className="absolute inset-0 bg-[#1a5efd]/15 backdrop-blur-md rounded-xl border border-[#1a5efd]/30"
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}
      {!isSubActive && (
        <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-200" />
      )}
      <div className={`w-1.5 h-1.5 rounded-full mr-3 relative z-10 transition-colors duration-200 ${isSubActive ? 'bg-[#1a5efd] shadow-[0_0_8px_rgba(26,94,253,0.8)]' : 'bg-white/20 group-hover:bg-white/50'}`} />
      <span className="text-[13.5px] relative z-10">{sub.label}</span>
    </button>
  );
});

const SidebarNavItem = React.memo(({
  item,
  isActive,
  hasSubItems,
  expandedCategory,
  activeTab,
  onItemClick,
  onSubItemClick
}: {
  item: NavItem,
  isActive: boolean,
  hasSubItems: boolean,
  expandedCategory: string | null,
  activeTab: string,
  onItemClick: (item: NavItem, hasSubItems: boolean) => void,
  onSubItemClick: (id: string) => void
}) => {
  return (
    <div className="w-full">
      <button
        aria-label={item.label}
        onClick={() => onItemClick(item, hasSubItems)}
        className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group focus-visible:ring-2 focus-visible:ring-[#1a5efd] focus-visible:outline-none ${
          isActive ? 'text-white' : 'text-[#86868b] hover:text-white'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 bg-white/[0.08] backdrop-blur-md rounded-xl border border-white/[0.12] shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        )}
        {!isActive && (
          <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-200" />
        )}
        
        <item.icon size={18} weight="duotone" className={`relative z-10 transition-all duration-300 mr-3.5 ${isActive ? 'text-[#1a5efd]' : 'text-[#86868b] group-hover:text-white group-hover:scale-105'}`} />
        
        <span className="text-[14px] font-medium relative z-10 flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="text-[10px] bg-[#1a5efd]/20 text-[#64d2ff] px-2 py-0.5 rounded-full border border-[#1a5efd]/30 font-bold uppercase tracking-wider relative z-10 mr-1">
            {item.badge}
          </span>
        )}
        {hasSubItems && (
          <CaretDown
            size={14}
            weight="duotone"
            className={`relative z-10 transition-transform duration-200 ${expandedCategory === item.id ? 'rotate-180 text-white' : 'text-[#86868b]'}`}
          />
        )}
      </button>

      {hasSubItems && (
        <motion.div
          initial={false}
          animate={{ height: expandedCategory === item.id ? 'auto' : 0, opacity: expandedCategory === item.id ? 1 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(0)', willChange: 'height, opacity' }}
          className="overflow-hidden"
        >
          <div className="pl-9 pr-1 py-1 space-y-1 mt-1">
            {(item.subItems ?? []).map(sub => (
              <SidebarSubItem 
                key={sub.id} 
                sub={sub} 
                isSubActive={activeTab === sub.id} 
                onClick={onSubItemClick}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
});

export const Sidebar = React.memo(function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = React.useCallback(async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error("Google auth error:", e);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleLogout = React.useCallback(async () => {
    try {
      await logoutGoogle();
    } catch (e) {
      console.error("Logout error:", e);
    }
  }, []);

  const handleItemClick = React.useCallback((item: NavItem, hasSubItems: boolean) => {
    setActiveTab(item.id);
    if (hasSubItems) {
      setExpandedCategory(prev => prev === item.id ? null : item.id);
    } else {
      setExpandedCategory(null);
    }
  }, [setActiveTab]);

  const handleSubItemClick = React.useCallback((id: string) => {
    setActiveTab(id);
  }, [setActiveTab]);

  useEffect(() => {
    const parentItem = navItems.find(item => 
      item.subItems?.some(sub => sub.id === activeTab)
    );
    if (parentItem) {
      setExpandedCategory(parentItem.id);
    }
  }, [activeTab]);

  const groupedNav = useMemo(() => {
    const groups: { [key: string]: NavItem[] } = {};
    navItems.forEach(item => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, []);

  return (
    <div 
      className="shrink-0 w-[260px] h-[calc(100vh-24px)] my-3 ml-3 bg-[#161619]/90 border border-white/[0.08] rounded-[20px] shadow-2xl flex flex-col relative z-20 pt-5 pb-4 px-3 overflow-hidden backdrop-blur-2xl luper-glass"
    >
      {/* Header & Logo */}
      <div className="flex items-center justify-center py-2 mb-4 w-full select-none drag-region">
        <div className="flex items-center shrink-0">
          <AppLogo className="h-12 w-auto max-w-[180px] drop-shadow-md" />
        </div>
      </div>

      {/* Nav List */}
      <nav aria-label="Main Navigation" className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden pr-1" style={{ WebkitAppRegion: 'no-drag' }}>
        {Object.entries(groupedNav).map(([groupName, items]) => (
          <div key={groupName} className="space-y-1">
            <h4 className="text-[12px] font-bold text-[#86868b] uppercase tracking-wider px-3 mb-2.5 mt-2">
              {groupName}
            </h4>
            {items.map((item) => (
              <SidebarNavItem 
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                hasSubItems={!!(item.subItems && item.subItems.length > 0)}
                expandedCategory={expandedCategory}
                activeTab={activeTab}
                onItemClick={handleItemClick}
                onSubItemClick={handleSubItemClick}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Active User Footer Section */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]" style={{ WebkitAppRegion: 'no-drag' }}>
        {!currentUser ? (
          <button 
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all group shadow-sm"
          >
            {authLoading ? (
              <SpinnerGap size={16} weight="duotone" className="animate-spin text-[#1a5efd]" />
            ) : (
              <Sparkle size={16} weight="duotone" className="text-[#1a5efd]" />
            )}
            <span className="text-[13px] font-medium text-white group-hover:text-[#64d2ff] transition-colors">
              {authLoading ? 'Giriş Yapılıyor...' : 'Google ile Giriş'}
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <div className="flex items-center space-x-2.5 min-w-0">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'Kullanıcı'} 
                  className="w-8 h-8 rounded-full border border-[#1a5efd]/40 shrink-0 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1a5efd] flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-[#f5f5f7] text-[13px] font-medium truncate">
                  {currentUser.displayName || 'Kullanıcı'}
                </h4>
                <p className="text-[#64d2ff] text-[11px] font-semibold">Premium</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 text-[#86868b] flex items-center justify-center transition-colors shrink-0"
              title="Çıkış Yap"
            >
              <SignOut size={16} weight="duotone" className="group-hover:scale-105 transition-all duration-300" />
            </button>
          </div>
        )}
      </div>

      {/* Footer / Version & Links */}
      <div className="pt-3 px-1 flex items-center justify-between" style={{ WebkitAppRegion: 'no-drag' }}>
        <span className="text-[11px] font-mono text-[#86868b] font-medium">v1.1.0 Stable</span>
        <div className="flex items-center space-x-2 text-[#86868b]">
          <a href="#" aria-label="GitHub" className="hover:text-white hover:scale-105 transition-all duration-300"><GithubLogo size={14} weight="duotone" /></a>
          <a href="#" aria-label="Twitter" className="hover:text-white hover:scale-105 transition-all duration-300"><TwitterLogo size={14} weight="duotone" /></a>
          <a href="#" aria-label="Web" className="hover:text-white hover:scale-105 transition-all duration-300"><Globe size={14} weight="duotone" /></a>
        </div>
      </div>
    </div>
  );
});
