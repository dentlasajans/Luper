const fs = require('fs');
const path = require('path');

const dbDir = __dirname;
const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));

let total = 0;
const details = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dbDir, f), 'utf-8');
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      total += data.length;
      details.push(`- ${f.replace('.json', '').padEnd(15)} : ${data.length} kod`);
    }
  } catch (e) {
    console.error(`Error parsing ${f}`);
  }
});

console.log(`\nToplam Kod (Optimizasyon) Sayısı: ${total}\n`);
console.log(`Kategori Dağılımı:\n${details.join('\n')}\n`);
