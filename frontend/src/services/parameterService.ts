import api from "./api";
import type { Parameter, ParameterInput } from "@/types/parameter";
import type { PaginatedResponse } from "@/types/pagination";

/**
 * Returns the full parameter catalog for use in form dropdowns and test editors. Walks every
 * page rather than trusting a single large `page_size` request, since the backend may cap it
 * below what's asked for.
 */
export async function adminListParameters(search?: string): Promise<Parameter[]> {
  const all: Parameter[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<PaginatedResponse<Parameter>>("/admin/parameters", {
      params: { page, page_size: 500, ...(search ? { search } : {}) },
    });
    all.push(...data.items);
    if (data.items.length === 0 || page >= data.total_pages) break;
    page += 1;
  }
  return all;
}

export async function adminListParametersPaginated(params: {
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Parameter>> {
  const { data } = await api.get<PaginatedResponse<Parameter>>("/admin/parameters", { params });
  return data;
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
