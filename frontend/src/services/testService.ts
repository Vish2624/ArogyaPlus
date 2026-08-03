import api from "./api";
import type { Test, TestInput } from "@/types/test";
import type { PaginatedResponse } from "@/types/pagination";

export interface TestQuery {
  search?: string;
  category?: string;
  sort?: "price_asc" | "price_desc";
}

export function normalizeTest(raw: Test): Test {
  return {
    ...raw,
    sample_type: raw.sample_type ?? null,
    image_url: raw.image_url ?? null,
    lab_price: Number(raw.lab_price),
    home_price: Number(raw.home_price),
    original_lab_price: raw.original_lab_price != null ? Number(raw.original_lab_price) : null,
    original_home_price: raw.original_home_price != null ? Number(raw.original_home_price) : null,
    fasting_required: raw.fasting_required ?? null,
    parameters: raw.parameters ?? [],
  };
}

/** Falls back to `id` order when `display_order` isn't set yet, so behavior is unchanged until the backend populates it. */
function byDisplayOrder(a: Test, b: Test): number {
  return (a.display_order ?? a.id) - (b.display_order ?? b.id);
}

/**
 * Walks every page rather than trusting a single large `page_size` request, since the backend
 * may cap it below what's asked for.
 */
export async function listTests(query: TestQuery = {}): Promise<Test[]> {
  const all: Test[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<PaginatedResponse<Test>>("/tests", {
      params: { ...query, page, page_size: 100 },
    });
    all.push(...data.items);
    if (data.items.length === 0 || page >= data.total_pages) break;
    page += 1;
  }
  const tests = all.map(normalizeTest);
  return query.sort ? tests : tests.sort(byDisplayOrder);
}

/** Single-page fetch for UI with page-number controls — one API call per page. */
export async function listTestsPaginated(
  query: TestQuery & { page: number; page_size: number }
): Promise<PaginatedResponse<Test>> {
  const { data } = await api.get<PaginatedResponse<Test>>("/tests", { params: query });
  return { ...data, items: data.items.map(normalizeTest) };
}

export async function getTest(id: number): Promise<Test> {
  const { data } = await api.get<Test>(`/tests/${id}`);
  return normalizeTest(data);
}

// --- Admin ---

/**
 * Walks every page rather than trusting a single large `page_size` request, since the backend
 * may cap it below what's asked for.
 */
export async function adminListTests(): Promise<Test[]> {
  const all: Test[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<PaginatedResponse<Test>>("/admin/tests", { params: { page, page_size: 100 } });
    all.push(...data.items);
    if (data.items.length === 0 || page >= data.total_pages) break;
    page += 1;
  }
  return all.map(normalizeTest).sort(byDisplayOrder);
}

/** Single-page fetch for UI with page-number controls — one API call per page. */
export async function adminListTestsPaginated(params: {
  page: number;
  page_size: number;
}): Promise<PaginatedResponse<Test>> {
  const { data } = await api.get<PaginatedResponse<Test>>("/admin/tests", { params });
  return { ...data, items: data.items.map(normalizeTest) };
}

export async function adminGetTest(id: number): Promise<Test> {
  const { data } = await api.get<Test>(`/admin/tests/${id}`);
  return normalizeTest(data);
}

export async function adminCreateTest(payload: TestInput): Promise<Test> {
  const { data } = await api.post<Test>("/admin/tests", payload);
  return normalizeTest(data);
}

export async function adminUpdateTest(id: number, payload: Partial<TestInput>): Promise<Test> {
  const { data } = await api.put<Test>(`/admin/tests/${id}`, payload);
  return normalizeTest(data);
}

export async function adminDeleteTest(id: number): Promise<void> {
  await api.delete(`/admin/tests/${id}`);
}

export async function adminAddTestParameter(testId: number, parameterId: number): Promise<Test> {
  const { data } = await api.post<Test>(`/admin/tests/${testId}/parameters`, { parameter_id: parameterId });
  return normalizeTest(data);
}

export async function adminRemoveTestParameter(testId: number, parameterId: number): Promise<Test> {
  const { data } = await api.delete<Test>(`/admin/tests/${testId}/parameters/${parameterId}`);
  return normalizeTest(data);
}

export async function adminReorderTestParameters(testId: number, orderedIds: number[]): Promise<Test> {
  const { data } = await api.put<Test>(`/admin/tests/${testId}/parameters/reorder`, { ordered_ids: orderedIds });
  return normalizeTest(data);
}

/**
 * Persists a new home-page display order for tests by writing a fresh `display_order` to each.
 * `startIndex` offsets the written values so a reorder scoped to a single loaded page doesn't
 * collide with the display_order of tests on other pages.
 */
export async function adminReorderTests(orderedIds: number[], startIndex = 0): Promise<void> {
  await Promise.all(orderedIds.map((id, index) => adminUpdateTest(id, { display_order: startIndex + index })));
}
