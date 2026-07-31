import api from "./api";
import type { Banner, BannerInput } from "@/types/banner";

export async function listBanners(): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>("/banners");
  return data;
}

// --- Admin ---

export async function adminListBanners(): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>("/admin/banners");
  return data;
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
