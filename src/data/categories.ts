import { Network, Cpu, HardDrive, Mouse, EyeOff, Monitor, Battery, ShieldCheck, Palette, Keyboard, Volume2, Globe, Activity } from 'lucide-react';


export const CATEGORY_META: Record<string, { title: string; description: string }> = {
  network: { title: 'Ağ & İnternet', description: 'Bağlantı hızını ve kararlılığını artırarak gecikme sürelerini minimize eder.' },
  cpu: { title: 'CPU', description: 'İşlemci çekirdeklerini uykudan uyandırır ve yüksek performans modlarını etkinleştirir.' },
  storage: { title: 'Depolama', description: 'Disk okuma/yazma hızlarını optimize eder ve gereksiz indeksleme servislerini durdurur.' },
  mouse: { title: 'Fare', description: 'Fare ivmelenmesini kapatır ve ham giriş sinyalini (raw input) optimize eder.' },
  privacy: { title: 'Gizlilik', description: 'Kişisel veri toplayan Windows servislerini devre dışı bırakarak arka plan yükünü azaltır.' },
  gpu: { title: 'GPU', description: 'Görsel kaliteyi koruyarak maksimum kare hızı için donanım ivmelendirmesini optimize eder.' },
  power: { title: 'Güç', description: 'Gizli "Nihai Performans" planını aktif ederek bileşenlerin tam potansiyelinde çalışmasını sağlar.' },
  security: { title: 'Güvenlik', description: 'Defender ve güvenlik duvarı kurallarını oyun performansını etkilemeyecek şekilde düzenler.' },
  personalization: { title: 'Kişiselleştirme', description: 'Arayüz animasyonlarını ve saydamlık efektlerini kapatarak arayüz tepkime hızını artırır.' },
  keyboard: { title: 'Klavye', description: 'Tuş gecikmesini (input lag) ve tekrar oranını en düşük seviyeye indirir.' },
  audio: { title: 'Ses', description: 'Uzamsal ses ve geliştirme efektlerini kapatarak CPU yükünü ve ses gecikmesini azaltır.' },
  browser: { title: 'Tarayıcı', description: 'Donanım hızlandırma ve arka plan eklentilerini kontrol ederek tarayıcı tüketimini azaltır.' },
  telemetry: { title: 'Telemetri', description: 'Microsoft sunucularına veri gönderen tüm telemetri servislerini durdurur.' }
};

export const OPTIMIZATION_CARDS = [
  {
    id: 'network',
    icon: Network,
    title: 'Ağ & İnternet',
    description: 'Bağlantı hızını ve kararlılığını artırarak gecikme sürelerini minimize eder. Oyunlar ve yayınlar için ideal ayarları uygular.',
    improvements: ['Düşük ping ve paket kaybı', 'Daha hızlı web gezintisi', 'DNS ve TCP/IP optimizasyonu']
  },
  {
    id: 'cpu',
    icon: Cpu,
    title: 'CPU',
    description: 'İşlemci çekirdeklerini uykudan uyandırır ve yüksek performans modlarını etkinleştirir.',
    improvements: ['Çekirdek parkını kapatma', 'Gereksiz hizmetleri durdurma', 'Daha stabil FPS değerleri']
  },
  {
    id: 'storage',
    icon: HardDrive,
    title: 'Depolama',
    description: 'Disk okuma/yazma hızlarını optimize eder ve gereksiz indeksleme servislerini durdurur.',
    improvements: ['SSD ömrünü uzatma', 'Hızlı dosya erişimi', 'Gereksiz önbellek temizliği']
  },
  {
    id: 'mouse',
    icon: Mouse,
    title: 'Fare',
    description: 'Fare ivmelenmesini kapatır ve ham giriş sinyalini (raw input) optimize eder.',
    improvements: ['1:1 piksel doğruluğu', 'Gecikmesiz fare tepkisi', 'Windows ivme ayarlarını kaldırma']
  },
  {
    id: 'privacy',
    icon: EyeOff,
    title: 'Gizlilik',
    description: 'Kişisel veri toplayan Windows servislerini devre dışı bırakarak arka plan yükünü azaltır.',
    improvements: ['Reklam kimliğini kapatma', 'Konum ve mikrofon izleme durdurma', 'Cortana optimizasyonu']
  },
  {
    id: 'gpu',
    icon: Monitor,
    title: 'GPU',
    description: 'Görsel kaliteyi koruyarak maksimum kare hızı için donanım ivmelendirmesini optimize eder.',
    improvements: ['Gecikme süresini azaltma', 'Donanım hızlandırma ayarları', 'Oyun içi takılmaları önleme']
  },
  {
    id: 'power',
    icon: Battery,
    title: 'Güç',
    description: 'Gizli "Nihai Performans" planını aktif ederek bileşenlerin tam potansiyelinde çalışmasını sağlar.',
    improvements: ['Nihai Performans modu', 'Uyku ve bekleme ayarları', 'USB güç tasarrufu iptali']
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Güvenlik',
    description: 'Defender ve güvenlik duvarı kurallarını oyun performansını etkilemeyecek şekilde düzenler.',
    improvements: ['Oyun klasörlerini dışlama', 'Gerçek zamanlı koruma optimizasyonu', 'SmartScreen ayarları']
  },
  {
    id: 'personalization',
    icon: Palette,
    title: 'Kişiselleştirme',
    description: 'Arayüz animasyonlarını ve saydamlık efektlerini kapatarak arayüz tepkime hızını artırır.',
    improvements: ['Görsel efektleri kapatma', 'Animasyon hızlandırma', 'Akıcı arayüz deneyimi']
  },
  {
    id: 'keyboard',
    icon: Keyboard,
    title: 'Klavye',
    description: 'Tuş gecikmesini (input lag) ve tekrar oranını en düşük seviyeye indirir.',
    improvements: ['Filtre tuşlarını kapatma', 'Klavye tepki süresi', 'Kayıt defteri klavye hızı']
  },
  {
    id: 'audio',
    icon: Volume2,
    title: 'Ses',
    description: 'Uzamsal ses ve geliştirme efektlerini kapatarak CPU yükünü ve ses gecikmesini azaltır.',
    improvements: ['Uzamsal sesi kapatma', 'Özel kullanım modunu açma', 'Gereksiz ses efektleri']
  },
  {
    id: 'browser',
    icon: Globe,
    title: 'Tarayıcı',
    description: 'Donanım hızlandırma ve arka plan eklentilerini kontrol ederek tarayıcı tüketimini azaltır.',
    improvements: ['Donanım hızlandırma optimizasyonu', 'Arka plan işlemleri', 'Önbellek boyutu limiti']
  },
  {
    id: 'telemetry',
    icon: Activity,
    title: 'Telemetri',
    description: 'Microsoft sunucularına veri gönderen tüm telemetri servislerini durdurur.',
    improvements: ['Geri bildirimleri kapatma', 'Müşteri deneyim programı iptali', 'Hata raporlama durdurma']
  }
];
