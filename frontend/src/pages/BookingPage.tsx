import { ClipboardList, PlusCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import { useState } from "react";

import BookingForm from "@/components/booking/BookingForm";
import BookingSuccess from "@/components/booking/BookingSuccess";
import CartList from "@/components/cart/CartList";
import EmptyState from "@/components/common/EmptyState";
import { useCartStore, useCartTotal } from "@/store/cartStore";
import type { BookingConfirmation } from "@/types/booking";
import { formatCurrency } from "@/utils/formatters";

export default function BookingPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartTotal();
  const [completedBooking, setCompletedBooking] = useState<BookingConfirmation | null>(null);

  if (completedBooking) {
    return (
      <div className="container-page">
        <BookingSuccess booking={completedBooking} />
      </div>
    );
  }

  return (
    <div className="section container-page">
      <div className="max-w-2xl">
        <p className="eyebrow text-primary-600">Cart & Booking</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Complete Your Booking</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your selected packages and tests, choose your visit mode, and confirm your appointment.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your cart is empty"
            description="Add health packages or individual lab tests to your cart before booking an appointment."
          />
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/packages" className="btn-secondary">View Packages</Link>
            <Link to="/tests" className="btn-primary">View Tests</Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="card h-fit p-6 lg:sticky lg:top-24 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">Your Cart ({items.length})</h2>
            </div>
            <div className="mt-3">
              <CartList />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-semibold text-slate-700">Total</span>
              <span className="text-primary-700">
                <span className="text-sm font-semibold">{formatCurrency(total).split(" ")[0]}</span>{" "}
                <span className="text-xl font-extrabold">{formatCurrency(total).split(" ")[1]}</span>
              </span>
            </div>
            <Link to="/packages" className="btn-secondary mt-4 w-full !text-xs">
              <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Explore More
            </Link>
          </div>

          <div className="card p-6 lg:col-span-3">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-slate-900">Your Details</h2>
            </div>
            <BookingForm onSuccess={setCompletedBooking} />
          </div>
        </div>
      )}
    </div>
  );
}
