import { memo } from 'react';
import { CHANGELOG_HISTORY } from '../../data/changelogs';

export const StableReleaseTools = memo(function StableReleaseTools() {
  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Sürüm Notları</h2>
      <div className="space-y-6">
        {CHANGELOG_HISTORY.map((changelog) => (
          <div
            key={changelog.id}
            className="bg-[#161619] border border-white/[0.08] p-6 rounded-2xl luper-card space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                  <span className="text-[#1a5efd] font-mono">{changelog.version}</span>
                  <span>{changelog.title}</span>
                </h3>
              </div>
              <span className="text-[13px] text-[#86868b] font-mono bg-white/[0.03] px-3 py-1 rounded-lg">
                {changelog.date}
              </span>
            </div>
            
            <ul className="space-y-2">
              {changelog.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-[14px] text-[#a1a1a6]">
                  <span className="text-[#1a5efd] mt-1.5 text-[10px]">●</span>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});
