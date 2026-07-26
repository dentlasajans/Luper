import { ArrowRight, GitFork, Play } from '@phosphor-icons/react';
import { memo, useState } from 'react';

export interface WorkflowNode {
  id: string;
  type: 'Start' | 'Trigger' | 'Condition' | 'Action' | 'Notification';
  title: string;
  description: string;
  color: string;
}

const INITIAL_NODES: WorkflowNode[] = [
  { id: 'node-start', type: 'Start', title: 'Başlangıç (Event Launch)', description: 'Steam Oyunu Başlatıldı', color: '#1a5efd' },
  { id: 'node-cond', type: 'Condition', title: 'Koşul Kontrolü (Condition)', description: 'RAM Tüketimi > %70 VE Güç Bağlı', color: '#ff9f0a' },
  { id: 'node-act1', type: 'Action', title: 'Aksiyon: Snapshot Al', description: 'Kayıt Defteri Otomatik Yedekleme', color: '#34c759' },
  { id: 'node-act2', type: 'Action', title: 'Aksiyon: E-Spor Paketi', description: 'Ultimate Gaming Paketi Uygula', color: '#64d2ff' }
];

export const VisualWorkflowDesignerTools = memo(function VisualWorkflowDesignerTools() {
  const [nodes] = useState<WorkflowNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-start');
  const [isExecuting, setIsExecuting] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleTestRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 1200);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <GitFork weight="duotone" className="text-[#1a5efd]" size={28} />
            <span>Görsel İş Akışı Tasarımcısı (Visual Workflow Designer)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sürükle-bırak düğüm (node) yapısıyla karmaşık otomasyon senaryoları tasarlayın.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTestRun}
            disabled={isExecuting}
            className="px-5 py-2.5 bg-[#1a5efd] hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <Play weight="duotone" size={16} className={isExecuting ? 'animate-spin' : ''} />
            <span>{isExecuting ? 'Akış İcra Ediliyor...' : 'İş Akışını Test Et'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Node Palette & Visual Graph Canvas */}
        <div className="col-span-8 bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card relative min-h-[420px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-[12px] font-mono text-[#86868b]">İş Akışı Tuvali (Visual Graph Canvas)</span>
            <span className="text-[12px] font-mono text-[#34c759] font-bold">Düğüm Bağlantıları Doğrulandı</span>
          </div>

          {/* Canvas Nodes Vertical Flow */}
          <div className="space-y-4 max-w-lg mx-auto py-4">
            {nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div key={node.id} className="space-y-3">
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1a5efd]/10 border-[#1a5efd] shadow-lg shadow-blue-500/10'
                        : 'bg-[#121214] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                      <div>
                        <span className="text-[10.5px] font-mono text-[#86868b] uppercase block font-bold">{node.type} Düğümü</span>
                        <h4 className="text-white font-bold text-[14px]">{node.title}</h4>
                      </div>
                    </div>

                    <span className="text-[12px] text-[#86868b] font-mono">{node.description}</span>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight weight="duotone" size={16} className="text-[#1a5efd] rotate-90 my-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Node Property Inspector Panel */}
        <div className="col-span-4 bg-[#161619] border border-white/[0.08] p-6 rounded-2xl space-y-6 luper-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/[0.06] pb-3">
              <span className="text-[11px] text-[#1a5efd] font-bold font-mono uppercase tracking-wider">Düğüm Özellikleri (Inspector)</span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedNode.title}</h3>
            </div>

            <div className="space-y-3 text-[12.5px] font-mono">
              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[11px] block">Düğüm ID</span>
                <span className="text-white font-bold">{selectedNode.id}</span>
              </div>

              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[11px] block">Tip & Kategori</span>
                <span className="text-[#1a5efd] font-bold">{selectedNode.type}</span>
              </div>

              <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-[#86868b] text-[11px] block">İcra Koşulu</span>
                <span className="text-[#34c759] font-bold">Hatasız Geçiş (%100 Başarı)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
