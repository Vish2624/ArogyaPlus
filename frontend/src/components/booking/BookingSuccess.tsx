import { CheckCircle2, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import type { BookingConfirmation } from "@/types/booking";
import { formatCurrency } from "@/utils/formatters";

export default function BookingSuccess({ booking }: { booking: BookingConfirmation }) {
  const { response, items, visitMode, subtotal, homeCollectionFee } = booking;

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-500/10 ring-8 ring-accent-500/5">
        <CheckCircle2 className="h-10 w-10 text-accent-600" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
      <p className="mt-2 text-sm text-slate-500">{response.message}</p>

      <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Booking Reference</span>
          <span className="font-bold text-slate-900">{response.booking_reference}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">Visit Mode</span>
          <span className="font-medium capitalize text-slate-900">{visitMode} visit</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">Status</span>
          <span className="badge bg-primary-50 text-primary-700">{response.status}</span>
        </div>

        <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
          {items.map((item, index) => (
            <li key={`${item.type}-${item.name}-${index}`} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="text-slate-700">{item.name}</span>
              <span className="shrink-0 font-medium text-slate-900">{formatCurrency(item.price)}</span>
            </li>
          ))}
          {homeCollectionFee > 0 && (
            <li className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                Home Collection Fee
              </span>
              <span className="shrink-0 font-medium text-slate-900">{formatCurrency(homeCollectionFee)}</span>
            </li>
          )}
        </ul>

        <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Total Amount</span>
          <span className="font-bold text-slate-900">{formatCurrency(response.total_amount)}</span>
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
