import { sanitizeId } from '../core/securityManager.js';

// @ts-expect-error - auto fixed
function validateIpcChannel(channel: unknown, allowedChannels: unknown) {
  if (typeof channel !== 'string') {
    throw new Error('IPC Error: Kanal ismi bir metin olmalıdır.');
  }
  // @ts-expect-error - auto fixed
  if (!allowedChannels.includes(channel)) {
    throw new Error(`IPC Security Warning: Yetkisiz kanal erişim denemesi: [${channel}]`);
  }
  return true;
}

export function validateIpcPayload(channel: unknown, payload: unknown) {
  switch (channel) {
    case 'apply-optimization':
    case 'restore-optimization':
      if (!payload || typeof payload !== 'object') {
        throw new Error('Geçersiz optimizasyon parametresi.');
      }
      // @ts-expect-error - auto fixed
      if (!payload.id || typeof payload.id !== 'string') {
        throw new Error('Optimizasyon ID bilgisi eksik.');
      }
      // @ts-expect-error - auto fixed
      payload.id = sanitizeId(payload.id);
      break;

    case 'toggle-startup-item':
      if (!payload || typeof payload !== 'object') {
        throw new Error('Geçersiz başlangıç öğesi verisi.');
      }
      // @ts-expect-error - auto fixed
      if (!payload.name || typeof payload.name !== 'string') {
        throw new Error('Başlangıç öğesi adı eksik.');
      }
      break;

    case 'uninstall-app':
      if (!payload || typeof payload !== 'object') {
        throw new Error('Geçersiz uygulama kaldırma verisi.');
      }
      // @ts-expect-error - auto fixed
      if (!payload.name && !payload.packageFullName && !payload.uninstallString) {
        throw new Error('Uygulama kimlik bilgisi bulunamadı.');
      }
      break;

    case 'launch-game':
      if (!payload || typeof payload !== 'object') {
        throw new Error('Geçersiz oyun başlatma verisi.');
      }
      // @ts-expect-error - auto fixed
      if (!payload.appid || !payload.launcher) {
        throw new Error('Oyun AppID veya Launcher bilgisi eksik.');
      }
      break;

    case 'execute-cleaner':
      if (!Array.isArray(payload)) {
        throw new Error('Temizleyici öğe listesi dizi formatında olmalıdır.');
      }
      break;

    case 'apply-optimizations-batch':
      if (!Array.isArray(payload)) {
        throw new Error('Toplu optimizasyon ID listesi dizi olmalıdır.');
      }
      break;
  }
  return true;
}
