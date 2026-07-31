export interface Parameter {
  id: number;
  name: string;
  unit: string | null;
  reference_range: string | null;
  method: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParameterInput {
  name: string;
  unit?: string | null;
  reference_range?: string | null;
  method?: string | null;
  description?: string | null;
  is_active: boolean;
}
