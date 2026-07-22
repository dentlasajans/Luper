import React, { useState, useEffect } from 'react';
import { Home, Zap, Wrench, Gamepad2, Gauge, FileText, ArrowUpCircle, Settings, Github, Twitter, Globe, Cpu, User, ChevronDown, Archive } from 'lucide-react';
import { motion } from 'motion/react';
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
  subItems?: SubItem[];
};

const navItems: NavItem[] = [
  { id: 'dashboard', icon: Home, label: 'Anasayfa' },
  { 
    id: 'optimization', 
    icon: Zap, 
    label: 'Optimizasyon',
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
    subItems: [
      { id: 'startup', label: 'Başlangıç' },
      { id: 'cleaner', label: 'Temizlik' },
      { id: 'debloat', label: 'Debloat' }
    ]
  },
  { id: 'games', icon: Gamepad2, label: 'Oyunlar' },
  { id: 'benchmark', icon: Gauge, label: 'Benchmark' },
  { id: 'system-info', icon: Cpu, label: 'Sistem Bilgisi' },
  { id: 'release-notes', icon: FileText, label: 'Sürüm Notları' },
  { id: 'update', icon: ArrowUpCircle, label: 'Güncelleme' },
  { id: 'backup', icon: Archive, label: 'Yedekleme' },
  { id: 'settings', icon: Settings, label: 'Ayarlar' },
];


const SidebarSubItem = React.memo(({ sub, isSubActive, onClick }: { sub: SubItem, isSubActive: boolean, onClick: (id: string) => void }) => {
  return (
    <button
      onClick={() => onClick(sub.id)}
      className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 relative group focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none  ${isSubActive ? '' : ''}   hover:scale-[1.02] active:scale-[0.98] ${
        isSubActive ? 'text-white' : 'text-text-muted hover:text-white'
      }`}
    >
      <SelectionSpinEffect isActive={isSubActive} rx={12} />
      {isSubActive && (
        <motion.div
          layoutId="sidebar-active-sub"
          className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/[0.04] "
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        />
      )}
      {!isSubActive && (
        <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-xl border border-white/[0.04] transition-all duration-300" />
      )}
      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mr-3 relative z-10 group-hover:bg-white/40 transition-colors duration-300" />
      <span className="text-[15px] relative z-10">{sub.label}</span>
    </button>
  );
});

const SidebarNavItem = React.memo(({
  item,
  isActive,
  isComingSoon,
  hasSubItems,
  expandedCategory,
  activeTab,
  onItemClick,
  onSubItemClick
}: {
  item: NavItem,
  isActive: boolean,
  isComingSoon: boolean,
  hasSubItems: boolean,
  expandedCategory: string | null,
  activeTab: string,
  onItemClick: (item: NavItem, hasSubItems: boolean) => void,
  onSubItemClick: (id: string) => void
}) => {
  return (
    <div className="w-full">
      <button
        disabled={isComingSoon}
        onClick={() => onItemClick(item, hasSubItems)}
        className={`w-full flex items-center px-4 py-3 rounded-[1.25rem] transition-all duration-300 relative group focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none  ${isActive ? '' : ''}   hover:scale-[1.02] active:scale-[0.98] ${
          isActive ? 'text-white' : 'text-text-muted hover:text-white'
        } ${isComingSoon ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:text-text-muted' : ''}`}
      >
        <SelectionSpinEffect isActive={isActive} rx={20} />
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[1.25rem] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.2)] "
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          />
        )}
        {!isActive && (
          <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-[1.25rem] border border-white/[0.04] transition-all duration-300" />
        )}
        <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} className={`mr-4 relative z-10 transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-text-muted group-hover:text-[#f5f5f7]'} group-hover:translate-y-[-1px] group-hover:scale-[1.08]`} />
        <span className="text-[15px] font-normal relative z-10 flex-1 text-left">{item.label}</span>
        {isComingSoon && (
          <span className="text-[10px] bg-white/[0.05] text-text-muted px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider font-semibold relative z-10 whitespace-nowrap ml-2">Yakında</span>
        )}
        {!isComingSoon && hasSubItems && (
          <ChevronDown
            size={14}
            className={`relative z-10 transition-transform duration-300 ${expandedCategory === item.id ? 'rotate-180' : ''} ${isActive ? 'text-white' : 'text-text-muted'}`}
          />
        )}
      </button>

      {hasSubItems && (
        <motion.div
          initial={false}
          animate={{ height: expandedCategory === item.id ? 'auto' : 0, opacity: expandedCategory === item.id ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pl-11 pr-2 py-1 space-y-1 mt-1">
            {[...item.subItems!].sort((a, b) => a.label.localeCompare(b.label)).map(sub => (
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

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
    // If activeTab is a sub-item of any category, ensure it's expanded
    const parentItem = navItems.find(item => 
      item.subItems?.some(sub => sub.id === activeTab)
    );
    if (parentItem) {
      setExpandedCategory(parentItem.id);
    }
  }, [activeTab]);

  return (
    <div className="w-64 shrink-0 h-full bg-transparent flex flex-col relative z-20 pt-12 pb-6 px-4">
      {/* Logo */}
      <div className="flex items-center px-2 mb-6 w-full text-[#f5f5f7] select-none drag-region group hover:brightness-110 transition-all cursor-pointer">
        <AppLogo className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500 ease-out drop-shadow-md" />
      </div>

      {/* Nav */}
      <nav aria-label="Main Navigation" className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 90%, transparent 100%)', WebkitAppRegion: 'no-drag' } as any}>
        {navItems.map((item, index) => {
          const isTopDivider = index === 2;
          const isMidDivider = index === 6;
          const isActive = activeTab === item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isComingSoon = false;

          return (
            <React.Fragment key={item.id}>
              {(isTopDivider || isMidDivider) && (
                <div className="h-px bg-white/[0.04] mx-4 my-2" />
              )}
              <SidebarNavItem 
                item={item}
                isActive={isActive}
                isComingSoon={isComingSoon}
                hasSubItems={!!hasSubItems}
                expandedCategory={expandedCategory}
                activeTab={activeTab}
                onItemClick={handleItemClick}
                onSubItemClick={handleSubItemClick}
              />
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-6 mb-4 px-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {!isLoggedIn ? (
          <button 
            disabled
            onClick={() => setIsLoggedIn(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/[0.03] border border-white/[0.04] rounded-2xl transition-all duration-300 group opacity-50 cursor-not-allowed "
          >
            <User size={16} className="text-text-muted transition-colors" />
            <span className="text-[15px] font-normal text-text-muted">Google ile giriş yap</span>
          </button>
        ) : (
          <div className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all duration-300 group" onClick={() => setIsLoggedIn(false)}>
            <div className="w-10 h-10 rounded-full ring-2 ring-brand-primary/30 ring-offset-2 ring-offset-[#121214] bg-gradient-to-br from-brand-primary to-[#407eff] flex items-center justify-center shadow-lg overflow-hidden border border-white/10 shrink-0">
              <span className="text-white font-medium text-[15px]">HK</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[#f5f5f7] text-[15px] font-normal truncate">Himmet Muhammed</h4>
              <p className="text-brand-primary text-[11px] font-medium tracking-wide mt-0.5">Premium Plan</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Version & Socials */}
      <div className="pt-4 px-2 flex items-center justify-between border-t border-white/[0.04]" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <div className="text-[11px] font-mono text-text-muted tracking-widest opacity-60">v0.0.1</div>
        <div className="flex items-center space-x-3 text-text-muted">
          <a href="#" className="hover:text-white transition-colors duration-300"><Github size={15} strokeWidth={1.5} /></a>
          <a href="#" className="hover:text-white transition-colors duration-300"><Twitter size={15} strokeWidth={1.5} /></a>
          <a href="#" className="hover:text-white transition-colors duration-300"><Globe size={15} strokeWidth={1.5} /></a>
        </div>
      </div>
    </div>
  );
}

function SelectionSpinEffect({ isActive, rx }: { isActive: boolean, rx: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 900);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  if (!show) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
      <motion.rect
        x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx={rx}
        fill="none"
        stroke="#1a5efd"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 0.3, 0.3, 0.01], 
          pathOffset: [0, 0, 0.7, 1],
          opacity: [0, 1, 1, 0] 
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
    </svg>
  );
}