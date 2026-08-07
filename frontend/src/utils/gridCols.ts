/**
 * Card grids default to 3 columns on large screens. When fewer than 3 items are
 * rendered (a small catalogue, a filtered search, a short "popular" slice), a plain
 * 3-column grid leaves a lopsided gap on the right instead of balancing the row.
 * This picks a column count that matches the item count and centers the row.
 */
export function cardGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1 mx-auto max-w-sm";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2 mx-auto max-w-3xl";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}
