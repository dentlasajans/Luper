import { motion } from 'motion/react';
import { Settings as SettingsIcon, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function Settings() {
  const { lowQualityMode, setLowQualityMode } = useSettings();

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col" style={{ WebkitAppRegion: 'no-drag' } as any}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <SettingsIcon size={24} className="text-brand-primary" />
          <h1 className="text-3xl font-medium tracking-tight text-white">Ayarlar</h1>
        </div>
        <p className="text-text-muted text-[15px]">Luper deneyiminizi kişiselleştirin.</p>
      </motion.div>

      <div className="flex-1 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-lg font-medium text-white mb-6">Performans ve Görünüm</h2>
        
        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mt-1 border border-white/[0.04]">
              <Zap size={18} className={lowQualityMode ? 'text-text-muted' : 'text-brand-primary'} />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Düşük Kalite Modu (Reduce Motion)</h3>
              <p className="text-text-muted text-[13px] max-w-md leading-relaxed">
                Ağır arka plan bulanıklıklarını (blur) ve yay tabanlı animasyonları devre dışı bırakır. Düşük donanımlı cihazlarda performansı artırır.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setLowQualityMode(!lowQualityMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:outline-none ${lowQualityMode ? 'bg-brand-primary' : 'bg-white/10'}`}
            aria-label="Toggle Low Quality Mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lowQualityMode ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
