import type { Package } from "@/types/package";

/** Extracts the leading number (assumed hours) from a free-text TAT string like "24 hours" or "12". */
function parseTatHours(tat: string | null | undefined): number | null {
  if (!tat) return null;
  const match = /(\d+(?:\.\d+)?)/.exec(tat);
  return match ? Number(match[1]) : null;
}

/** Formats a raw TAT hour count as "X Hour" / "X Hours" for consistent display. */
export function formatTatHours(hours: number): string {
  return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
}

/**
 * Formats a test's own free-text `tat` field for display, e.g. "12" -> "12 Hours". Falls back
 * to the raw string when it can't be parsed as a number, and to null when there's nothing set.
 */
export function testReportTat(tat: string | null | undefined): string | null {
  const hours = parseTatHours(tat);
  return hours !== null ? formatTatHours(hours) : tat ?? null;
}

/**
 * A package's report-ready badge shows the *longest* TAT among its included tests, not the
 * package's own `tat` field — the combined report can't be ready before the slowest included
 * test comes back. Falls back to the package's own `tat` field (formatted the same way) only
 * when none of its tests have a parseable TAT.
 */
export function packageReportTat(pkg: Package): string | null {
  const testHours = pkg.tests.map((t) => parseTatHours(t.tat)).filter((h): h is number => h !== null);
  if (testHours.length > 0) return formatTatHours(Math.max(...testHours));
  return testReportTat(pkg.tat);
}
