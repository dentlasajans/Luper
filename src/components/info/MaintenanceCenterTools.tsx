import { Trash, Wrench } from '@phosphor-icons/react';
import { memo, useMemo, useState } from 'react';

export interface MaintenanceTask {
  id: string;
  name: string;
  category: 'Cache' | 'System' | 'Graphics' | 'Network';
  estimatedSpaceMB: number;
  description: string;
  risk: 'Safe' | 'Low' | 'Medium';
  selected: boolean;
}

export const MaintenanceCenterTools = memo(function MaintenanceCenterTools() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [activeMode, setActiveMode] = useState<'Quick' | 'Recommended' | 'Deep'>('Recommended');
  const [isCleaning, setIsCleaning] = useState(false);

  const totalSelectedSpace = useMemo(() => {
    return tasks.filter(t => t.selected).reduce((acc, curr) => acc + curr.estimatedSpaceMB, 0);
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleRunMaintenance = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
    }, 1500);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Wrench weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Sistem Bakım & Koruma Merkezi (Maintenance Center)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Önleyici sistem bakımı, önbellek temizliği ve periyodik disk kazanım yönetimi.</p>
        </div>

        <button
          onClick={handleRunMaintenance}
          disabled={isCleaning}
          className="px-5 py-2.5 bg-[#1a5efd] hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <Trash weight="duotone" size={16} className={isCleaning ? 'animate-spin' : ''} />
          <span>{isCleaning ? 'Temizleniyor...' : 'Seçili Bakımı Başlat'}</span>
        </button>
      </div>

      {/* Mode Selector & Space Summary Bar */}
      <div className="flex items-center justify-between bg-[#161619] border border-white/[0.08] p-4 rounded-2xl luper-card">
        <div className="flex items-center space-x-2">
          {(['Quick', 'Recommended', 'Deep'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeMode === mode
                  ? 'bg-[#1a5efd] text-white shadow-md'
                  : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {mode === 'Quick' ? 'Hızlı Bakım' : mode === 'Recommended' ? 'Önerilen Bakım' : 'Derin Temizlik'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-[13px] font-mono">
          <span className="text-[#86868b]">Tahmini Kazanılacak Alan:</span>
          <span className="text-xl font-bold text-[#34c759]">{(totalSelectedSpace / 1024).toFixed(2)} GB</span>
        </div>
      </div>

      {/* Maintenance Tasks List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Bakım Görevleri</h3>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[#161619] border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {tasks.length > 0 && tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              task.selected
                ? 'bg-[#1a5efd]/10 border-[#1a5efd]'
                : 'bg-[#161619] border-white/[0.08] hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={task.selected}
                onChange={() => {}}
                className="w-4 h-4 accent-[#1a5efd] rounded cursor-pointer"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/[0.06] text-[#86868b] font-mono">{task.category}</span>
                  <h4 className="text-white font-bold text-[14.5px]">{task.name}</h4>
                </div>
                <p className="text-[12px] text-[#86868b] mt-0.5">{task.description}</p>
              </div>
            </div>

            <div className="text-right font-mono text-[13px]">
              <div className="text-[#34c759] font-bold">~{(task.estimatedSpaceMB / 1024).toFixed(2)} GB</div>
              <span className="text-[11px] text-[#86868b]">Risk: {task.risk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
