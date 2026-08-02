export interface PaginatedResponse<T> {
  items: T[];
  total_pages: number;
  current_page: number;
  page_size: number;
  total_rows: number;
}
