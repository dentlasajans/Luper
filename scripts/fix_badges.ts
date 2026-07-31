import fs from 'fs';
import path from 'path';

const dbDir = path.join('C:\\Luper\\docs\\database');
const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));

const numberToStringMap: Record<number, string> = {
  3: 'positive_high',
  2: 'positive_medium',
  1: 'positive_low',
  0: 'none',
  '-1': 'negative_low',
  '-2': 'negative_medium',
  '-3': 'negative_high'
};

for (const file of files) {
  const filePath = path.join(dbDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const item of data) {
    if (item.impacts) {
      for (const key of ['performance', 'latency', 'input', 'power', 'heat']) {
        if (typeof item.impacts[key] === 'number') {
          const val = item.impacts[key];
          item.impacts[key] = {
            level: numberToStringMap[val] || 'none',
            description: ''
          };
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
console.log('JSON files updated to use ImpactDetail schema!');
