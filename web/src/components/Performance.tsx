import { motion } from 'framer-motion';

export function Performance() {
  return (
    <section id="performans" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Rakamlarla LUPER Farkı
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Daha akıcı bir oyun deneyimi ve daha tepkisel bir Windows kullanımı için sistem kaynaklarınız üzerindeki yükü kaldırıyoruz. Elde edeceğiniz kazanımlar donanımınıza göre değişiklik gösterse de, ortalama veriler ortadadır.
            </p>
            
            <div className="space-y-8">
              {/* Stat 1 */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-white">FPS Artışı (Oyun İçi Ortalama)</span>
                  <span className="text-status-success">+24%</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "76%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-sapphire-blue rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white/30 rounded-full" />
                  </motion.div>
                </div>
              </div>
              
              {/* Stat 2 */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-white">Gecikme Düşüşü (Input Lag)</span>
                  <span className="text-status-success">-18ms</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden flex justify-end">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "82%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="h-full bg-status-success rounded-full"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-white">Boşta RAM Kullanımı</span>
                  <span className="text-status-success">-1.2GB</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden flex justify-end">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "65%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="h-full bg-sapphire-blue rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-sapphire-blue/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="bg-anthracite-bg border border-white/[0.08] rounded-2xl p-6 relative z-10 shadow-2xl">
              <div className="flex items-center space-x-2 mb-6 border-b border-white/[0.06] pb-4">
                <div className="w-3 h-3 rounded-full bg-status-critical" />
                <div className="w-3 h-3 rounded-full bg-status-warning" />
                <div className="w-3 h-3 rounded-full bg-status-success" />
                <span className="ml-2 text-xs font-mono text-text-secondary">luper-telemetry.log</span>
              </div>
              
              <div className="space-y-3 font-mono text-sm">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-text-secondary">
                  &gt; Sistem analizi başlatılıyor...
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-text-secondary">
                  &gt; 42 gereksiz hizmet tespit edildi.
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-status-warning">
                  &gt; Ağ yapılandırması optimize ediliyor...
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-sapphire-blue">
                  &gt; Kayıt defteri güvenceye alındı.
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-status-success">
                  &gt; Optimizasyon başarılı! Sistem yeniden başlatmaya hazır.
                </motion.div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-text-primary animate-pulse">
                  _
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
