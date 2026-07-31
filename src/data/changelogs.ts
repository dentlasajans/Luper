import { ChangelogEntry } from '../types';

export const CHANGELOG_HISTORY: ChangelogEntry[] = [
  {
    id: 'changelog-v1.0.0',
    version: 'v1.0.0',
    title: 'İlk Kararlı Sürüm',
    date: new Date().toISOString().split('T')[0],
    features: [
      'LUPER projesi başlatıldı.',
      'Temel optimizasyon ayarları (Ağ, İşlemci, RAM vb.) entegre edildi.',
      'Çevrimdışı çalışabilen yerel veri deposu kuruldu.',
      'Ajan mimarisi ve kural motoru devreye alındı.',
      'Electron ve React 19 ile yüksek performanslı UI oluşturuldu.'
    ]
  }
];
