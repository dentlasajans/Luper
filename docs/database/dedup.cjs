const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname);

// Global sets for cross-file deduplication
const seenIds = new Set();
const seenPayloads = new Set();

function deduplicateArray(arr, categoryName) {
  const result = [];
  let duplicateCount = 0;

  for (const item of arr) {
    let isDuplicate = false;
    
    // Check ID
    if (seenIds.has(item.id)) {
      isDuplicate = true;
    }

    // Check Payload (Registry)
    let payloadKey = null;
    if (item.script_payload && item.script_payload.type === 'registry' && item.script_payload.path && item.script_payload.key) {
      payloadKey = `REG_${item.script_payload.path}_${item.script_payload.key}`.toLowerCase();
      if (seenPayloads.has(payloadKey)) {
        isDuplicate = true;
      }
    }
    
    // Check Payload (Command)
    if (item.script_payload && item.script_payload.type === 'command' && Array.isArray(item.script_payload.commands)) {
      if (item.script_payload.commands.length > 0) {
        payloadKey = `CMD_${item.script_payload.commands[0]}`.toLowerCase();
        if (seenPayloads.has(payloadKey)) {
          isDuplicate = true;
        }
      }
    }
    
    // Check Payload (PowerShell)
    if (item.script_payload && item.script_payload.type === 'powershell' && item.script_payload.command) {
        payloadKey = `PS_${item.script_payload.command}`.toLowerCase();
        if (seenPayloads.has(payloadKey)) {
          isDuplicate = true;
        }
    }

    if (!isDuplicate) {
      result.push(item);
      seenIds.add(item.id);
      if (payloadKey) seenPayloads.add(payloadKey);
    } else {
      duplicateCount++;
      console.log(`[${categoryName}] Removed cross-file/duplicate: ${item.title} (${item.id})`);
    }
  }
  
  return { deduplicated: result, removed: duplicateCount };
}

async function run() {
  const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json'));
  let totalRemoved = 0;
  
  for (const file of files) {
    const filePath = path.join(dbDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        const { deduplicated, removed } = deduplicateArray(data, file);
        if (removed > 0) {
          fs.writeFileSync(filePath, JSON.stringify(deduplicated, null, 2), 'utf-8');
          totalRemoved += removed;
        }
      }
    } catch (e) {
      console.error(`Error processing ${file}: ${e.message}`);
    }
  }
  
  console.log(`\nDeduplication complete! Total duplicates removed: ${totalRemoved}`);
}

run();
