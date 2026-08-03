import api from "./api";
import { normalizeTest } from "./testService";
import type { Package, PackageInput } from "@/types/package";
import type { PaginatedResponse } from "@/types/pagination";

export interface PackageQuery {
  search?: string;
  category?: string;
  sort?: "price_asc" | "price_desc";
}

/**
 * The live backend serializes decimal price fields as JSON strings (e.g. "499.00"), not
 * numbers. Left as-is, `+` on cart totals silently does string concatenation instead of
 * addition, producing NaN. Coerce to real numbers once here so the rest of the app can
 * always treat these as numbers.
 */
function normalizePackage(raw: Package): Package {
  return {
    ...raw,
    lab_price: Number(raw.lab_price),
    home_price: Number(raw.home_price),
    original_lab_price: raw.original_lab_price != null ? Number(raw.original_lab_price) : null,
    original_home_price: raw.original_home_price != null ? Number(raw.original_home_price) : null,
    fasting_required: raw.fasting_required ?? null,
    tests: (raw.tests ?? []).map(normalizeTest),
  };
}

/** Falls back to `id` order when `display_order` isn't set yet, so behavior is unchanged until the backend populates it. */
function byDisplayOrder(a: Package, b: Package): number {
  return (a.display_order ?? a.id) - (b.display_order ?? b.id);
}

export async function listPackages(query: PackageQuery = {}): Promise<Package[]> {
  const { data } = await api.get<PaginatedResponse<Package>>("/packages", { params: { ...query, page_size: 10 } });
  const packages = data.items.map(normalizePackage);
  return query.sort ? packages : packages.sort(byDisplayOrder);
}

export async function getPackage(id: number): Promise<Package> {
  const { data } = await api.get<Package>(`/packages/${id}`);
  return normalizePackage(data);
}

// --- Admin ---

/**
 * Walks every page rather than trusting a single large `page_size` request, since the backend
 * may cap it below what's asked for.
 */
export async function adminListPackages(): Promise<Package[]> {
  const all: Package[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<PaginatedResponse<Package>>("/admin/packages", { params: { page, page_size: 500 } });
    all.push(...data.items);
    if (data.items.length === 0 || page >= data.total_pages) break;
    page += 1;
  }
  return all.map(normalizePackage).sort(byDisplayOrder);
}

export async function adminGetPackage(id: number): Promise<Package> {
  const { data } = await api.get<Package>(`/admin/packages/${id}`);
  return normalizePackage(data);
}

export async function adminCreatePackage(payload: PackageInput): Promise<Package> {
  const { data } = await api.post<Package>("/admin/packages", payload);
  return normalizePackage(data);
}

export async function adminUpdatePackage(id: number, payload: Partial<PackageInput>): Promise<Package> {
  const { data } = await api.put<Package>(`/admin/packages/${id}`, payload);
  return normalizePackage(data);
}

export async function adminDeletePackage(id: number): Promise<void> {
  await api.delete(`/admin/packages/${id}`);
}

export async function adminRemovePackageTest(packageId: number, testId: number): Promise<Package> {
  const { data } = await api.delete<Package>(`/admin/packages/${packageId}/tests/${testId}`);
  return normalizePackage(data);
}

export async function adminReorderPackageTests(packageId: number, orderedIds: number[]): Promise<Package> {
  const { data } = await api.patch<Package>(`/admin/packages/${packageId}/tests`, { test_ids: orderedIds });
  return normalizePackage(data);
}

/** Persists a new home-page display order for packages by writing a fresh `display_order` to each. */
export async function adminReorderPackages(orderedIds: number[]): Promise<void> {
  await Promise.all(orderedIds.map((id, index) => adminUpdatePackage(id, { display_order: index })));
}
