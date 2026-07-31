import { Clock, Database, FileText, Stack, ArrowCounterClockwise } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';

export interface RepairPlanItem {
  id: string;
  title: string;
  category: string;
  risk: 'None' | 'Low' | 'Medium' | 'High';
  estimatedTime: string;
  requiresRestart: boolean;
  requiresAdmin: boolean;
  rollbackAvailable: boolean;
  affectedRegistryKeys: string[];
  affectedServices: string[];
  affectedComponents: string[];
}

export const RepairExecutionPreviewTools = memo(function RepairExecutionPreviewTools() {
  const [repairPlans] = useState<RepairPlanItem[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const activePlan = repairPlans.find((p) => p.id === selectedPlanId) || repairPlans[0];

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <FileText weight="duotone" className="text-luper-primary" size={28} />
            <span>Onarım Planı & İcra Önizleme Engine</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sistem değişiklikleri öncesi güvenli etki analizi ve geri alma simulation önizlemesi (Önizleme Modu).</p>
        </div>

        <div className="flex items-center space-x-3 text-[13px] font-mono">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20 font-bold flex items-center space-x-1.5">
            <ArrowCounterClockwise weight="duotone" size={14} />
            <span>%100 Geri Alınabilir</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Plan List */}
        <div className="col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Hazırlanan Onarım Planları</h3>
          {repairPlans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface border border-white/[0.08] rounded-2xl w-full col-span-full my-4">
              <h3 className="text-[14px] font-bold text-white mb-1">Veri Bulunamadı</h3>
              <p className="text-[12.5px] text-[#86868b]">Şu anda görüntülenecek veri bulunmuyor. Gerçek veri akışı bekleniyor.</p>
            </div>
          )}
          {repairPlans.length > 0 && repairPlans.map((item) => {
            const isSelected = item.id === selectedPlanId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPlanId(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-luper-primary/10 border-luper-primary shadow-lg shadow-blue-500/10'
                    : 'bg-luper-surface border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-[#86868b] font-medium">{item.category}</span>
                  <span className="text-[11px] font-mono text-[#34c759] font-bold">Risk: {item.risk}</span>
                </div>
                <h4 className="text-white font-bold text-[14.5px] leading-snug">{item.title}</h4>
                <div className="flex items-center space-x-3 text-[12px] text-[#86868b] mt-3 font-mono">
                  <span className="flex items-center space-x-1"><Clock weight="duotone" size={13} /><span>{item.estimatedTime}</span></span>
                  <span>â€¢</span>
                  <span>{item.requiresRestart ? 'Yeniden Başlatma Şart' : 'Anında Etkin'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Plan Preview Details */}
        <div className="col-span-7 bg-luper-surface border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card flex flex-col justify-center">
          {activePlan ? (
            <div className="space-y-6">
              <div className="border-b border-white/[0.06] pb-4">
                <span className="text-[11px] text-luper-primary font-bold font-mono uppercase tracking-wider">İcra Önizleme Raporu</span>
                <h2 className="text-xl font-bold text-white mt-1">{activePlan.title}</h2>
              </div>

              {/* Safety Analysis Matrix */}
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[#86868b] text-[12px]">Tahmini İcra Süresi</span>
                  <div className="text-white font-bold font-mono text-base mt-0.5">{activePlan.estimatedTime}</div>
                </div>
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.06]">
                  <span className="text-[#86868b] text-[12px]">Geri Alma Noktası</span>
                  <div className="text-[#34c759] font-bold font-mono text-base mt-0.5">Otomatik Snapshot Alınır</div>
                </div>
              </div>

              {/* Affected Registry Keys */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-2 flex items-center space-x-1.5">
                  <Database weight="duotone" size={14} className="text-luper-primary" />
                  <span>Etkilenen Kayıt Defteri (Registry) Anahtarları</span>
                </h4>
                <div className="space-y-1.5 font-mono text-[12px]">
                  {activePlan.affectedRegistryKeys.map((key, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/[0.06] p-3 rounded-xl text-[#64d2ff] break-all">
                      {key}
                    </div>
                  ))}
                </div>
              </div>

              {/* Affected Services & Components */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868b] mb-2 flex items-center space-x-1.5">
                  <Stack weight="duotone" size={14} className="text-[#34c759]" />
                  <span>Etkilenen Sistem Servisleri & Bileşenler</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activePlan.affectedServices.concat(activePlan.affectedComponents).map((svc, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-white text-[12.5px] rounded-xl font-medium">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center opacity-50 py-20">
              <FileText weight="duotone" size={48} className="mb-4" />
              <p>Önizleme yapılacak plan bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

