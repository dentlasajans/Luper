import { motion } from 'framer-motion';
import { GitCommit, Zap, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

const changelogData = [
  {
    version: 'v1.1.0',
    date: 'Yakında',
    title: 'Gelişmiş Oyun Profilleri & Sıfır Gecikme Ses Motoru',
    badge: 'Büyük Güncelleme',
    badgeColor: 'text-[#76b900] bg-[#76b900]/10 border-[#76b900]/20',
    icon: Zap,
    changes: [
      'NVIDIA ve AMD kartları için oyuna özel dinamik güç profilleri eklendi.',
      'Uzamsal ses işleme yükü tamamen kaldırılarak ses gecikmesi (input lag) düşürüldü.',
      'Arayüz (UI) animasyon hızı ve tepki süresi iyileştirildi.'
    ]
  },
  {
    version: 'v1.0.5',
    date: 'Bu Hafta',
    title: 'Espor Desteği & Anti-Cheat Entegrasyonu',
    badge: 'Yeni Özellik',
    badgeColor: 'text-sapphire-blue bg-sapphire-blue/10 border-sapphire-blue/20',
    icon: ArrowUpCircle,
    changes: [
      'CS2, VALORANT ve League of Legends için derin sistem profilleri eklendi.',
      'Riot Vanguard ve Easy Anti-Cheat (EAC) uyumluluk doğrulama modülü aktifleştirildi.',
      'Arka plan Telemetri kısıtlama aracı geliştirildi.'
    ]
  },
  {
    version: 'v1.0.0',
    date: 'Geçen Ay',
    title: 'LUPER Beta: Maksimum Performansın Doğuşu',
    badge: 'İlk Sürüm',
    badgeColor: 'text-text-secondary bg-white/5 border-white/10',
    icon: GitCommit,
    changes: [
      'LUPER çekirdek optimizasyon motoru başarıyla yayınlandı.',
      '12 farklı kategoride (İşlemci, Bellek, Fare vb.) temel performans artışı sağlandı.',
      'Sıfır veri (Zero Data) politikası ve çevrimdışı çalışma özelliği eklendi.'
    ]
  }
];

export function Changelog() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Gelişim Günlüğü (Changelog)
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            LUPER her geçen gün daha da hızlanıyor. Son güncellemelerimizdeki performans artışlarını ve yeni eklenen özellikleri takip edin.
          </p>
        </motion.div>

        <div className="relative border-l border-white/[0.08] ml-4 md:ml-0 md:pl-8 space-y-12">
          {changelogData.map((item, idx) => (
            <motion.div 
              key={item.version}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className="relative pl-8 md:pl-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] md:-left-[41px] top-1 w-5 h-5 rounded-full bg-anthracite-bg border-4 border-sapphire-blue flex items-center justify-center z-10 shadow-[0_0_10px_rgba(26,94,253,0.5)]">
              </div>

              <div className="bg-anthracite-surface/50 border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:border-white/[0.1] transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-white">{item.version}</h3>
                    <span className="text-sm font-medium text-text-secondary">{item.date}</span>
                  </div>
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${item.badgeColor}`}>
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.badge}</span>
                  </div>
                </div>

                <h4 className="text-lg font-medium text-white mb-4">
                  {item.title}
                </h4>

                <ul className="space-y-3">
                  {item.changes.map((change, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mt-1 mr-3 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-text-secondary/70" />
                      </div>
                      <span className="text-text-secondary text-sm leading-relaxed">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
