import api from "./api";
import type { Banner, BannerInput } from "@/types/banner";
import type { PaginatedResponse } from "@/types/pagination";

export async function listBanners(): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>("/banners");
  return data;
}

// --- Admin ---

/**
 * Walks every page rather than trusting a single large `page_size` request, since the backend
 * may cap it below what's asked for.
 */
export async function adminListBanners(): Promise<Banner[]> {
  const all: Banner[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<PaginatedResponse<Banner>>("/admin/banners", { params: { page, page_size: 10 } });
    all.push(...data.items);
    if (data.items.length === 0 || page >= data.total_pages) break;
    page += 1;
  }
  return all;
}

export async function adminCreateBanner(payload: BannerInput): Promise<Banner> {
  const { data } = await api.post<Banner>("/admin/banners", payload);
  return data;
}

export async function adminUpdateBanner(id: number, payload: Partial<BannerInput>): Promise<Banner> {
  const { data } = await api.put<Banner>(`/admin/banners/${id}`, payload);
  return data;
}

export async function adminDeleteBanner(id: number): Promise<void> {
  await api.delete(`/admin/banners/${id}`);
}
