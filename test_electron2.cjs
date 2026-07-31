const fs = require('fs');
try {
  require('C:/Luper/build/Release/luperNative.node');
  fs.writeFileSync('C:/Luper/test_electron.log', 'SUCCESS');
} catch(e) {
  fs.writeFileSync('C:/Luper/test_electron.log', 'ERROR: ' + e.message);
}
setTimeout(() => process.exit(0), 1000);
