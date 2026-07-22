import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, setDoc, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { ChangelogEntry, OptimizationSetting, CategoryOptimizationCount } from '../types';
import { mockChangelog } from '../mocks';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy"
};

const isConfigured = import.meta.env.VITE_FIREBASE_API_KEY !== undefined && import.meta.env.VITE_FIREBASE_API_KEY !== "";
const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const subscribeToCategorySettingsFromFirebase = (
  categoryId: string,
  onUpdate: (settings: OptimizationSetting[]) => void,
  onError: (error: Error) => void
): (() => void) | null => {
  if (!db) return null;
  
  try {
    const q = query(collection(db, `optimizations/${categoryId}/settings`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const settings: OptimizationSetting[] = [];
      querySnapshot.forEach((doc) => {
        settings.push({ id: doc.id, ...doc.data(), status: 'default' } as OptimizationSetting);
      });
      onUpdate(settings);
    }, (error) => {
      console.error(`Firebase'den ${categoryId} ayarları dinlenirken hata oluştu:`, error);
      onError(error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error(`Firebase listener kurulamadı:`, error);
    onError(error as Error);
    return null;
  }
};

export const getCategorySettingsFromFirebase = async (categoryId: string): Promise<OptimizationSetting[]> => {
  if (!db) {
    return [];
  }
  try {
    const q = query(collection(db, `optimizations/${categoryId}/settings`));
    const querySnapshot = await getDocs(q);
    const settings: OptimizationSetting[] = [];
    querySnapshot.forEach((doc) => {
      settings.push({ id: doc.id, ...doc.data(), status: 'default' } as OptimizationSetting);
    });
    return settings;
  } catch (error) {
    console.error(`Firebase'den ${categoryId} ayarları çekilirken hata oluştu:`, error);
    return [];
  }
};

export const getOptimizationCountsFromFirebase = async (categoryIds: string[]): Promise<CategoryOptimizationCount | null> => {
  if (!db) return null;
  
  try {
    const counts: CategoryOptimizationCount = {};
    const promises = categoryIds.map(async (categoryId) => {
      try {
        const coll = collection(db, `optimizations/${categoryId}/settings`);
        const snapshot = await getCountFromServer(coll);
        counts[categoryId] = snapshot.data().count;
      } catch (err) {
        counts[categoryId] = 0;
      }
    });
    await Promise.all(promises);
    return counts;
  } catch (error) {
    console.error("Firebase'den optimizasyon sayıları çekilirken hata oluştu:", error);
    return null;
  }
};

export const getLatestChangelog = async (): Promise<ChangelogEntry | null> => {
  if (USE_MOCKS || !db) {
    return mockChangelog;
  }
  try {
    const q = query(collection(db, "changelog"), orderBy("date", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ChangelogEntry;
    }
    return null;
  } catch (error) {
    console.error("Changelog çekilirken hata oluştu:", error);
    return null;
  }
};

export const seedInitialData = async () => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'optimizations/network/settings', 'network_throttling'), {
      name: 'Ağ Kısıtlamasını (Network Throttling) Kapat',
      description: 'Windows ağ kısıtlamalarını devre dışı bırakarak gecikmeyi (ping) düşürür ve paket iletimini hızlandırır.',
      impacts: {
        performance: { level: 'positive_medium', description: 'Performansa etkisi orta düzeyde olumludur.' },
        latency: { level: 'positive_high', description: 'Gecikmeyi yüksek oranda düşürür.' },
        input: { level: 'none', description: 'İnput üzerinde belirgin bir etkisi yoktur.' },
        power: { level: 'negative_low', description: 'Güç tüketimini hafif düzeyde artırabilir.' },
        heat: { level: 'none', description: 'Isı üzerinde belirgin bir etkisi yoktur.' }
      }
    });

    await setDoc(doc(db, 'optimizations/network/settings', 'dns_cache'), {
      name: 'DNS Önbelleğini Temizle ve Optimize Et',
      description: 'Eski DNS kayıtlarını temizler ve daha hızlı alan adı çözümlemesi için ayarları yapılandırır.',
      impacts: {
        performance: { level: 'positive_low', description: 'Performansa etkisi hafif düzeyde olumludur.' },
        latency: { level: 'positive_medium', description: 'Gecikmeyi orta oranda düşürür.' },
        input: { level: 'none', description: 'İnput üzerinde belirgin bir etkisi yoktur.' },
        power: { level: 'none', description: 'Güç üzerinde belirgin bir etkisi yoktur.' },
        heat: { level: 'none', description: 'Isı üzerinde belirgin bir etkisi yoktur.' }
      }
    });

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
