import { motion } from 'framer-motion';
import { Search, Activity, Cpu } from 'lucide-react';

const steps = [
  {
    num: "01",
    title: "Derin Sistem Taraması",
    desc: "LUPER, sisteminizin donanımını, ağ yapılandırmasını ve aktif hizmetlerini saniyeler içinde analiz eder.",
    icon: Search
  },
  {
    num: "02",
    title: "Akıllı Karar Motoru",
    desc: "Analiz sonuçları, donanımınıza en uygun optimizasyon profilini belirlemek için işlenir.",
    icon: Activity
  },
  {
    num: "03",
    title: "Anında Optimizasyon",
    desc: "Gelişmiş motor sayesinde tüm ayarlar güvenle uygulanır ve bilgisayarınız yeni performans limitlerine ulaşır.",
    icon: Cpu
  }
];

export function HowItWorks() {
  return (
    <section id="nasıl-çalışır" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            3 Adımda Maksimum Güç
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Karmaşık ayarlar ve menüler arasında kaybolmanıza gerek yok. Her şey otomatik ve güvenli.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-white/[0.06] z-0" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.2, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-anthracite-surface border border-white/[0.08] flex items-center justify-center mb-8 relative shadow-[0_0_30px_rgba(26,94,253,0.1)]">
                <div className="absolute inset-2 rounded-full border border-sapphire-blue/30 animate-[spin_10s_linear_infinite]" />
                <step.icon className="w-8 h-8 text-sapphire-blue" />
                
                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sapphire-blue flex items-center justify-center text-white text-sm font-bold border-4 border-anthracite-bg">
                  {step.num}
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
