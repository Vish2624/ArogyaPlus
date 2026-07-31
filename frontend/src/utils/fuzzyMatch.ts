/** Lightweight, dependency-free fuzzy text matching for client-side search-as-you-type. */

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Returns a match score (higher is better) or null if the query doesn't match `text` at all,
 * even with typo tolerance. Tolerant of small typos and matches on any word within `text`.
 */
export function fuzzyScore(query: string, text: string): number | null {
  const q = query.trim().toLowerCase();
  const t = text.trim().toLowerCase();
  if (!q) return null;

  if (t === q) return 1000;
  if (t.startsWith(q)) return 900;
  if (t.includes(q)) return 800;

  const words = t.split(/[\s()/-]+/).filter(Boolean);
  let best: number | null = null;

  for (const word of [t, ...words]) {
    if (!word) continue;
    if (word.startsWith(q)) {
      best = Math.max(best ?? 0, 700);
      continue;
    }
    const maxDistance = q.length <= 3 ? 1 : q.length <= 6 ? 2 : 3;
    const distance = levenshtein(q, word.slice(0, q.length + maxDistance));
    if (distance <= maxDistance) {
      const score = 600 - distance * 100;
      best = Math.max(best ?? 0, score);
    }
  }

  return best;
}

export function fuzzySearch<T>(query: string, items: T[], getText: (item: T) => string, limit = 8): T[] {
  if (!query.trim()) return [];
  const scored = items
    .map((item) => ({ item, score: fuzzyScore(query, getText(item)) }))
    .filter((s): s is { item: T; score: number } => s.score !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}
