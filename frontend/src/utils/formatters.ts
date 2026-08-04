export function formatCurrency(amount: number): string {
  return `AED ${Number(amount).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface CurrencyParts {
  currency: string;
  amount: string;
}

export function formatCurrencyParts(amount: number): CurrencyParts {
  return {
    currency: "AED",
    amount: Number(amount).toLocaleString("en-AE", { maximumFractionDigits: 0 }),
  };
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-AE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const UAE_UTC_OFFSET_MS = 4 * 60 * 60 * 1000;

/**
 * UAE (Asia/Dubai) is a fixed UTC+4 with no DST, so shifting the UTC epoch and reading it back
 * with the UTC getters gives the correct UAE wall-clock time regardless of the visitor's own
 * timezone — booking cutoffs should be based on UAE time, not wherever the browser is.
 */
function nowInUAE(): Date {
  return new Date(Date.now() + UAE_UTC_OFFSET_MS);
}

export function todayISODate(): string {
  return nowInUAE().toISOString().split("T")[0];
}

function timeSlotToMinutes(slot: string): number {
  const match = /^(\d{2}):(\d{2}) (AM|PM)$/.exec(slot);
  if (!match) return 0;
  const [, hh, mm, period] = match;
  const hours = (Number(hh) % 12) + (period === "PM" ? 12 : 0);
  return hours * 60 + Number(mm);
}

/**
 * A slot must start at least an hour from now in UAE time to be bookable — only relevant when
 * the selected date is today in UAE; any future date leaves every slot open.
 */
export function isTimeSlotPast(preferredDateISO: string, slot: string): boolean {
  if (preferredDateISO !== todayISODate()) return false;
  const uae = nowInUAE();
  const nowMinutes = uae.getUTCHours() * 60 + uae.getUTCMinutes();
  return timeSlotToMinutes(slot) < nowMinutes + 60;
}
