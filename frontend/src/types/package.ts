import type { Test } from "./test";

export interface Package {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  lab_price: number;
  home_price: number;
  original_lab_price: number | null;
  original_home_price: number | null;
  tat: string | null;
  is_active: boolean;
  is_featured: boolean;
  /**
   * Controls placement order on the public home page (lower shows first). Optional because the
   * backend hasn't added this field yet — falls back to a stable default until it does. Once the
   * backend supports it, `adminReorderPackages` persists new values via the normal update endpoint.
   */
  display_order?: number;
  created_at: string;
  updated_at: string;
  tests: Test[];
}

export interface PackageInput {
  name: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
  lab_price: number;
  home_price: number;
  original_lab_price?: number | null;
  original_home_price?: number | null;
  tat?: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order?: number;
  test_ids: number[];
}
