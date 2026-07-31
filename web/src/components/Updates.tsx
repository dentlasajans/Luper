import { motion } from 'framer-motion';
import { RefreshCw, DownloadCloud, Zap } from 'lucide-react';

export function Updates() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-anthracite-bg border border-white/[0.08] rounded-3xl p-10 md:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-sapphire-blue/10 blur-[80px] rounded-full pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1"
          >
            <div className="inline-flex items-center space-x-2 bg-sapphire-blue/10 border border-sapphire-blue/20 rounded-full px-4 py-1.5 mb-6">
              <RefreshCw className="w-4 h-4 text-sapphire-blue animate-spin-slow" />
              <span className="text-xs font-medium text-sapphire-blue">Sıfır Kesinti</span>
            </div>
            
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">
              Arka Planda Sessiz Güncelleme
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              LUPER, siz oyun oynarken veya çalışırken sizi asla rahatsız etmez. Yeni optimizasyon profilleri ve özellikler arka planda sessizce indirilir ve sisteminize entegre edilir. Yeniden başlatma veya manuel kurulum derdi yok.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full md:w-auto flex flex-col gap-4"
          >
            <div className="flex items-center space-x-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0">
                <DownloadCloud className="w-5 h-5 text-text-primary" />
              </div>
              <div>
                <h4 className="text-white font-medium">Sessiz İndirme</h4>
                <p className="text-sm text-text-secondary">Arka planda kota dostu indirme</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <div className="w-12 h-12 rounded-full bg-sapphire-blue/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-sapphire-blue" />
              </div>
              <div>
                <h4 className="text-white font-medium">Anında Uygulama</h4>
                <p className="text-sm text-text-secondary">Sistemi yormadan anında entegrasyon</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
