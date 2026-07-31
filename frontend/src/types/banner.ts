export interface Banner {
  id: number;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  tags: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BannerInput {
  image_url: string;
  title?: string | null;
  subtitle?: string | null;
  tags?: string | null;
  link_url?: string | null;
  display_order: number;
  is_active: boolean;
}
