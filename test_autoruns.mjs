import { getAutorunsItems } from './electron/modules/autoruns.js';

(async () => {
  try {
    const items = await getAutorunsItems();
    console.log('Basarili! Bulunan öge sayisi:', items.length);
    if (items.length > 0) {
      console.log('Örnek 2 öge:');
      console.log(items.slice(0, 2));
    }
  } catch (err) {
    console.error('HATA:', err);
  }
})();
