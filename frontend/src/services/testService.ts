import api from "./api";
import type { Test, TestInput } from "@/types/test";
import { dummyParametersForCategory, dummySampleTypeForCategory } from "@/utils/dummyParameters";

export interface TestQuery {
  search?: string;
  category?: string;
  sort?: "price_asc" | "price_desc";
}

/**
 * The live backend doesn't have `parameters`/`sample_type` yet (they're a planned addition —
 * see the admin Parameters section). Normalize so the rest of the app can always rely on
 * `test.parameters` being an array, and fall back to a dummy catalogue (matched by category)
 * so the feature can be reviewed end-to-end until the backend ships those fields.
 *
 * It also serializes decimal price fields as JSON strings (e.g. "90.00"), not numbers. Left
 * as-is, `+` on cart totals silently does string concatenation instead of addition, producing
 * NaN — coerce to real numbers here so the rest of the app can always treat these as numbers.
 */
export function normalizeTest(raw: Test): Test {
  const parameters = raw.parameters?.length ? raw.parameters : dummyParametersForCategory(raw.category);
  return {
    ...raw,
    sample_type: raw.sample_type ?? dummySampleTypeForCategory(raw.category),
    image_url: raw.image_url ?? null,
    lab_price: Number(raw.lab_price),
    home_price: Number(raw.home_price),
    original_lab_price: raw.original_lab_price != null ? Number(raw.original_lab_price) : null,
    original_home_price: raw.original_home_price != null ? Number(raw.original_home_price) : null,
    parameters,
  };
}

export async function listTests(query: TestQuery = {}): Promise<Test[]> {
  const { data } = await api.get<Test[]>("/tests", { params: query });
  return data.map(normalizeTest);
}

export async function getTest(id: number): Promise<Test> {
  const { data } = await api.get<Test>(`/tests/${id}`);
  return normalizeTest(data);
}

// --- Admin ---

export async function adminListTests(): Promise<Test[]> {
  const { data } = await api.get<Test[]>("/admin/tests");
  return data.map(normalizeTest);
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
