import api from "./api";
import type { AdminProfileUpdatePayload, AdminUser, LoginPayload, TokenResponse } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", payload);
  return data;
}

export async function getCurrentAdmin(): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>("/auth/me");
  return data;
}

export async function updateAdminProfile(payload: AdminProfileUpdatePayload): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>("/auth/me", payload);
  return data;
}
