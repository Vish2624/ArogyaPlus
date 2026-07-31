export function percentOff(price: number, originalPrice: number | null | undefined): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}
