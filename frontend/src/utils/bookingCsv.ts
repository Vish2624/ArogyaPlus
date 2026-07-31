import type { Booking } from "@/types/booking";
import { getItemMeta, type ItemMetaLookup } from "./bookingItemMeta";
import { formatDate, formatDateTime } from "./formatters";

function csvEscape(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadBookingsCsv(bookings: Booking[], lookup: ItemMetaLookup): void {
  const headers = [
    "Reference",
    "Customer",
    "Age",
    "Gender",
    "Phone",
    "Email",
    "Visit Mode",
    "Preferred Date",
    "Time Slot",
    "Status",
    "Submitted",
    "Total Amount (AED)",
    "Items",
  ];

  const rows = bookings.map((b) => {
    const itemsSummary = b.items
      .map((item) => {
        const meta = getItemMeta(item, lookup);
        const details = [meta.category, meta.sampleType, meta.tat ? `TAT ${meta.tat}` : null]
          .filter(Boolean)
          .join(", ");
        return `${item.item_name} (${item.item_type}${details ? ` - ${details}` : ""}) - AED ${Number(item.price).toFixed(2)}`;
      })
      .join(" | ");

    return [
      b.booking_reference,
      b.customer_name,
      b.age,
      b.gender,
      b.phone,
      b.email,
      b.visit_mode === "home" ? "Home Visit" : "Lab Visit",
      formatDate(b.preferred_date),
      b.time_slot,
      b.status,
      formatDateTime(b.created_at),
      Number(b.total_amount).toFixed(2),
      itemsSummary,
    ];
  });

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
