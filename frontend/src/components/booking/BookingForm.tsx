import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Clock, MapPin, User } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import VisitModeSelector from "@/components/booking/VisitModeSelector";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { createBooking } from "@/services/bookingService";
import { getApiErrorMessage } from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import type { BookingCreatedResponse } from "@/types/booking";
import { todayISODate } from "@/utils/formatters";
import { bookingFormSchema, type BookingFormValues } from "@/utils/validation";

interface BookingFormProps {
  onSuccess: (response: BookingCreatedResponse) => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const items = useCartStore((s) => s.items);
  const visitMode = useCartStore((s) => s.visitMode);
  const setVisitMode = useCartStore((s) => s.setVisitMode);
  const clearCart = useCartStore((s) => s.clearCart);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      email: "",
      preferred_date: todayISODate(),
      visit_mode: visitMode,
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitError(null);
    try {
      const response = await createBooking({
        ...values,
        items: items.map((item) => ({ item_type: item.type, item_id: item.id })),
      });
      clearCart();
      onSuccess(response);
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
              }}
            />
          )}
        />
      </div>

      <div className="border-t border-slate-100 pt-6">
        <span className="form-label mb-3 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          Your Details
        </span>
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
          <input id="phone" type="tel" className="form-input" placeholder="e.g. 501234567" {...register("phone")} />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input id="email" type="email" className="form-input" placeholder="e.g. name@example.com" {...register("email")} />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
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
          render={({ field }) => <TimeSlotPicker value={field.value} onChange={(slot) => setValue("time_slot", slot, { shouldValidate: true })} />}
        />
        {errors.time_slot && <p className="form-error">{errors.time_slot.message}</p>}
      </div>

      {submitError && (
        <p className={clsx("rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700")}>{submitError}</p>
      )}

      <button type="submit" disabled={isSubmitting || items.length === 0} className="btn-primary w-full">
        {isSubmitting ? "Submitting..." : "Confirm Booking"}
      </button>
    </form>
  );
}
