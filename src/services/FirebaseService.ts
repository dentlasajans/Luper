import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, setDoc, getDoc } from 'firebase/firestore';
import { ChangelogEntry, OptimizationSetting } from '../types';
import { mockChangelog } from '../mocks';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCB3eOBbtuzKEOwzR1F_maKgKq6hYoXcT0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "luper-cd5df.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "luper-cd5df",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "luper-cd5df.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "935608092725",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:935608092725:web:6637d59e958d5f83ea497c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const categoryCache: Record<string, OptimizationSetting[]> = {};

export const getCategorySettingsFromFirebase = async (categoryId: string): Promise<OptimizationSetting[]> => {
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }

  if (!db) {
    throw new Error("Firebase yapılandırması bulunamadı (API Key eksik). Build işlemi sırasında .env dosyasının dahil edildiğinden emin olun.");
  }
  try {
    const q = query(collection(db, `optimizations/${categoryId}/settings`));
    const querySnapshot = await getDocs(q);
    const settings: OptimizationSetting[] = [];
    querySnapshot.forEach((doc) => {
      settings.push({ id: doc.id, ...doc.data(), status: 'default' } as OptimizationSetting);
    });
    categoryCache[categoryId] = settings;
    return settings;
  } catch (error: any) {
    console.error(`Firebase'den ${categoryId} ayarları çekilirken hata oluştu:`, error);
    throw new Error(`Veritabanına erişilemedi: ${error.message || "Bilinmeyen hata"}`);
  }
};

let changelogCache: ChangelogEntry | null | undefined = undefined;

const SUBCATEGORIES = [
  'network', 'cpu', 'storage', 'mouse', 'privacy', 
  'gpu', 'power', 'security', 'personalization', 
  'keyboard', 'audio', 'browser', 'telemetry'
];

let preloaded = false;

export const preloadAllCategorySettings = async (): Promise<void> => {
  if (preloaded) return;
  preloaded = true;

  try {
    await seedInitialData();
  } catch (e) {
    console.error("Seed error:", e);
  }

  await Promise.all(
    SUBCATEGORIES.map(async (cat) => {
      try {
        await getCategorySettingsFromFirebase(cat);
      } catch (e) {
        console.warn(`Failed to preload category ${cat} from Firebase:`, e);
      }
    })
  );
};

export const getTotalOptimizationSettingsCount = (): number => {
  let total = 0;
  for (const cat of SUBCATEGORIES) {
    if (categoryCache[cat]) {
      total += categoryCache[cat].length;
    }
  }
  return total > 0 ? total : 25;
};

export const getCategorySettingCount = (categoryId: string): number => {
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId].length;
  }
  return 0;
};

export const getAllCategorySettingCounts = (): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const cat of SUBCATEGORIES) {
    result[cat] = categoryCache[cat] ? categoryCache[cat].length : 0;
  }
  return result;
};

export const getLatestChangelog = async (): Promise<ChangelogEntry | null> => {
  if (changelogCache !== undefined) {
    return changelogCache;
  }
  
  if (USE_MOCKS || !db) {
    return mockChangelog;
  }
  try {
    const q = query(collection(db, "changelog"), orderBy("date", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const entry = { id: doc.id, ...doc.data() } as ChangelogEntry;
      changelogCache = entry;
      return entry;
    }
    changelogCache = null;
    return null;
  } catch (error) {
    console.error("Changelog çekilirken hata oluştu:", error);
    return null;
  }
};

export const seedInitialData = async () => {
  if (!db) return;
  try {
    const netThrottleRef = doc(db, 'optimizations/network/settings', 'network_throttling');
    const netThrottleSnap = await getDoc(netThrottleRef);
    if (!netThrottleSnap.exists()) {
      await setDoc(netThrottleRef, {
        name: 'Ağ Kısıtlamasını (Network Throttling) Kapat',
        description: 'Windows ağ kısıtlamalarını devre dışı bırakarak gecikmeyi (ping) düşürür ve paket iletimini hızlandırır.',
        applyCode: 'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "NetworkThrottlingIndex" -Value 0xffffffff -Type DWord',
        restoreCode: 'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "NetworkThrottlingIndex" -Value 0xa -Type DWord',
        impacts: {
          performance: { level: 'positive_medium', description: 'Performansa etkisi orta düzeyde olumludur.' },
          latency: { level: 'positive_high', description: 'Gecikmeyi yüksek oranda düşürür.' },
          input: { level: 'none', description: 'İnput üzerinde belirgin bir etkisi yoktur.' },
          power: { level: 'negative_low', description: 'Güç tüketimini hafif düzeyde artırabilir.' },
          heat: { level: 'none', description: 'Isı üzerinde belirgin bir etkisi yoktur.' }
        }
      });
    }

    const changelogRef = collection(db, 'changelog');
    const changelogQuery = query(changelogRef, orderBy('date', 'desc'), limit(1));
    const changelogSnap = await getDocs(changelogQuery);
    
    if (changelogSnap.empty) {
      await setDoc(doc(db, 'changelog', 'v1.0.0'), {
        version: '1.0.0',
        title: 'İlk Sürüm Yayında!',
        features: [
          'Ağ optimizasyonları için altyapı Firebase\'e taşındı.',
          'Sistem verileri dinamik olarak çekilmeye başlandı.',
          'Kullanıcı dostu yeni changelog bildirim ekranı eklendi.'
        ],
        date: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error("Örnek veriler eklenirken hata:", err);
  }
};
