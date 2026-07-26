import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export function Security() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-status-success/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="bg-anthracite-bg border border-white/[0.08] rounded-3xl p-8 relative z-10 shadow-2xl flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-status-success/20 blur-xl rounded-full" />
                <div className="w-20 h-20 bg-status-success/10 border border-status-success/30 rounded-2xl flex items-center justify-center relative z-10">
                  <ShieldCheck className="w-10 h-10 text-status-success" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-2">
                %100 Güvenli ve Temiz
              </h3>
              <p className="text-text-secondary text-sm mb-6 max-w-sm">
                VirusTotal ve Kaspersky, Bitdefender gibi endüstri standardı antivirüsler tarafından onaylanmış sıfır zararlı yazılım tespiti.
              </p>
              
              <div className="w-full bg-anthracite-surface border border-white/[0.04] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldAlert className="w-5 h-5 text-status-warning" />
                  <span className="text-sm font-medium text-white">Anti-Cheat Uyumluluğu</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-status-success/10 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                  <span className="text-xs font-bold text-status-success">Vanguard / EAC Onaylı</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6 leading-tight">
              Güvenliğiniz <br className="hidden lg:block" /> 
              <span className="text-status-success">Ödün Verilemez</span> Bir Standarttır
            </h2>
            
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              LUPER, sistem dosyalarına zarar vermeden sadece güvenli Windows yapılandırma protokollerini kullanır. Hiçbir zaman şüpheli bellek enjeksiyonları veya riskli kayıt defteri manipülasyonları yapmaz.
            </p>
            
            <ul className="space-y-4">
              {[
                "VirusTotal üzerinden %100 temiz (0/72) raporu.",
                "Sıfır Veri Politikası (Zero Data): Cihazınızdan hiçbir kişisel veri toplanmaz veya sunuculara aktarılmaz.",
                "Riot Vanguard, Easy Anti-Cheat ve BattlEye ile tam uyumluluk. Ban riski yoktur.",
                "Uygulanan tüm optimizasyonları dilediğiniz an geri alabilme garantisi."
              ].map((text, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-1 bg-status-success/10 p-1 rounded-full mr-4 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                  </div>
                  <span className="text-text-secondary">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
