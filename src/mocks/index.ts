import { SystemStatus, CategoryOptimizationCount, OptimizationSetting, ChangelogEntry } from '../types';

export const mockOptimizationCounts: CategoryOptimizationCount = {
  network: 5, cpu: 3, storage: 8, privacy: 12
};

export const mockNetworkSettings: OptimizationSetting[] = [
  {
    id: 'network_throttling',
    name: 'Ağ Kısıtlamasını (Network Throttling) Kapat',
    description: 'Windows ağ kısıtlamalarını devre dışı bırakarak gecikmeyi (ping) düşürür ve paket iletimini hızlandırır.',
    status: 'default',
    impacts: {
      performance: { level: 'positive_medium', description: 'Performansa etkisi orta düzeyde olumludur.' },
      latency: { level: 'positive_high', description: 'Gecikmeyi yüksek oranda düşürür.' },
      input: { level: 'none', description: 'İnput üzerinde belirgin bir etkisi yoktur.' },
      power: { level: 'negative_low', description: 'Güç tüketimini hafif düzeyde artırabilir.' },
      heat: { level: 'none', description: 'Isı üzerinde belirgin bir etkisi yoktur.' }
    }
  },
  {
    id: 'dns_cache',
    name: 'DNS Önbelleğini Temizle ve Optimize Et',
    description: 'Eski DNS kayıtlarını temizler ve daha hızlı alan adı çözümlemesi için ayarları yapılandırır.',
    status: 'optimized',
    impacts: {
      performance: { level: 'positive_low', description: 'Performansa etkisi hafif düzeyde olumludur.' },
      latency: { level: 'positive_medium', description: 'Gecikmeyi orta oranda düşürür.' },
      input: { level: 'none', description: 'İnput üzerinde belirgin bir etkisi yoktur.' },
      power: { level: 'none', description: 'Güç üzerinde belirgin bir etkisi yoktur.' },
      heat: { level: 'none', description: 'Isı üzerinde belirgin bir etkisi yoktur.' }
    }
  }
];

export const getMockDummySettings = (categoryId: string): OptimizationSetting[] => [
  {
    id: `dummy_${categoryId}_1`,
    name: `Örnek Optimizasyon Ayarı (${categoryId})`,
    description: 'Bu ayar arayüz tasarımını görmek için geçici olarak oluşturulmuştur.',
    status: 'default',
    impacts: {
      performance: { level: 'none', description: 'Performans üzerinde belirgin bir etkisi yoktur.' },
      latency: { level: 'none', description: 'Gecikme üzerinde belirgin bir etkisi yoktur.' },
      input: { level: 'none', description: 'İnput üzerinde belirgin bir etkisi yoktur.' },
      power: { level: 'none', description: 'Güç üzerinde belirgin bir etkisi yoktur.' },
      heat: { level: 'none', description: 'Isı üzerinde belirgin bir etkisi yoktur.' }
    }
  }
];

export const mockSystemStatus: SystemStatus = {
  cpuUsage: 14,
  ramUsage: { used: 6.2, total: 16 },
  network: { latency: 28 },
  firewall: true,
  storage: { drives: [{ name: 'C:', type: 'SSD', free: 240, total: 500 }] }
};

export const mockChangelog: ChangelogEntry = {
  id: 'mock-1',
  version: '1.0.0',
  title: 'İlk Sürüm Yayında!',
  features: [
    'Ağ optimizasyonları eklendi ve test edildi.',
    'Kullanıcı dostu yeni changelog bildirim ekranı entegre edildi.',
    'Dinamik animasyon geçişleri sorunsuz hale getirildi.'
  ],
  date: new Date().toISOString()
};

export const mockSteamGames: import('../types').SteamGame[] = [
  {
    appid: '730',
    name: 'Counter-Strike 2',
    sizeBytes: 1024 * 1024 * 1024 * 34.8,
    installDir: 'Counter-Strike Global Offensive',
    lastPlayed: 1718000000,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900.jpg',
    heroImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_hero.jpg',
    isOptimized: true
  },
  {
    appid: '1091500',
    name: 'Cyberpunk 2077',
    sizeBytes: 1024 * 1024 * 1024 * 70.2,
    installDir: 'Cyberpunk 2077',
    lastPlayed: 1715000000,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg',
    heroImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_hero.jpg',
    isOptimized: true
  },
  {
    appid: '271590',
    name: 'Grand Theft Auto V',
    sizeBytes: 1024 * 1024 * 1024 * 108.5,
    installDir: 'Grand Theft Auto V',
    lastPlayed: 1712000000,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg',
    heroImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_hero.jpg',
    isOptimized: false
  },
  {
    appid: '1172470',
    name: 'Apex Legends',
    sizeBytes: 1024 * 1024 * 1024 * 62.4,
    installDir: 'Apex Legends',
    lastPlayed: 1717000000,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/library_600x900.jpg',
    heroImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/library_hero.jpg',
    isOptimized: true
  },
  {
    appid: '570',
    name: 'Dota 2',
    sizeBytes: 1024 * 1024 * 1024 * 48.0,
    installDir: 'dota 2 beta',
    lastPlayed: 1714000000,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/library_600x900.jpg',
    heroImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/library_hero.jpg',
    isOptimized: false
  },
  {
    appid: '292030',
    name: 'The Witcher 3: Wild Hunt',
    sizeBytes: 1024 * 1024 * 1024 * 54.1,
    installDir: 'The Witcher 3',
    lastPlayed: 1710000000,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg',
    heroImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_hero.jpg',
    isOptimized: true
  }
];
