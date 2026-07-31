import path from 'path';
import { app } from 'electron';

export let nativeAddon: any = null;
let loadError = '';
let attemptPath = '';
try {
  attemptPath = path.join(app.getAppPath(), 'build', 'Release', 'luperNative.node');
  nativeAddon = require(attemptPath);
} catch (e: any) {
  loadError = e.message;
  console.error('Failed to load native addon', e);
}