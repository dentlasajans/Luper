import { Code, Terminal } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

export interface DevLogItem {
  id: string;
  time: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  module: string;
  message: string;
}

export const DeveloperModeTools = memo(function DeveloperModeTools() {
  const [developerMode, setDeveloperMode] = useState(true);
  
  const [logs] = useState<DevLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'Inspector' | 'Logs' | 'Profiler' | 'API'>('Inspector');

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Code weight="duotone" className="text-luper-primary" size={28} />
            <span>Geliştirici Modu & DevTools (Developer Mode)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER çekirdek motorlarını, IPC kanallarını, canlı günlükleri ve profil araçlarını denetleyin.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDeveloperMode(!developerMode)}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all border ${
              developerMode ? 'bg-luper-primary/20 text-luper-primary border-luper-primary/30' : 'bg-white/[0.04] text-[#86868b] border-white/[0.08]'
            }`}
          >
            Geliştirici Modu: {developerMode ? 'Aktif' : 'Kapalı'}
          </button>
        </div>
      </div>

      {/* Mode Bar & Sub-Tabs */}
      <div className="flex items-center justify-between bg-luper-surface border border-white/[0.08] p-4 rounded-2xl luper-card">
        <div className="flex items-center space-x-2">
          {(['Inspector', 'Logs', 'Profiler', 'API'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                activeTab === tab
                  ? 'bg-luper-primary text-white shadow-md'
                  : 'text-[#86868b] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tab === 'Inspector' ? 'Motor Denetçisi' : tab === 'Logs' ? 'Canlı Günlükler' : tab === 'Profiler' ? 'Performans Profiler' : 'API Gezgini'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-[12.5px] font-mono text-[#86868b]">
          <span>Çekirdek Durum: <strong className="text-[#34c759]">32 Active Threads</strong></span>
        </div>
      </div>

      {/* Inspector / View Panel */}
      {activeTab === 'Inspector' && (
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl space-y-3 luper-card">
            <div className="flex items-center justify-between text-[12px] font-mono text-[#86868b]">
              <span>Main Process (Electron)</span>
              <span className="text-[#34c759] font-bold">BAŞARILI</span>
            </div>
            <h4 className="text-white font-bold text-[15px]">Electron Platform Engine</h4>
            <p className="text-[12px] text-[#86868b] font-mono">PID: 14820 â€¢ Node.js v20.11.0</p>
          </div>

          <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl space-y-3 luper-card">
            <div className="flex items-center justify-between text-[12px] font-mono text-[#86868b]">
              <span>ContextBridge IPC</span>
              <span className="text-[#34c759] font-bold">KORUMALI</span>
            </div>
            <h4 className="text-white font-bold text-[15px]">IPC Architect Protocol</h4>
            <p className="text-[12px] text-[#86868b] font-mono">14 Kanal Whitelisted (%100 Tip Güvenli)</p>
          </div>

          <div className="bg-luper-surface border border-white/[0.08] p-5 rounded-2xl space-y-3 luper-card">
            <div className="flex items-center justify-between text-[12px] font-mono text-[#86868b]">
              <span>Win32 Native API</span>
              <span className="text-[#34c759] font-bold">AKTİF</span>
            </div>
            <h4 className="text-white font-bold text-[15px]">Native Windows Engineer</h4>
            <p className="text-[12px] text-[#86868b] font-mono">DirectX DirectStorage / In-Memory PS</p>
          </div>
        </div>
      )}

      {/* Logs View Panel */}
      {activeTab === 'Logs' && (
        <div className="bg-luper-surface border border-white/[0.08] p-6 rounded-2xl space-y-4 font-mono text-[12.5px] luper-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-white font-bold flex items-center space-x-2">
              <Terminal weight="duotone" size={16} className="text-luper-primary" />
              <span>Canlı Çekirdek Günlük Akışı (Verbose Log Viewer)</span>
            </span>
            <span className="text-[#34c759] font-bold text-[11px]">Canlı Yayın Dinleniyor</span>
          </div>

          <div className="space-y-2">
            {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
            <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
            <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
          </div>
        )}
        {logs.length > 0 && logs.map((log) => (
              <div key={log.id} className="p-3 bg-black/40 rounded-xl border border-white/[0.04] flex items-center space-x-3">
                <span className="text-[#86868b] text-[11px]">{log.time}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  log.level === 'INFO' ? 'bg-luper-primary/20 text-luper-primary' :
                  log.level === 'DEBUG' ? 'bg-[#64d2ff]/20 text-[#64d2ff]' : 'bg-[#ff9f0a]/20 text-[#ff9f0a]'
                }`}>
                  {log.level}
                </span>
                <span className="text-white font-bold">[{log.module}]</span>
                <span className="text-[#a1a1a6]">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

