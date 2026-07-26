import { motion, type Variants } from 'framer-motion';
import { Wifi, Cpu, HardDrive, Mouse, Monitor, BatteryCharging, Palette, Keyboard, Volume2, Globe, Activity, CheckCircle2, Wrench } from 'lucide-react';

const optimizationCategories = [
  {
    id: 'network',
    icon: Wifi,
    title: 'Ağ & İnternet',
    description: 'Ağ kısıtlamalarını ve veri akışını optimize ederek çevrimiçi oyunlarda ping ve paket kaybını en aza indirir.',
    improvements: ['Düşük ping ve kararlı paket iletimi', 'Hızlı ve takılmasız web erişimi', 'İdeal TCP/IP ve DNS yapılandırması']
  },
  {
    id: 'cpu',
    icon: Cpu,
    title: 'İşlemci (CPU)',
    description: 'Çekirdek uyku modlarını düzenler ve arka plan işlemlerini kısıtlayarak işlemcinizin tam güçte çalışmasını sağlar.',
    improvements: ['Çekirdek uykusu (Core Park) iptali', 'Arka plan hizmet kısıtlaması', 'Yüksek ve kararlı FPS değerleri']
  },
  {
    id: 'storage',
    icon: HardDrive,
    title: 'Depolama',
    description: 'Gereksiz disk indekslemesini durdurur, SSD erişim hızlarını artırır ve yükleme sürelerini kısaltır.',
    improvements: ['SSD ömrü ve performans koruması', 'Anında dosya ve oyun yükleme', 'Otomatik geçici önbellek temizliği']
  },
  {
    id: 'mouse',
    icon: Mouse,
    title: 'Fare',
    description: 'İvmelenme sapmalarını kaldırır; fare hareketlerinizin ekrana birebir (1:1) hassasiyetle iletilmesini sağlar.',
    improvements: ['1:1 pürüzsüz piksel takibi', 'Sıfıra yakın fare tepki süresi', 'Yapay Windows ivmesinin iptali']
  },
  {
    id: 'tools',
    icon: Wrench,
    title: 'Araçlar',
    description: 'Sistem bakımını kolaylaştıran, önbellekleri temizleyen ve gelişmiş Windows ince ayarları yapmanızı sağlayan ek yardımcı araçlar.',
    improvements: ['Detaylı sistem temizliği', 'Gelişmiş ağ ve DNS araçları', 'Kullanışlı Windows kısayolları']
  },
  {
    id: 'gpu',
    icon: Monitor,
    title: 'Ekran Kartı (GPU)',
    description: 'Donanım ivmelendirmesini ve gölgelendirici ayarlarını yapılandırarak oyun içi takılmaları (stuttering) engeller.',
    improvements: ['Kare işleme gecikmesi düşürme', 'Akıllı donanım hızlandırma', 'FPS düşüşlerini ve takılmayı önleme']
  },
  {
    id: 'power',
    icon: BatteryCharging,
    title: 'Güç Yönetimi',
    description: 'Nihai Performans modunu aktif ederek donanımlarınızın güç tasarrufu kısıtlamalarına takılmasını önler.',
    improvements: ['Nihai Performans profil aktifleştirme', 'Donanım uyku modlarının iptali', 'Kesintisiz USB gücü ve veri akışı']
  },

  {
    id: 'personalization',
    icon: Palette,
    title: 'Arayüz Akıcılığı',
    description: 'Gereksiz görsel efektleri ve pencere gecikmelerini kapatarak sistem tepki süresini hızlandırır.',
    improvements: ['Pencere animasyon gecikmesi iptali', 'Saydamlık yüklerinin kaldırılması', 'Anında tepki veren masaüstü']
  },
  {
    id: 'keyboard',
    icon: Keyboard,
    title: 'Klavye',
    description: 'Tuş vuruşlarındaki sistemsel gecikmeleri (input lag) sıfıra indirerek komutların anında iletilmesini sağlar.',
    improvements: ['Tuş filtreleme engellerinin kaldırılması', 'Maksimum tuş yineleme hızı', 'Minimum girdi tepki süresi']
  },
  {
    id: 'audio',
    icon: Volume2,
    title: 'Ses Akıcılığı',
    description: 'Gereksiz uzamsal işleme yükünü kaldırarak işlemci kullanımını ve ses gecikmesini azaltır.',
    improvements: ['Gereksiz ses efektlerinin iptali', 'Doğrudan ses sürücü erişimi', 'İşlemci yükünü düşüren ses işleme']
  },
  {
    id: 'browser',
    icon: Globe,
    title: 'Tarayıcı',
    description: 'Arka plan web işlemlerini ve donanım hızlandırma kaynaklarını kontrol ederek bellek kullanımını düşürür.',
    improvements: ['Dengeli donanım ivmelendirmesi', 'Arka plan sekme kısıtlaması', 'Düşük RAM ve işlemci tüketimi']
  },
  {
    id: 'telemetry',
    icon: Activity,
    title: 'Telemetri',
    description: 'Microsoft sunucularına veri gönderen arka plan servislerini kapatarak bant genişliğini ve kaynakları korur.',
    improvements: ['Otomatik bildirim ve veri aktarımı iptali', 'Deneyim iyileştirme programı kapatma', 'Sessiz ve hafif arka plan']
  }
];

export function Categories() {
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
    <section id="optimizasyonlar" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Maksimum Performans İçin 12 Kategori
          </h2>
          <p className="text-text-secondary max-w-3xl mx-auto text-lg">
            Sisteminizin her bir hücresini analiz edip en ince ayarına kadar optimize ediyoruz. İşte LUPER'in el attığı tüm kategoriler ve sağladığı geliştirmeler.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {optimizationCategories.map((category) => (
            <motion.div 
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: "rgba(26, 94, 253, 0.4)" }}
              className="bg-anthracite-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-white/[0.06] transition-all ease-out duration-300 group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sapphire-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none" />
              
              <div className="relative z-10 flex-grow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sapphire-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out shrink-0">
                    <category.icon className="w-6 h-6 text-sapphire-blue" />
                  </div>
                  <h3 className="text-xl font-medium text-white">{category.title}</h3>
                </div>
                
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {category.description}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/[0.06] mt-auto">
                <ul className="space-y-2">
                  {category.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start text-xs text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success mr-2 mt-0.5 shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
