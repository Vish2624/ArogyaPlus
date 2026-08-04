import api from "./api";
import type { Booking, BookingCreatePayload, BookingCreatedResponse, BookingStatus, DashboardStats } from "@/types/booking";
import type { PaginatedResponse } from "@/types/pagination";

/**
 * Like packages/tests, the live backend serializes decimal fields (`total_amount`,
 * item `price`) as JSON strings (e.g. "888.00"), not numbers. Callers that rely on
 * `formatCurrency` never notice because it re-coerces with `Number(...)`, but anything
 * doing arithmetic or calling `.toFixed` directly on these fields needs real numbers.
 */
function normalizeBooking(raw: Booking): Booking {
  return {
    ...raw,
    total_amount: Number(raw.total_amount),
    items: raw.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

export async function createBooking(payload: BookingCreatePayload): Promise<BookingCreatedResponse> {
  const { data } = await api.post<BookingCreatedResponse>("/bookings", payload);
  return data;
}

// --- Admin ---

export interface AdminBookingQuery {
  status_filter?: BookingStatus;
  booking_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export async function adminListBookings(query: AdminBookingQuery = {}): Promise<PaginatedResponse<Booking>> {
  const { data } = await api.get<PaginatedResponse<Booking>>("/admin/bookings", { params: query });
  return { ...data, items: data.items.map(normalizeBooking) };
}

/**
 * Walks every page rather than trusting a single large `page_size` request, since the backend
 * may cap it below what's asked for. Used for CSV export, which must cover every matching
 * booking, not just the page currently on screen.
 */
export async function adminListAllBookings(
  query: Omit<AdminBookingQuery, "page" | "page_size"> = {}
): Promise<Booking[]> {
  const all: Booking[] = [];
  let page = 1;
  for (;;) {
    const { data } = await api.get<PaginatedResponse<Booking>>("/admin/bookings", {
      params: { ...query, page, page_size: 100 },
    });
    all.push(...data.items.map(normalizeBooking));
    if (data.items.length === 0 || page >= data.total_pages) break;
    page += 1;
  }
  return all;
}

export async function adminGetBooking(id: number): Promise<Booking> {
  const { data } = await api.get<Booking>(`/admin/bookings/${id}`);
  return normalizeBooking(data);
}

export async function adminUpdateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
  const { data } = await api.patch<Booking>(`/admin/bookings/${id}/status`, { status });
  return normalizeBooking(data);
}

export async function adminGetDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/admin/dashboard/stats");
  return { ...data, recent_bookings: data.recent_bookings.map(normalizeBooking) };
}
