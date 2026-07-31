import {
    Archive,
    ArrowCircleUp,
    ArrowElbowDownLeft,
    Cpu,
    GameController,
    House,
    ArrowCounterClockwise,
    MagnifyingGlass,
    Gear,
    ShieldCheck,
    Wrench,
    X,
    Lightning
} from '@/src/components/ui/Icons';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';

interface CommandItem {
  id: string;
  title: string;
  category: 'Sayfalar' | 'Optimizasyonlar' | 'Eylemler';
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteModalProps {
  setActiveTab: (tab: string) => void;
}

export function CommandPaletteModal({ setActiveTab }: CommandPaletteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Toggle on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const commands: CommandItem[] = useMemo(() => [
    { id: 'nav_dash', title: 'Anasayfa', category: 'Sayfalar', icon: House, shortcut: '↵', action: () => setActiveTab('dashboard') },
    { id: 'nav_opt', title: 'Optimizasyon Kategorileri', category: 'Sayfalar', icon: Lightning, shortcut: '↵', action: () => setActiveTab('optimization') },
    { id: 'nav_tools', title: 'Sistem Araçları', category: 'Sayfalar', icon: Wrench, shortcut: '↵', action: () => setActiveTab('tools') },
    { id: 'nav_games', title: 'Oyun Kütüphanesi', category: 'Sayfalar', icon: GameController, shortcut: '↵', action: () => setActiveTab('games') },
    { id: 'nav_settings', title: 'Ayarlar', category: 'Sayfalar', icon: Gear, shortcut: '↵', action: () => setActiveTab('settings') },
    { id: 'nav_update', title: 'Güncelleme Denetimi', category: 'Sayfalar', icon: ArrowCircleUp, shortcut: '↵', action: () => setActiveTab('update') },
    { id: 'nav_backup', title: 'Yedekleme & Geri Yükleme', category: 'Sayfalar', icon: Archive, shortcut: '↵', action: () => setActiveTab('backup') },
    
    // Direct Tweaks
    { id: 'opt_net', title: 'Ağ & İnternet Optimizasyonu', category: 'Optimizasyonlar', icon: Lightning, action: () => setActiveTab('network') },
    { id: 'opt_cpu', title: 'CPU & İşlemci Önceliği', category: 'Optimizasyonlar', icon: Cpu, action: () => setActiveTab('cpu') },
    { id: 'opt_gpu', title: 'GPU & Ekran Kartı Zamanlaması', category: 'Optimizasyonlar', icon: Lightning, action: () => setActiveTab('gpu') },
    { id: 'opt_privacy', title: 'Gizlilik & Telemetri İyileştirme', category: 'Optimizasyonlar', icon: ShieldCheck, action: () => setActiveTab('privacy') },

    // Quick Actions
    { id: 'act_reset', title: 'Varsayılan Ayarlara Dön', category: 'Eylemler', icon: ArrowCounterClockwise, action: () => setActiveTab('settings') }
  ], [setActiveTab]);

  const fuse = useMemo(() => new Fuse(commands, {
    keys: ['title', 'category'],
    threshold: 0.4,
  }), [commands]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    return fuse.search(query).map((result) => result.item);
  }, [commands, query, fuse]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = useCallback((cmd: CommandItem) => {
    cmd.action();
    setIsOpen(false);
    setQuery('');
  }, []);

  const handleKeyDownModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={handleKeyDownModal}
            className="relative w-full max-w-xl bg-[#1a1a1d] border border-luper-subtle rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-white/[0.08] flex items-center space-x-3">
              <MagnifyingGlass size={18} weight="duotone" className="text-luper-primary shrink-0" />
              <input
                aria-label="Komut Ara"
                type="text"
                autoFocus
                placeholder="LUPER Komut veya Sayfa Ara... (Örn: FPS, Ayarlar)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-[15px] text-white placeholder-[#86868b] focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#86868b] hover:text-white transition-colors shrink-0"
              >
                <X size={16} weight="duotone" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-[#86868b] text-[14px]">
                  Uygun komut bulunamadı.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = cmd.icon;

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                        isSelected 
                          ? 'bg-luper-primary text-white shadow-md' 
                          : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Icon size={18} weight="duotone" className={`shrink-0 ${isSelected ? 'text-white' : 'text-luper-primary'}`} />
                        <span className="text-[14px] font-medium truncate text-white">{cmd.title}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.05] text-[#86868b]'}`}>
                          {cmd.category}
                        </span>
                        {isSelected && <ArrowElbowDownLeft size={14} weight="duotone" className="text-white" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Legend */}
            <div className="p-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#86868b] px-4">
              <div className="flex items-center space-x-3">
                <span>↑↓ Gezin</span>
                <span>↵ Seç</span>
                <span>ESC Kapat</span>
              </div>
              <span className="font-mono text-luper-primary">LUPER Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
