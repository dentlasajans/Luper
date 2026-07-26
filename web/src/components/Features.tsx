import { motion, type Variants } from 'framer-motion';
import { Rocket, Zap, Shield, Cpu, Network, RotateCcw } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Maksimum FPS",
    description: "Gereksiz arka plan hizmetlerini askıya alarak oyunlarda ve ağır uygulamalarda sistem kaynaklarınızı tamamen özgür bırakın.",
    icon: Rocket,
  },
  {
    id: 2,
    title: "Sub-milisaniye Gecikme",
    description: "Ağ bağdaştırıcıları ve işlemci önceliklerini optimize ederek input lag ve ping değerlerini en aza indirin.",
    icon: Zap,
  },
  {
    id: 3,
    title: "Tam Güvenlik",
    description: "Uygulanan tüm optimizasyonlar geri alınabilir özelliktedir. Sisteminize zarar vermeden güvenli iyileştirmeler yapın.",
    icon: Shield,
  },
  {
    id: 4,
    title: "Akıllı CPU Önceliği",
    description: "LUPER, odaklandığınız aktif pencereye dinamik olarak maksimum işlemci gücünü atar.",
    icon: Cpu,
  },
  {
    id: 5,
    title: "Telemetri Engelleme",
    description: "İşletim sisteminizin arka planda veri göndermesini engelleyerek bant genişliği ve performans kazanın.",
    icon: Network,
  },
  {
    id: 6,
    title: "Otomatik Yedekleme",
    description: "Herhangi bir değişiklik öncesi Windows Sistem Geri Yükleme noktası oluşturularak riskler sıfırlanır.",
    icon: RotateCcw,
  }
];

export function Features() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section id="özellikler" className="py-24 bg-anthracite-surface/30 border-y border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Her Şeyi Düşünen Mimari
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Sisteminizi yormadan, tamamen şeffaf ve güvenli bir şekilde bilgisayarınızın potansiyelini zirveye taşıyoruz.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: "rgba(26, 94, 253, 0.3)" }}
              className="bg-anthracite-surface p-8 rounded-2xl border border-white/[0.06] transition-colors ease-out duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-sapphire-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-sapphire-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-out">
                  <feature.icon className="w-7 h-7 text-sapphire-blue" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
