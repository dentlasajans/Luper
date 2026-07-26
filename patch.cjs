const fs = require('fs');
let code = fs.readFileSync('electron/modules/ipcManager.js', 'utf8');

if (!code.includes('import { getAutorunsItems, toggleAutorunItem }')) {
  code = code.replace(
    /import \{ UpdatePlatformEngine \} from '\.\/updatePlatformEngine\.js';/,
    "import { UpdatePlatformEngine } from './updatePlatformEngine.js';\nimport { getAutorunsItems, toggleAutorunItem } from './autoruns.js';"
  );
}

const startGetStr = "registerHandler('get-startup-items', async () => {";
const startGet = code.indexOf(startGetStr);
if (startGet !== -1) {
  // Find the end of this handler
  const endToggleStr = "    return true;\n  });";
  const endToggle = code.indexOf(endToggleStr, startGet);
  if (endToggle !== -1) {
    const end = endToggle + endToggleStr.length;
    
    const replacement = `registerHandler('get-startup-items', async () => {
    return await getAutorunsItems();
  });

  registerHandler('toggle-startup-item', async (event, item) => {
    return await toggleAutorunItem(item);
  });`;
    
    code = code.substring(0, startGet) + replacement + code.substring(end);
    fs.writeFileSync('electron/modules/ipcManager.js', code);
    console.log('Patched ipcManager.js successfully');
  } else {
    console.log('Could not find end of toggle-startup-item');
  }
} else {
  console.log('Could not find get-startup-items');
}
