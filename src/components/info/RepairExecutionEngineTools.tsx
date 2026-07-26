import { ArrowRight, CheckCircle, Clock, Pause, Play, ArrowsClockwise, Terminal, Lightning } from '@phosphor-icons/react';
import { memo, useEffect, useState } from 'react';

export interface ExecutionTask {
  id: string;
  title: string;
  category: string;
  step: 'Validate' | 'Backup' | 'Prepare' | 'Execute' | 'Verify' | 'Finalize' | 'Completed';
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Rolled Back';
  progress: number;
}

const INITIAL_QUEUE: ExecutionTask[] = [
  {
    id: 'task-1',
    title: 'HAGS (GPU Scheduling) Registry Etkinleştirme',
    category: 'Gaming',
    step: 'Completed',
    status: 'Completed',
    progress: 100
  },
  {
    id: 'task-2',
    title: 'Gereksiz Başlangıç Servisleri Zamanlama Temizliği',
    category: 'Performance',
    step: 'Execute',
    status: 'Running',
    progress: 65
  },
  {
    id: 'task-3',
    title: 'NVMe TRIM Otomatik Hücre Zamanlaması',
    category: 'Storage',
    step: 'Validate',
    status: 'Pending',
    progress: 0
  }
];

export const RepairExecutionEngineTools = memo(function RepairExecutionEngineTools() {
  const [tasks, setTasks] = useState<ExecutionTask[]>(INITIAL_QUEUE);
  const [isRunning, setIsRunning] = useState(true);
  const [logFeed, setLogFeed] = useState<string[]>([
    '[SYSTEM] İcra Motoru Başlatıldı. 3 Adet Onarım Görevi Sıraya Alındı.',
    '[VALIDATE] Donanım & Yönetici Yetkileri Doğrulandı.',
    '[BACKUP] Kayıt Defteri Yedekleme Snapshot Alındı: reg_backup_20260725.bak',
    '[EXECUTE] Task-1 (HAGS) Kayıt Defteri Değeri Değiştirildi (HwSchMode = 2).',
    '[VERIFY] Task-1 İcra Sonrası Doğrulama Başarılı.'
  ]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTasks(prev => prev.map(t => {
        if (t.status === 'Running') {
          const nextProg = t.progress + 15;
          if (nextProg >= 100) {
            setLogFeed(l => [...l, `[COMPLETED] ${t.title} Başarıyla Tamamlandı.`]);
            return { ...t, progress: 100, status: 'Completed', step: 'Finalize' };
          }
          return { ...t, progress: nextProg };
        } else if (t.status === 'Pending' && prev.some(p => p.status === 'Completed')) {
          setLogFeed(l => [...l, `[EXECUTE] ${t.title} İcrasına Başlandı...`]);
          return { ...t, status: 'Running', step: 'Execute', progress: 10 };
        }
        return t;
      }));
    }, 1200);

    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Lightning weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Onarım & İcra Motoru (Execution Engine)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Onaylanan sistem iyileştirmelerini atomik ve yedeklemeli olarak icra eder.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-2.5 rounded-xl font-bold text-[13.5px] transition-all flex items-center space-x-2 shadow-md ${
              isRunning 
                ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1]' 
                : 'bg-[#1a5efd] hover:bg-[#2d6bfe] text-white shadow-blue-500/25'
            }`}
          >
            {isRunning ? <Pause weight="duotone" size={15} /> : <Play weight="duotone" size={15} />}
            <span>{isRunning ? 'Duraklat' : 'İcrayı Devam Ettir'}</span>
          </button>
        </div>
      </div>

      {/* Execution Pipeline Steps Indicator */}
      <div className="bg-[#161619] border border-white/[0.08] p-5 rounded-2xl luper-card flex items-center justify-between text-[13px] font-medium font-mono text-[#86868b]">
        {['Doğrulama', 'Yedekleme', 'Hazırlık', 'İcra', 'Doğrulama', 'Tamamlama'].map((stepName, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              idx < 4 ? 'bg-[#1a5efd] text-white' : 'bg-white/[0.06] text-[#86868b]'
            }`}>
              {idx + 1}
            </span>
            <span className={idx < 4 ? 'text-white font-bold' : ''}>{stepName}</span>
            {idx < 5 && <ArrowRight weight="duotone" size={14} className="text-white/20 ml-2" />}
          </div>
        ))}
      </div>

      {/* Live Queue Tasks */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">İcra Sırasındaki Görevler</h3>
        {tasks.map(t => (
          <div key={t.id} className="bg-[#161619] border border-white/[0.08] p-5 rounded-2xl luper-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  t.status === 'Completed' ? 'bg-[#34c759]/10 text-[#34c759]' :
                  t.status === 'Running' ? 'bg-[#1a5efd]/10 text-[#1a5efd]' : 'bg-white/[0.06] text-[#86868b]'
                }`}>
                  {t.status === 'Completed' ? <CheckCircle weight="duotone" size={18} /> :
                   t.status === 'Running' ? <ArrowsClockwise weight="duotone" size={18} className="animate-spin" /> : <Clock weight="duotone" size={18} />}
                </div>
                <div>
                  <h4 className="text-white font-bold text-[14.5px]">{t.title}</h4>
                  <p className="text-[12px] text-[#86868b] font-mono mt-0.5">Aşama: <strong className="text-white">{t.step}</strong></p>
                </div>
              </div>

              <span className={`text-[12px] font-semibold px-3 py-1 rounded-lg font-mono ${
                t.status === 'Completed' ? 'bg-[#34c759]/10 text-[#34c759]' :
                t.status === 'Running' ? 'bg-[#1a5efd]/10 text-[#1a5efd]' : 'bg-white/[0.04] text-[#86868b]'
              }`}>
                {t.status}
              </span>
            </div>

            <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${t.status === 'Completed' ? 'bg-[#34c759]' : 'bg-[#1a5efd]'}`}
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Log Feed */}
      <div className="bg-[#121214] border border-white/[0.08] p-5 rounded-2xl space-y-2 font-mono text-[12.5px]">
        <div className="flex items-center space-x-2 text-[#86868b] pb-2 border-b border-white/[0.06]">
          <Terminal weight="duotone" size={15} className="text-[#1a5efd]" />
          <span className="font-bold text-white text-[13px]">Canlı İcra Günlüğü (Execution Terminal)</span>
        </div>
        <div className="space-y-1.5 pt-1 text-[#a1a1a6] max-h-40 overflow-y-auto">
          {logFeed.map((log, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="text-[#1a5efd] shrink-0">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
