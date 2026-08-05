import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { AlertTriangle, Clock, MapPin, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import VisitModeSelector from "@/components/booking/VisitModeSelector";
import PaymentModeSelector from "@/components/booking/PaymentModeSelector";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { createBooking } from "@/services/bookingService";
import { getApiErrorMessage } from "@/services/api";
import { itemPrice, useCartStore } from "@/store/cartStore";
import type { BookingConfirmation } from "@/types/booking";
import { HOME_COLLECTION_FEE } from "@/utils/constants";
import { isTimeSlotPast, todayISODate } from "@/utils/formatters";
import { bookingFormSchema, type BookingFormValues } from "@/utils/validation";

interface BookingFormProps {
  onSuccess: (confirmation: BookingConfirmation) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const items = useCartStore((s) => s.items);
  const visitMode = useCartStore((s) => s.visitMode);
  const setVisitMode = useCartStore((s) => s.setVisitMode);
  const homeCollectionAdded = useCartStore((s) => s.homeCollectionAdded);
  const addHomeCollection = useCartStore((s) => s.addHomeCollection);
  const removeHomeCollection = useCartStore((s) => s.removeHomeCollection);
  const clearCart = useCartStore((s) => s.clearCart);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customer_name: "",
      country_code: "+971",
      phone: "",
      email: "",
      address: "",
      preferred_date: todayISODate(),
      visit_mode: visitMode,
      payment_mode: "cash",
    },
  });

  const visitModeValue = watch("visit_mode");
  const homeCollectionMismatch = visitModeValue === "home" && !homeCollectionAdded;

  // Home Collection Fee only applies to Home Visit — covers the case where it was added to the
  // cart (e.g. from the cart page) while Lab Visit was already the selected/default mode, not
  // just an explicit switch away from Home Visit.
  useEffect(() => {
    if (visitModeValue === "lab" && homeCollectionAdded) {
      removeHomeCollection();
    }
  }, [visitModeValue, homeCollectionAdded, removeHomeCollection]);

  const preferredDateValue = watch("preferred_date");
  const timeSlotValue = watch("time_slot");

  // Clears a previously-picked slot if it falls behind the "at least 1 hour from now, UAE time"
  // cutoff — either because the clock ticked past it while the form was open, or the date was
  // changed back to today after a slot from a future date was selected.
  useEffect(() => {
    if (timeSlotValue && isTimeSlotPast(preferredDateValue, timeSlotValue)) {
      resetField("time_slot");
    }
  }, [preferredDateValue, timeSlotValue, resetField]);

  const onSubmit = async (values: BookingFormValues) => {
    if (homeCollectionMismatch) {
      setSubmitError("Add the home collection fee or switch to Lab Visit before confirming.");
      return;
    }
    setSubmitError(null);
    try {
      const { country_code, phone, ...rest } = values;
      const response = await createBooking({
        ...rest,
        phone: `${country_code}${phone}`,
        items: items.map((item) => ({ item_type: item.type, item_id: item.id })),
      });

      // Snapshot the cart's pricing before clearCart() wipes it — the backend's response has no
      // item breakdown, so the confirmation screen's order summary is built from this instead.
      const summaryItems = items.map((item) => ({
        name: item.name,
        type: item.type,
        price: itemPrice(item, values.visit_mode),
      }));
      const subtotal = summaryItems.reduce((sum, item) => sum + item.price, 0);
      const homeCollectionFee = values.visit_mode === "home" ? HOME_COLLECTION_FEE : 0;

      clearCart();
      onSuccess({
        response: { ...response, total_amount: subtotal + homeCollectionFee },
        items: summaryItems,
        visitMode: values.visit_mode,
        subtotal,
        homeCollectionFee,
      });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "We couldn't submit your booking. Please try again."));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div>
        <span className="form-label flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          Visit Mode
        </span>
        <Controller
          name="visit_mode"
          control={control}
          render={({ field }) => (
            <VisitModeSelector
              value={field.value}
              onChange={(mode) => {
                field.onChange(mode);
                setVisitMode(mode);
                if (mode === "home") {
                  addHomeCollection();
                } else {
                  removeHomeCollection();
                }
              }}
            />
          )}
        />
        {homeCollectionMismatch && (
          <div className="mt-3 flex flex-col gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              You removed the home collection fee, but Home Visit is still selected. Add it back or switch to Lab Visit to continue.
            </span>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={addHomeCollection}
                className="rounded-md bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-200"
              >
                Add Home Collection
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue("visit_mode", "lab", { shouldValidate: true });
                  setVisitMode("lab");
                  removeHomeCollection();
                }}
                className="rounded-md bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-200"
              >
                Switch to Lab Visit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-6">
        <span className="form-label flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
          Payment Mode
        </span>
        <Controller
          name="payment_mode"
          control={control}
          render={({ field }) => <PaymentModeSelector value={field.value} onChange={field.onChange} />}
        />
        {errors.payment_mode && <p className="form-error">{errors.payment_mode.message}</p>}
      </div>

      <div className="border-t border-slate-100 pt-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="customer_name" className="form-label">Full Name</label>
          <input id="customer_name" type="text" className="form-input" placeholder="e.g. Aisha Khan" {...register("customer_name")} />
          {errors.customer_name && <p className="form-error">{errors.customer_name.message}</p>}
        </div>

        <div>
          <label htmlFor="age" className="form-label">Age</label>
          <input id="age" type="number" min={1} max={99} className="form-input" placeholder="e.g. 32" {...register("age")} />
          {errors.age && <p className="form-error">{errors.age.message}</p>}
        </div>

        <div>
          <span className="form-label">Gender</span>
          <div className="flex gap-4 pt-1">
            {(["Male", "Female"] as const).map((gender) => (
              <label key={gender} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" value={gender} className="h-4 w-4 text-primary-600" {...register("gender")} />
                {gender}
              </label>
            ))}
          </div>
          {errors.gender && <p className="form-error">{errors.gender.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <div className="flex items-stretch overflow-hidden rounded-input border border-slate-300 bg-white focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600">
            <input
              id="country_code"
              type="text"
              inputMode="tel"
              autoComplete="off"
              className="w-16 shrink-0 border-0 bg-transparent px-3.5 py-2.5 text-center text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              placeholder="+971"
              {...register("country_code")}
            />
            <span className="my-2.5 w-px shrink-0 bg-slate-300" aria-hidden="true" />
            <input
              id="phone"
              type="tel"
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              placeholder="501234567"
              {...register("phone")}
            />
          </div>
          {(errors.country_code || errors.phone) && (
            <p className="form-error">{errors.country_code?.message ?? errors.phone?.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input id="email" type="email" className="form-input" placeholder="e.g. name@example.com" {...register("email")} />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="form-label">Address</label>
          <p className="mb-1.5 -mt-1 text-xs text-slate-500">
            {visitMode === "home"
              ? "Where should our phlebotomist collect the sample?"
              : "Used for your booking record and to help you find the nearest partner lab."}
          </p>
          <textarea
            id="address"
            rows={3}
            className="form-input resize-none rounded-2xl"
            placeholder="e.g. Villa 12, Al Wasl Road, Jumeirah, Dubai"
            {...register("address")}
          />
          {errors.address && <p className="form-error">{errors.address.message}</p>}
        </div>

        <div>
          <label htmlFor="preferred_date" className="form-label">Preferred Date</label>
          <input
            id="preferred_date"
            type="date"
            min={todayISODate()}
            className="form-input"
            {...register("preferred_date")}
          />
          {errors.preferred_date && <p className="form-error">{errors.preferred_date.message}</p>}
        </div>
      </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <span className="form-label flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Time Slot (7:00 AM - 6:00 PM)
        </span>
        <Controller
          name="time_slot"
          control={control}
          render={({ field }) => (
            <TimeSlotPicker
              value={field.value}
              onChange={(slot) => setValue("time_slot", slot, { shouldValidate: true })}
              preferredDate={preferredDateValue}
            />
          )}
        />
        {errors.time_slot && <p className="form-error">{errors.time_slot.message}</p>}
      </div>

      {submitError && (
        <p className={clsx("rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700")}>{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || items.length === 0 || homeCollectionMismatch}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Submitting..." : "Confirm Booking"}
      </button>
    </form>
  );
}
