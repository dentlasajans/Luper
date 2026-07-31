import { CheckCircle, DownloadSimple, ArrowsClockwise, ShieldCheck, GithubLogo, Calendar, FileText, Tag } from '@/src/components/ui/Icons';
import { memo, useState } from 'react';
import { checkForUpdates } from '../../services/SystemEngine';

export interface UpdateItem {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  type: 'Application';
  channel: 'Stable';
  publishDate: string;
  changelog: string;
  updateAvailable: boolean;
  htmlUrl: string;
}

export const AdvancedUpdateCenterTools = memo(function AdvancedUpdateCenterTools() {
  const [updateInfo, setUpdateInfo] = useState<UpdateItem | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CURRENT_VERSION = 'v1.3.6';
  const GITHUB_REPO = 'dentlasajans/Luper';

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const result = (await checkForUpdates()) as any;
      
      const latestVersion = result?.updateInfo?.version || CURRENT_VERSION;
      const changelog = result?.updateInfo?.releaseNotes || 'Henüz yeni bir sürüm yayınlanmadı. LUPER v1.3.6 (Kararlı Sürüm) Güncel.';
      const publishDate = result?.updateInfo?.releaseDate || new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const updateAvailable = !!result?.hasUpdate;

      setUpdateInfo({
        id: 'system-update',
        name: 'LUPER Core Application',
        currentVersion: CURRENT_VERSION,
        latestVersion,
        type: 'Application',
        channel: 'Stable',
        publishDate,
        changelog,
        updateAvailable,
        htmlUrl: result?.updateInfo?.path || `https://github.com/${GITHUB_REPO}/releases`
      });

      if (result?.error) {
        setError('Güncelleme kontrolü sırasında bir hata oluştu (Sunucu yanıtı).');
      }
    } catch (err: any) {
      console.error('Güncelleme kontrolü başarısız:', err);
      setError('Güncelleme kontrolü sırasında bir hata oluştu.');
      
      // Hata durumunda bile şık kartı render etmek için varsayılan güncel durumu setle
      setUpdateInfo({
        id: 'system-update',
        name: 'LUPER Core Application',
        currentVersion: CURRENT_VERSION,
        latestVersion: CURRENT_VERSION,
        type: 'Application',
        channel: 'Stable',
        publishDate: new Date().toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        changelog: 'Henüz yeni bir sürüm yayınlanmadı. LUPER v1.3.0 (Kararlı Sürüm) Güncel.',
        updateAvailable: false,
        htmlUrl: 'https://github.com/dentlasajans/Luper/releases'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleDownloadAndInstall = () => {
    if (updateInfo?.htmlUrl) {
      // @ts-ignore
      if (window.electron?.ipcRenderer) {
         // @ts-ignore
         window.electron.ipcRenderer.send('open-external-url', updateInfo.htmlUrl);
      } else {
         window.open(updateInfo.htmlUrl, '_blank');
      }
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <ArrowsClockwise weight="duotone" className="text-luper-primary" size={28} />
            <span>Gelişmiş Güncelleme Merkezi (Advanced Update Center)</span>
          </h1>
          <p className="text-sm text-[#86868b] mt-1">LUPER platformunun sürüm güncellemelerini ve değişiklikleri yönetin.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="px-5 py-2.5 bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <ArrowsClockwise weight="duotone" size={16} className={isChecking ? 'animate-spin' : ''} />
            <span>{isChecking ? 'GitHub Üzerinden Sorgulanıyor...' : 'Güncellemeleri Kontrol Et'}</span>
          </button>
        </div>
      </div>

      {/* Channel Selector & Version Overview (Sadece Stable) */}
      <div className="flex items-center justify-between bg-luper-surface/60 backdrop-blur-md border border-white/[0.08] p-4 rounded-2xl luper-card shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-[12.5px] text-[#86868b] font-medium mr-2">Güncelleme Kanalı:</span>
          <button className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all bg-luper-primary text-white shadow-md cursor-default">
            Kararlı Sürüm (Stable Release)
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[13px] font-mono">
          <ShieldCheck weight="duotone" size={16} className="text-[#34c759]" />
          <span className="text-[#34c759] font-bold">Resmi GitHub Sürümleri (%100 Özgün)</span>
        </div>
      </div>

      {/* Updates Component List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b] px-1">Uygulama Güncellemesi</h3>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        {!updateInfo && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-luper-surface/40 backdrop-blur-sm border border-white/[0.04] rounded-2xl w-full col-span-full my-4">
            <GithubLogo weight="duotone" size={32} className="text-[#86868b] mb-3 opacity-50" />
            <h3 className="text-[14px] font-bold text-white mb-1">Henüz Kontrol Edilmedi</h3>
            <p className="text-[12.5px] text-[#86868b]">Uygulamanın en güncel halini indirmek için "Güncellemeleri Kontrol Et" butonuna tıklayın.</p>
          </div>
        )}

        {updateInfo && (
          <div className="bg-luper-surface/80 backdrop-blur-xl border border-white/[0.1] p-6 rounded-2xl luper-card flex flex-col space-y-6 shadow-2xl relative overflow-hidden">
            {/* Glassmorphism gradient effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-luper-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.06] text-white font-mono font-bold border border-white/[0.05]">
                    LUPER CORE
                  </span>
                  <h4 className="text-white font-bold text-lg">{updateInfo.name}</h4>
                  {updateInfo.updateAvailable ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-luper-primary/20 text-luper-primary font-bold border border-luper-primary/30 animate-pulse">
                      YENİ GÜNCELLEME
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#34c759]/10 text-[#34c759] font-bold border border-[#34c759]/20">
                      GÜNCEL
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-6 text-[12.5px] text-[#86868b] pt-1">
                   <div className="flex items-center space-x-1.5">
                     <Tag weight="duotone" size={14} className="text-white/50" />
                     <span>Mevcut: <strong className="text-white font-mono">{updateInfo.currentVersion}</strong></span>
                   </div>
                   <div className="flex items-center space-x-1.5">
                     <GithubLogo weight="duotone" size={15} className={updateInfo.updateAvailable ? "text-[#34c759]" : "text-white/50"} />
                     <span>GitHub En Son: <strong className={updateInfo.updateAvailable ? "text-[#34c759] font-mono" : "text-white font-mono"}>{updateInfo.latestVersion}</strong></span>
                   </div>
                   <div className="flex items-center space-x-1.5">
                     <Calendar weight="duotone" size={14} className="text-white/50" />
                     <span>Yayın Tarihi: <strong className="text-white">{updateInfo.publishDate}</strong></span>
                   </div>
                </div>
              </div>

              <div>
                {updateInfo.updateAvailable ? (
                  <button
                    onClick={handleDownloadAndInstall}
                    className="px-5 py-2.5 bg-[#34c759] hover:bg-[#30b753] text-white font-bold text-[13.5px] rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-green-500/20"
                  >
                    <DownloadSimple weight="duotone" size={16} />
                    <span>GitHub'dan İndir & Kur</span>
                  </button>
                ) : (
                  <div className="px-5 py-3 bg-gradient-to-r from-[#34c759]/20 to-[#34c759]/5 border border-[#34c759]/30 text-[#34c759] font-bold text-[13.5px] rounded-xl flex items-center space-x-2.5 shadow-[0_0_15px_rgba(52,199,89,0.15)]">
                    <CheckCircle weight="duotone" size={18} className="text-[#34c759]" />
                    <span>LUPER v1.3.6 (Kararlı Sürüm) Güncel - Henüz yeni bir sürüm yayınlanmadı</span>
                  </div>
                )}
              </div>
            </div>

            {/* Changelog section */}
            <div className="bg-[#0f0f11]/80 rounded-xl p-4 border border-white/[0.05] relative z-10">
              <div className="flex items-center space-x-2 mb-3 text-white/80">
                <FileText weight="duotone" size={16} className="text-luper-primary" />
                <h5 className="text-[13px] font-bold">GitHub Sürüm Notları (Changelog)</h5>
              </div>
              <div className="text-[12.5px] text-[#86868b] whitespace-pre-wrap max-h-48 overflow-y-auto pr-2 custom-scrollbar font-mono leading-relaxed">
                {updateInfo.changelog}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});


