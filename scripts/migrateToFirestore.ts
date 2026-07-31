import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DB_DIR = path.join(process.cwd(), 'docs', 'database');

async function migrate() {
  console.log("Starting migration to Firestore...");
  
  if (!fs.existsSync(DB_DIR)) {
    console.error("Database directory not found:", DB_DIR);
    return;
  }
  
  const files = fs.readdirSync(DB_DIR).filter(f => f.endsWith('.json'));
  let totalUploaded = 0;
  
  for (const file of files) {
    const categoryId = path.basename(file, '.json');
    console.log(`Processing category: ${categoryId}`);
    
    const content = fs.readFileSync(path.join(DB_DIR, file), 'utf-8');
    let items: any[] = [];
    try {
      items = JSON.parse(content);
    } catch (e) {
      console.error(`Failed to parse ${file}`, e);
      continue;
    }
    
    for (const item of items) {
      try {
        const setting: any = {
          id: item.id,
          name: item.title || item.name || 'Bilinmeyen Optimizasyon',
          description: item.description || ''
        };
        
        const docRef = doc(db, `optimizations/${categoryId}/settings`, setting.id);
        const existingDoc = await getDoc(docRef);
        
        if (!existingDoc.exists()) {
          setting.status = 'default';
          setting.applyCode = JSON.stringify(item.script_payloads || []);
          setting.restoreCode = '[]';
        }

        // Map impacts safely
        const oldImpact = item.impact || item.impacts || {};
        
        const mapImpact = (key: string, altKey: string, defaultDesc: string) => {
          let lvl = 'none';
          let desc = defaultDesc;

          if (oldImpact[key]) {
             lvl = oldImpact[key];
          } else if (oldImpact[altKey]) {
             lvl = oldImpact[altKey];
          }

          if (typeof lvl === 'object' && lvl !== null) {
              desc = (lvl as any).description || defaultDesc;
              lvl = (lvl as any).level || 'none';
          }
          
          // Ensure valid enum
          const validEnums = ['none', 'positive_low', 'positive_medium', 'positive_high', 'negative_low', 'negative_medium', 'negative_high'];
          if (typeof lvl === 'string' && !validEnums.includes(lvl)) {
             lvl = 'none';
          }
          
          return { level: typeof lvl === 'string' ? lvl : 'none', description: desc };
        };

        setting.impacts = {
          performance: mapImpact('performance', 'fps', 'Genel performans etkisi.'),
          latency: mapImpact('latency', 'latency', 'Sistem ve ağ gecikmesi etkisi.'),
          input: mapImpact('input', 'input', 'Giriş gecikmesi etkisi.'),
          power: mapImpact('power', 'power', 'Güç tüketimi etkisi.'),
          heat: mapImpact('heat', 'heat', 'Sıcaklık artışı etkisi.')
        };
        
        // Push to Firestore
        const docRef = doc(db, `optimizations/${categoryId}/settings`, setting.id);
        await setDoc(docRef, setting, { merge: true });
        console.log(`  Uploaded [${categoryId}] -> ${setting.id}`);
        totalUploaded++;
      } catch (err) {
        console.error(`  Error uploading ${item.id}:`, err);
      }
    }
  }
  
  console.log(`\nMigration completed successfully! Total uploaded: ${totalUploaded}`);
  process.exit(0);
}

migrate();
