import fastDeepEqual from 'fast-deep-equal';

/**
 * Derinlemesine nesne kıyaslama fonksiyonu (deep equals).
 * fast-deep-equal kütüphanesini kullanır.
 * 
 * @param a İlk nesne
 * @param b İkinci nesne
 * @returns Nesneler birbirine derinden eşitse true, aksi halde false.
 */
// @ts-expect-error - auto fixed
export function deepEqual(a, b): boolean {
  return fastDeepEqual(a, b);
}
