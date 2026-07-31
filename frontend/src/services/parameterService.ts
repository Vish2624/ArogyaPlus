import api from "./api";
import type { Parameter, ParameterInput } from "@/types/parameter";
import { DUMMY_PARAMETERS } from "@/utils/dummyParameters";

/**
 * `/api/admin/parameters` doesn't exist on the live backend yet — fall back to a dummy
 * catalogue so the admin Parameters page can be reviewed end-to-end until it ships.
 */
export async function adminListParameters(search?: string): Promise<Parameter[]> {
  let data: Parameter[];
  try {
    ({ data } = await api.get<Parameter[]>("/admin/parameters", { params: search ? { search } : undefined }));
  } catch {
    data = DUMMY_PARAMETERS;
  }
  if (!search) return data;
  const q = search.trim().toLowerCase();
  return data.filter((p) => p.name.toLowerCase().includes(q));
}

export async function adminGetParameter(id: number): Promise<Parameter> {
  const { data } = await api.get<Parameter>(`/admin/parameters/${id}`);
  return data;
}

export async function adminCreateParameter(payload: ParameterInput): Promise<Parameter> {
  const { data } = await api.post<Parameter>("/admin/parameters", payload);
  return data;
}

export async function adminUpdateParameter(id: number, payload: Partial<ParameterInput>): Promise<Parameter> {
  const { data } = await api.put<Parameter>(`/admin/parameters/${id}`, payload);
  return data;
}

export async function adminDeleteParameter(id: number): Promise<void> {
  await api.delete(`/admin/parameters/${id}`);
}
