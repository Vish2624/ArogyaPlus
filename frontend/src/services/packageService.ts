import api from "./api";
import { normalizeTest } from "./testService";
import type { Package, PackageInput } from "@/types/package";

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
    tests: (raw.tests ?? []).map(normalizeTest),
  };
}

/** Falls back to `id` order when `display_order` isn't set yet, so behavior is unchanged until the backend populates it. */
function byDisplayOrder(a: Package, b: Package): number {
  return (a.display_order ?? a.id) - (b.display_order ?? b.id);
}

export async function listPackages(query: PackageQuery = {}): Promise<Package[]> {
  const { data } = await api.get<Package[]>("/packages", { params: query });
  const packages = data.map(normalizePackage);
  return query.sort ? packages : packages.sort(byDisplayOrder);
}

export async function getPackage(id: number): Promise<Package> {
  const { data } = await api.get<Package>(`/packages/${id}`);
  return normalizePackage(data);
}

// --- Admin ---

export async function adminListPackages(): Promise<Package[]> {
  const { data } = await api.get<Package[]>("/admin/packages");
  return data.map(normalizePackage).sort(byDisplayOrder);
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

export async function adminReorderPackageTests(packageId: number, orderedIds: number[]): Promise<Package> {
  return adminUpdatePackage(packageId, { test_ids: orderedIds });
}

/** Persists a new home-page display order for packages by writing a fresh `display_order` to each. */
export async function adminReorderPackages(orderedIds: number[]): Promise<void> {
  await Promise.all(orderedIds.map((id, index) => adminUpdatePackage(id, { display_order: index })));
}
