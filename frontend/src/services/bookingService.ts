import api from "./api";
import type { Booking, BookingCreatePayload, BookingCreatedResponse, BookingStatus, DashboardStats } from "@/types/booking";

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
}

export async function adminListBookings(query: AdminBookingQuery = {}): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/admin/bookings", { params: query });
  return data.map(normalizeBooking);
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
