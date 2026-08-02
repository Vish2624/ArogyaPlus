export type VisitMode = "home" | "lab";
export type Gender = "Male" | "Female";
export type BookingStatus = "New" | "Contacted" | "Done";
export type CartItemType = "package" | "test";

export const TIME_SLOTS = [
  "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

export interface BookingItemInput {
  item_type: CartItemType;
  item_id: number;
}

export interface BookingItem {
  id: number;
  item_type: CartItemType;
  item_id: number;
  item_name: string;
  price: number;
  quantity: number;
}

export interface BookingCreatePayload {
  customer_name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  preferred_date: string;
  time_slot: string;
  visit_mode: VisitMode;
  items: BookingItemInput[];
}

export interface Booking {
  id: number;
  booking_reference: string;
  customer_name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  /**
   * Optional because the backend hasn't added this column yet — currently accepted on
   * `POST /bookings` but silently dropped (verified against the live API). Once it's added,
   * this will start coming back populated with no other frontend changes needed.
   */
  address?: string | null;
  preferred_date: string;
  time_slot: string;
  visit_mode: VisitMode;
  total_amount: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  items: BookingItem[];
}

export interface BookingCreatedResponse {
  booking_reference: string;
  total_amount: number;
  status: BookingStatus;
  message: string;
}

export interface DashboardStats {
  total_packages: number;
  total_tests: number;
  total_bookings: number;
  new_bookings: number;
  status_summary: Record<BookingStatus, number>;
  recent_bookings: Booking[];
}
