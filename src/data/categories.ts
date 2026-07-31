import { Pulse, BatteryFull, Cpu, EyeSlash, Globe, HardDrive, Keyboard, Monitor, Mouse, WifiHigh, Palette, ShieldCheck, SpeakerHigh } from '@/src/components/ui/Icons';


export const CATEGORY_META: Record<string, { title: string; description: string }> = {
  network: { title: 'Ağ & İnternet', description: 'Ağ kısıtlamalarını ve veri akışını optimize ederek çevrimiçi oyunlarda ping ve paket kaybını en aza indirir.' },
  cpu: { title: 'İşlemci (CPU)', description: 'Çekirdek uyku modlarını düzenler ve arka plan işlemlerini kısıtlayarak işlemcinizin tam güçte çalışmasını sağlar.' },
  storage: { title: 'Depolama', description: 'Gereksiz disk indekslemesini durdurur, SSD erişim hızlarını artırır ve yükleme sürelerini kısaltır.' },
  mouse: { title: 'Fare', description: 'İvmelenme sapmalarını kaldırır; fare hareketlerinizin ekrana birebir (1:1) hassasiyetle iletilmesini sağlar.' },
  privacy: { title: 'Gizlilik', description: 'Arka planda veri toplayan servisleri durdurarak sisteminiz üzerindeki gizli yükleri ortadan kaldırır.' },
  gpu: { title: 'Ekran Kartı (GPU)', description: 'Donanım ivmelendirmesini ve gölgelendirici ayarlarını yapılandırarak oyun içi takılmaları (stuttering) engeller.' },
  power: { title: 'Güç Yönetimi', description: 'Size özel LUPER güç planlarını seçerek, donanımlarınızın güç tasarrufu kısıtlamalarına takılmasını önler.' },
  security: { title: 'Güvenlik', description: 'Koruma katmanlarını, oyun esnasında ani işlemci yükselmelerine yol açmayacak şekilde akıllıca uyarlar.' },
  personalization: { title: 'Arayüz Akıcılığı', description: 'Gereksiz görsel efektleri ve pencere gecikmelerini kapatarak sistem tepki süresini hızlandırır.' },
  keyboard: { title: 'Klavye', description: 'Tuş vuruşlarındaki sistemsel gecikmeleri (input lag) sıfıra indirerek komutların anında iletilmesini sağlar.' },
  audio: { title: 'Ses Akıcılığı', description: 'Gereksiz uzamsal işleme yükünü kaldırarak işlemci kullanımını ve ses gecikmesini azaltır.' },
  browser: { title: 'Tarayıcı', description: 'Arka plan web işlemlerini ve donanım hızlandırma kaynaklarını kontrol ederek bellek kullanımını düşürür.' },
  telemetry: { title: 'Telemetri', description: 'Microsoft sunucularına veri gönderen arka plan servislerini kapatarak bant genişliğini ve kaynakları korur.' }
};

export const OPTIMIZATION_CARDS = [
  {
    id: 'network',
    icon: WifiHigh,
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
    id: 'privacy',
    icon: EyeSlash,
    title: 'Gizlilik',
    description: 'Arka planda veri toplayan servisleri durdurarak sisteminiz üzerindeki gizli yükleri ortadan kaldırır.',
    improvements: ['Gizli reklam kimliği kapatma', 'Konum ve mikrofon takibi iptali', 'Cortana ve sesli asistan devre dışı']
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
    icon: BatteryFull,
    title: 'Güç Yönetimi',
    description: 'Size özel LUPER güç planlarını seçerek, donanımlarınızın güç tasarrufu kısıtlamalarına takılmasını önler.',
    improvements: ['Özel LUPER Güç planı aktif etme', 'Donanım uyku modlarının iptali', 'Kesintisiz USB gücü ve veri akışı']
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Güvenlik',
    description: 'Koruma katmanlarını, oyun esnasında ani işlemci yükselmelerine yol açmayacak şekilde akıllıca uyarlar.',
    improvements: ['Oyun klasörleri için akıllı tarama', 'İşlemciyi yormayan koruma modu', 'SmartScreen arka plan optimizasyonu']
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
    icon: SpeakerHigh,
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
    icon: Pulse,
    title: 'Telemetri',
    description: 'Microsoft sunucularına veri gönderen arka plan servislerini kapatarak bant genişliğini ve kaynakları korur.',
    improvements: ['Otomatik bildirim ve veri aktarımı iptali', 'Deneyim iyileştirme programı kapatma', 'Sessiz ve hafif arka plan']
  }
];

export interface HardwareSpecs {
  cpuCores: number;
  ramGB: number;
  gpuVramGB?: number;
  isLaptop: boolean;
  diskType?: 'SSD' | 'HDD' | 'Unknown';
}

export const HEURISTIC_RECOMMENDATIONS = {
  analyze(specs: HardwareSpecs): string[] {
    const recommendations = new Set<string>();

    if (specs.cpuCores < 6) {
      recommendations.add('cpu');
      recommendations.add('power');
    }

    if (specs.ramGB <= 8) {
      recommendations.add('browser');
      recommendations.add('personalization');
      recommendations.add('privacy');
    }

    if (specs.diskType === 'HDD') {
      recommendations.add('storage');
    }

    if (specs.isLaptop) {
      recommendations.add('telemetry');
    }

    // Always recommend baseline latency optimizations for gamers
    recommendations.add('mouse');
    recommendations.add('keyboard');
    recommendations.add('network');

    return Array.from(recommendations);
  }
};
