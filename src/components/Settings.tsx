import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Power, Minimize2, Cpu, RefreshCw, RotateCcw, Check, Loader2, Moon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getAppliedOptimizationIds, restoreOptimization } from '../services/SystemEngine';
import { getCategorySettingsFromFirebase } from '../services/FirebaseService';

export function Settings() {
  const { 
    lowQualityMode, setLowQualityMode,
    autoStart, setAutoStart,
    minimizeToTray, setMinimizeToTray,
    autoRamClean, setAutoRamClean,
    autoUpdateCheck, setAutoUpdateCheck
  } = useSettings();

  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetAllOptimizations = async () => {
    if (!window.confirm('Uygulanan TÜM optimizasyon ayarlarını Windows varsayılan değerlerine geri döndürmek istediğinize emin misiniz?')) {
      return;
    }

    setResetting(true);
    try {
      const appliedIds = getAppliedOptimizationIds();
      
      const subcategories = [
        'network', 'cpu', 'storage', 'mouse', 'privacy', 
        'gpu', 'power', 'security', 'personalization', 
        'keyboard', 'audio', 'browser', 'telemetry'
      ];

      for (const cat of subcategories) {
        try {
          const settings = await getCategorySettingsFromFirebase(cat);
          for (const s of settings) {
            if (appliedIds.includes(s.id)) {
              await restoreOptimization(s.id, s.restoreCode || '');
            }
          }
        } catch (catErr) {
          console.error(`Error resetting category ${cat}:`, catErr);
        }
      }

      setResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to reset all optimizations:', err);
      setResetting(false);
      alert('Sıfırlama sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto" style={{ WebkitAppRegion: 'no-drag' } as any}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h1 className="text-[32px] font-semibold leading-tight text-[#f5f5f7] tracking-tight mb-2">Ayarlar</h1>
        <p className="text-text-muted text-[15px] font-normal leading-relaxed">
          Luper uygulama tercihlerini ve otomatik çalışma davranışlarını özelleştirin.
        </p>
      </motion.div>

      <div className="space-y-6 pb-8">
        {/* 1. Performans & Görünüm */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap size={18} className="text-brand-primary" />
            <span>Performans ve Görünüm</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mt-0.5 border border-white/[0.04] shrink-0">
                  <Moon size={18} className={lowQualityMode ? 'text-brand-primary' : 'text-text-muted'} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px] mb-1">Düşük Kalite Modu (Reduce Motion)</h3>
                  <p className="text-text-muted text-[13px] max-w-lg leading-relaxed">
                    Ağır arka plan bulanıklıklarını (blur) ve yay animasyonlarını devre dışı bırakarak donanım yükünü en aza indirir.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setLowQualityMode(!lowQualityMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${lowQualityMode ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lowQualityMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Başlangıç & Tepsi Davranışı */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center space-x-2">
            <Power size={18} className="text-brand-primary" />
            <span>Başlangıç ve Tepsi Davranışı</span>
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mt-0.5 border border-white/[0.04] shrink-0">
                  <Power size={18} className={autoStart ? 'text-brand-primary' : 'text-text-muted'} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px] mb-1">Windows Açılışında Otomatik Çalıştır</h3>
                  <p className="text-text-muted text-[13px] max-w-lg leading-relaxed">
                    Bilgisayarınız açıldığında Luper otomatik olarak başlatılır ve optimizasyonlarınızı korur.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAutoStart(!autoStart)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${autoStart ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoStart ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mt-0.5 border border-white/[0.04] shrink-0">
                  <Minimize2 size={18} className={minimizeToTray ? 'text-brand-primary' : 'text-text-muted'} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px] mb-1">Kapatıldığında Sistem Tepsisine Küçült</h3>
                  <p className="text-text-muted text-[13px] max-w-lg leading-relaxed">
                    Pencereyi kapattığınızda uygulama tamamen kapanmak yerine arka planda çalışmaya devam eder.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setMinimizeToTray(!minimizeToTray)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${minimizeToTray ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${minimizeToTray ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Otomatik Donanım Sağlığı */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center space-x-2">
            <Cpu size={18} className="text-brand-primary" />
            <span>Otomatik Donanım Sağlığı</span>
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mt-0.5 border border-white/[0.04] shrink-0">
                  <Cpu size={18} className={autoRamClean ? 'text-brand-primary' : 'text-text-muted'} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px] mb-1">Akıllı RAM Temizliği</h3>
                  <p className="text-text-muted text-[13px] max-w-lg leading-relaxed">
                    RAM kullanımı %85 üzerine çıktığında arka planda otomatik olarak standby hafızasını temizler.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAutoRamClean(!autoRamClean)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${autoRamClean ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRamClean ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mt-0.5 border border-white/[0.04] shrink-0">
                  <RefreshCw size={18} className={autoUpdateCheck ? 'text-brand-primary' : 'text-text-muted'} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-[15px] mb-1">Otomatik Güncelleme Denetimi</h3>
                  <p className="text-text-muted text-[13px] max-w-lg leading-relaxed">
                    Yeni bir Luper sürümü yayınlandığında otomatik olarak bildirir.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAutoUpdateCheck(!autoUpdateCheck)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${autoUpdateCheck ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoUpdateCheck ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Sistem Sıfırlama */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center space-x-2">
            <RotateCcw size={18} className="text-[#ff5f56]" />
            <span>Sistem Sıfırlama ve Varsayılanlar</span>
          </h2>
          
          <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-[15px] mb-1">Tüm Optimizasyonları Sıfırla</h3>
              <p className="text-text-muted text-[13px] max-w-lg leading-relaxed">
                Uygulanan tüm kayıt defteri ve sistem ince ayarlarını tek tıkla Windows varsayılan orijinal değerlerine döndürür.
              </p>
            </div>

            <button
              onClick={handleResetAllOptimizations}
              disabled={resetting}
              className="px-4 py-2.5 rounded-xl bg-[#ff5f56]/10 hover:bg-[#ff5f56]/20 border border-[#ff5f56]/20 text-[#ff5f56] font-medium text-[13px] transition-all flex items-center space-x-2 shrink-0 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none"
            >
              {resetting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#ff5f56]" />
                  <span>Sıfırlanıyor...</span>
                </>
              ) : resetSuccess ? (
                <>
                  <Check size={16} className="text-[#81c784]" />
                  <span className="text-[#81c784]">Varsayılana Döndü!</span>
                </>
              ) : (
                <>
                  <RotateCcw size={16} />
                  <span>Tümünü Sıfırla</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
