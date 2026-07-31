import { initializeApp } from 'firebase/app';
import { User as FirebaseUser, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, getFirestore, limit, orderBy, query, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { z } from 'zod';

import { ChangelogEntry, OptimizationSetting } from '../types';
import { getLatestChangelogEntry } from './ChangelogService';

const ImpactDetailSchema = z.object({
  level: z.enum(['none', 'positive_low', 'positive_medium', 'positive_high', 'negative_low', 'negative_medium', 'negative_high']),
  description: z.string()
});

const OptimizationSettingSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string().optional().default('default'),
  uiType: z.enum(['toggle', 'select']).optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  applyCode: z.string().optional(),
  restoreCode: z.string().optional(),
  impacts: z.object({
    performance: ImpactDetailSchema,
    latency: ImpactDetailSchema,
    input: ImpactDetailSchema,
    power: ImpactDetailSchema,
    heat: ImpactDetailSchema,
  }).optional()
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    const authError = error as { code?: string };
    if (authError?.code === 'auth/popup-blocked' || authError?.code === 'auth/popup-closed-by-user') {
      return null;
    }
    throw error;
  }
};

export const syncUserWithFirestore = async (user: FirebaseUser) => {
  if (!db) return 'free'; // fallback if no DB

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      // Optionally update lastLogin here
      await setDoc(userDocRef, { lastLogin: new Date().toISOString() }, { merge: true });
      return data.tier || 'free';
    } else {
      // Create new user
      await setDoc(userDocRef, {
        email: user.email,
        uid: user.uid,
        tier: 'free',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      return 'free';
    }
  } catch (error) {
    console.error("Error syncing user with Firestore:", error);
    return 'free'; // fallback
  }
};

export const logoutGoogle = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Google logout error:", error);
  }
};

const categoryCache: Record<string, OptimizationSetting[]> = {};

export const getCategorySettingsFromFirebase = async (categoryId: string): Promise<OptimizationSetting[]> => {
  if (categoryCache[categoryId]) {
    return categoryCache[categoryId];
  }

  if (!db) {
    categoryCache[categoryId] = [];
    window.dispatchEvent(new CustomEvent('settings_cache_updated'));
    return [];
  }
  
  try {
    const q = query(collection(db, `optimizations/${categoryId}/settings`));
    const querySnapshot = await getDocs(q);
    const firestoreSettings: OptimizationSetting[] = [];
    
    querySnapshot.forEach((doc) => {
      try {
        const docData = doc.data();
        const rawData = { 
          id: doc.id, 
          ...docData,
          status: docData.status || 'default'
        };
        const parsed = OptimizationSettingSchema.parse(rawData);
        firestoreSettings.push(parsed as OptimizationSetting);
      } catch (err) {
        console.error(`Firestore schema validation failed for ${doc.id}:`, err);
      }
    });
    
    categoryCache[categoryId] = firestoreSettings;
    window.dispatchEvent(new CustomEvent('settings_cache_updated'));
    return firestoreSettings;
  } catch (error) {
    const errObj = error as { message?: string };
    console.error(`Firebase'den ${categoryId} ayarları çekilemedi:`, errObj?.message || error);
    categoryCache[categoryId] = [];
    window.dispatchEvent(new CustomEvent('settings_cache_updated'));
    return [];
  }
};

export const saveOptimizationSettingToFirestore = async (categoryId: string, setting: OptimizationSetting): Promise<void> => {
  if (!db) return;
  try {
    await setDoc(doc(db, `optimizations/${categoryId}/settings`, setting.id), setting, { merge: true });
  } catch (error) {
    console.error(`Firestore'a ${setting.id} kaydedilirken hata oluştu:`, error);
    throw error;
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

  // seedInitialData removed - now relying entirely on Firestore

  await Promise.all(
    SUBCATEGORIES.map(async (cat) => {
      try {
        await getCategorySettingsFromFirebase(cat);
      } catch (e) {
        console.error(`Failed to preload category ${cat} from Firebase:`, e);
      }
    })
  );
  window.dispatchEvent(new CustomEvent('settings_cache_updated'));
};

export const getAllOptimizationSettings = (): OptimizationSetting[] => {
  return SUBCATEGORIES.flatMap((cat) => categoryCache[cat] || []);
};

export const getTotalOptimizationSettingsCount = (): number => {
  let total = 0;
  for (const cat of SUBCATEGORIES) {
    if (categoryCache[cat]) {
      total += categoryCache[cat].length;
    }
  }
  return total;
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
  
  const fallback = getLatestChangelogEntry() || null;

  if (!db) {
    changelogCache = fallback;
    return fallback;
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
    changelogCache = fallback;
    return fallback;
  } catch (error) {
    console.error("Changelog çekilirken hata oluştu, yerel veriye dönülüyor:", error);
    changelogCache = fallback;
    return fallback;
  }
};


