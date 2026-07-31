import type { Parameter } from "./parameter";

export interface Test {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  sample_type: string | null;
  image_url: string | null;
  lab_price: number;
  home_price: number;
  original_lab_price: number | null;
  original_home_price: number | null;
  tat: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parameters: Parameter[];
}

export interface TestInput {
  name: string;
  description?: string | null;
  category?: string | null;
  sample_type?: string | null;
  image_url?: string | null;
  lab_price: number;
  home_price: number;
  original_lab_price?: number | null;
  original_home_price?: number | null;
  tat?: string | null;
  is_active: boolean;
}
