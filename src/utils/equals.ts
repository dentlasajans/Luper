import fastDeepEqual from 'fast-deep-equal';

/**
 * Derinlemesine nesne kıyaslama fonksiyonu (deep equals).
 * fast-deep-equal kütüphanesini kullanır.
 * 
 * @param a İlk nesne
 * @param b İkinci nesne
 * @returns Nesneler birbirine derinden eşitse true, aksi halde false.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  return fastDeepEqual(a, b);
}
