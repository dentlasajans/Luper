import { motion } from 'framer-motion';
import { Gamepad2, Layers, Crosshair, MonitorPlay, Zap } from 'lucide-react';

export function Games() {
  const nVidiaProfiles = [
    { name: 'Esports / FPS', desc: 'Maksimum kare hızı, minimum input lag.', icon: Crosshair },
    { name: 'AAA Akıcılık', desc: 'Yüksek kalite ve kararlı kare hızının mükemmel dengesi.', icon: Zap },
    { name: 'Maksimum Kalite', desc: 'Hikaye odaklı oyunlar için görsel şölen modu.', icon: MonitorPlay },
    { name: 'Dengeli', desc: 'Isı ve performans dengesini koruyan günlük kullanım.', icon: Layers }
  ];

  const launchers = [
    { name: 'Steam', color: 'bg-[#1b2838] border-[#2a475e] text-[#66c0f4]' },
    { name: 'Epic Games', color: 'bg-[#2a2a2a] border-white/20 text-white' },
    { name: 'Riot Games', color: 'bg-[#eb0029]/10 border-[#eb0029]/30 text-[#ff4655]' }
  ];

  return (
    <section id="oyunlar" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 bg-[#76b900]/10 border border-[#76b900]/30 rounded-full px-4 py-1.5 mb-6">
              <Gamepad2 className="w-4 h-4 text-[#76b900]" />
              <span className="text-xs font-medium text-[#76b900]">Gelişmiş Oyun Kütüphanesi</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6 leading-[1.2]">
              Tüm Oyunlarınız Tek Merkezde, <br className="hidden md:block" /> En Yüksek Performansta
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              LUPER, sisteminizdeki oyunları otomatik olarak analiz eder ve başlatıcınız hangisi olursa olsun tek bir merkezden yönetmenizi sağlar. Her oyun için <strong>özel NVIDIA profilleri</strong> uygulayarak donanımınızın limitlerini zorlayın.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {launchers.map(launcher => (
                <div key={launcher.name} className={`px-4 py-2 rounded-lg border text-sm font-medium ${launcher.color} backdrop-blur-md`}>
                  {launcher.name}
                </div>
              ))}
              <div className="px-4 py-2 rounded-lg border border-white/[0.06] text-sm font-medium text-text-secondary bg-white/[0.02]">
                + EA & Native PC
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Ambient Glow for NVIDIA Green */}
            <div className="absolute inset-0 bg-[#76b900]/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="bg-anthracite-bg border border-white/[0.08] rounded-2xl p-8 relative z-10 shadow-2xl">
              <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#76b900] mr-3"></span>
                NVIDIA Özel Donanım Profilleri
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nVidiaProfiles.map((profile, i) => (
                  <div key={i} className="bg-anthracite-surface border border-white/[0.04] p-5 rounded-xl hover:border-[#76b900]/50 transition-colors duration-300 group cursor-default">
                    <profile.icon className="w-6 h-6 text-[#76b900] mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                    <h4 className="text-white font-medium mb-1 text-sm">{profile.name}</h4>
                    <p className="text-xs text-text-secondary">{profile.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-sm text-text-secondary">Oyun başlatıldığında profil otomatik yüklenir.</span>
                <span className="px-3 py-1 bg-[#76b900]/10 text-[#76b900] text-xs font-bold rounded-md">API Aktif</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
