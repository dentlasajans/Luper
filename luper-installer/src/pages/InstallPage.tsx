import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface InstallPageProps {
  onNext: () => void;
}

const InstallPage: React.FC<InstallPageProps> = ({ onNext }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Kurulum başlatılıyor...');
  const [logs, setLogs] = useState<string[]>(['[LUPER INSTALLER] Başlatıldı.']);
  const [showLogs, setShowLogs] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showLogs]);

  useEffect(() => {
    let active = true;

    if (window.electronAPI) {
      window.electronAPI.on('install-progress', (data: { step: string, progress: number }) => {
        if (!active) return;
        setCurrentTask(data.step);
        setProgress(data.progress);
        setLogs(prev => [...prev, `[INSTALL] ${data.step}`]);
        
        if (data.progress >= 100) {
          setTimeout(() => {
            if (active) onNext();
          }, 1000);
        }
      });
      
      window.electronAPI.invoke('install-app').catch(err => {
        setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
      });
    }

    return () => {
      active = false;
    };
  }, [onNext]);

  return (
    <div className="flex-1 flex flex-col pt-12 pb-6 px-4">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Kurulum Yapılıyor</h1>
      <p className="text-white/50 mb-12">Lütfen kurulum tamamlanana kadar bekleyin.</p>
      
      <div className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto">
        <div className="mb-4 flex justify-between items-end">
          <span className="text-white/80 font-medium">{currentTask}</span>
          <span className="text-2xl font-bold text-luper-sapphire-light">{progress}%</span>
        </div>
        
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-luper-sapphire-light to-luper-sapphire"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          />
        </div>

        <div className="mt-12">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white/90 transition-colors"
          >
            <Terminal size={14} />
            {showLogs ? 'Logları Gizle' : 'Logları Göster'}
          </button>
          
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: showLogs ? 160 : 0, opacity: showLogs ? 1 : 0 }}
            className="overflow-hidden mt-3"
          >
            <div className="h-40 bg-black/50 border border-white/5 rounded-lg p-3 font-mono text-[10px] text-white/60 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="mb-1 leading-relaxed">{log}</div>
              ))}
              <div ref={logEndRef} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InstallPage;
