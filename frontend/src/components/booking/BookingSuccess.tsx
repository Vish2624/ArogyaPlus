import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { BookingCreatedResponse } from "@/types/booking";
import { formatCurrency } from "@/utils/formatters";

export default function BookingSuccess({ booking }: { booking: BookingCreatedResponse }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/10 ring-8 ring-accent-500/5">
        <CheckCircle2 className="h-10 w-10 text-accent-600" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
      <p className="mt-2 text-sm text-slate-500">{booking.message}</p>

      <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Booking Reference</span>
          <span className="font-bold text-slate-900">{booking.booking_reference}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">Total Amount</span>
          <span className="font-bold text-slate-900">{formatCurrency(booking.total_amount)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">Status</span>
          <span className="badge bg-primary-50 text-primary-700">{booking.status}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Please save your booking reference. Our team will contact you shortly to confirm the details.
      </p>

      <Link to="/" className="btn-primary mt-8 inline-flex">
        Back to Home
      </Link>
    </div>
  );
}
