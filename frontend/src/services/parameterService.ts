import api from "./api";
import type { Parameter, ParameterInput } from "@/types/parameter";
import type { PaginatedResponse } from "@/types/pagination";

/** Returns the first page of parameters for use in form dropdowns and test editors. */
export async function adminListParameters(search?: string): Promise<Parameter[]> {
  const { data } = await api.get<PaginatedResponse<Parameter>>("/admin/parameters", {
    params: { page_size: 10, ...(search ? { search } : {}) },
  });
  return data.items;
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
