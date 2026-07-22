import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, CheckCircle2 } from 'lucide-react';
import { getLatestChangelog } from '../services/FirebaseService';
import { ChangelogEntry } from '../types';

export function ChangelogModal() {
  const [changelog, setChangelog] = useState<ChangelogEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkChangelog = async () => {
      const latest = await getLatestChangelog();
      if (latest) {
        const seenVersion = localStorage.getItem('lastSeenChangelogVersion');
        if (seenVersion !== latest.version) {
          setChangelog(latest);
          setIsOpen(true);
        }
      }
    };
    checkChangelog();
  }, []);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, changelog]);

  const handleClose = () => {
    if (changelog) {
      localStorage.setItem('lastSeenChangelogVersion', changelog.version);
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && changelog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative w-full max-w-xl bg-[#1c1c1e] border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
          >
            <div className="p-6 pb-4 border-b border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <Gift size={20} className="text-brand-primary" />
                </div>
                <div>
                  <h2 id="modal-title" className="text-[18px] font-medium leading-tight text-white tracking-tight">Yeni Özellikler</h2>
                  <p className="text-text-muted text-[13px]">Versiyon {changelog.version}</p>
                </div>
              </div>
              <button aria-label="Kapat" onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-text-muted hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-[15px] font-normal text-white mb-4">{changelog.title}</h3>
              <ul className="space-y-4">
                {changelog.features.map((feature: string, idx: number) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + Math.min(idx * 0.05, 0.3) }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle2 size={16} className="text-brand-primary mt-0.5 shrink-0" />
                    <span className="text-text-muted text-[15px] font-normal leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-white/[0.02] border-t border-white/[0.04] flex justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-[15px] font-medium rounded-xl transition-all focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none"
              >
                Yenilikleri Keşfet
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
