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
  test_ids: number[];
}
