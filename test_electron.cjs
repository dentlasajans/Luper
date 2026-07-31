try {
  require('C:/Luper/build/Release/luperNative.node');
  console.log('NATIVE LOAD SUCCESS');
} catch(e) {
  console.error('NATIVE LOAD ERROR:', e);
}
setTimeout(() => process.exit(0), 1000);
