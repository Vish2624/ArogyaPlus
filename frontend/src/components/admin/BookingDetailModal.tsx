import { CalendarClock, Download } from "lucide-react";
import { useEffect, useState } from "react";

import Modal from "@/components/common/Modal";
import BookingStatusBadge from "@/components/admin/BookingStatusBadge";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { getApiErrorMessage } from "@/services/api";
import type { AdminRescheduleBookingPayload } from "@/services/bookingService";
import type { Booking, BookingStatus, TimeSlot } from "@/types/booking";
import { getItemMeta, type ItemMetaLookup } from "@/utils/bookingItemMeta";
import { downloadBookingPdf } from "@/utils/bookingPdf";
import { withHomeCollectionFee } from "@/utils/bookingTotal";
import { HOME_COLLECTION_FEE } from "@/utils/constants";
import { formatCurrency, formatDate, formatDateTime, isTimeSlotPast, todayISODate } from "@/utils/formatters";

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onStatusChange: (id: number, status: BookingStatus) => void;
  onReschedule: (id: number, payload: AdminRescheduleBookingPayload) => Promise<Booking>;
  itemMeta: ItemMetaLookup;
}

const STATUS_OPTIONS: BookingStatus[] = ["New", "Contacted", "Done"];

export default function BookingDetailModal({ booking, onClose, onStatusChange, onReschedule, itemMeta }: BookingDetailModalProps) {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState<TimeSlot | "">("");
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Reset the inline reschedule form whenever the modal switches to a different booking (or
  // closes) - otherwise a half-edited date/slot from one booking could leak into the next.
  useEffect(() => {
    setRescheduling(false);
    setRescheduleError(null);
    if (booking) {
      setRescheduleDate(booking.preferred_date);
      setRescheduleSlot(booking.time_slot as TimeSlot);
    }
  }, [booking]);

  if (!booking) return null;

  const rescheduleUnchanged = rescheduleDate === booking.preferred_date && rescheduleSlot === booking.time_slot;

  const handleRescheduleSave = async () => {
    if (!rescheduleSlot || rescheduleUnchanged) return;
    setRescheduleSubmitting(true);
    setRescheduleError(null);
    try {
      await onReschedule(booking.id, { preferred_date: rescheduleDate, time_slot: rescheduleSlot });
      setRescheduling(false);
    } catch (err) {
      setRescheduleError(getApiErrorMessage(err, "Could not reschedule this booking. Please try again."));
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    try {
      await downloadBookingPdf(booking, itemMeta);
    } catch (err) {
      window.alert("Could not generate the PDF. Please try again.");
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <Modal open={Boolean(booking)} onClose={onClose} title={`Booking ${booking.booking_reference}`} maxWidthClassName="max-w-xl">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-slate-500">Customer</p>
          <p className="font-medium text-slate-800">{booking.customer_name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Age / Gender</p>
          <p className="font-medium text-slate-800">{booking.age} / {booking.gender}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Phone</p>
          <p className="font-medium text-slate-800">{booking.phone}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Email</p>
          <p className="font-medium text-slate-800">{booking.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Visit Mode</p>
          <p className="font-medium capitalize text-slate-800">{booking.visit_mode} visit</p>
        </div>
        <div className="col-span-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Preferred Date</p>
            {!rescheduling && (
              <button
                type="button"
                onClick={() => setRescheduling(true)}
                className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                Reschedule
              </button>
            )}
          </div>
          {!rescheduling ? (
            <p className="font-medium text-slate-800">{formatDate(booking.preferred_date)} at {booking.time_slot}</p>
          ) : (
            <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label htmlFor="reschedule-date" className="form-label !mb-1 !text-[11px]">New Date</label>
              <input
                id="reschedule-date"
                type="date"
                min={todayISODate()}
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="form-input !py-1.5 !text-sm"
              />
              <p className="form-label !mb-1 !mt-2.5 !text-[11px]">New Time Slot</p>
              <TimeSlotPicker
                value={rescheduleSlot || undefined}
                onChange={setRescheduleSlot}
                preferredDate={rescheduleDate}
              />
              {rescheduleSlot && isTimeSlotPast(rescheduleDate, rescheduleSlot) && (
                <p className="form-error !mt-1.5">That slot has already passed — pick another.</p>
              )}
              {rescheduleError && <p className="form-error !mt-1.5">{rescheduleError}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleRescheduleSave}
                  disabled={rescheduleSubmitting || !rescheduleSlot || rescheduleUnchanged || isTimeSlotPast(rescheduleDate, rescheduleSlot)}
                  className="btn-primary !px-3 !py-1.5 !text-xs disabled:opacity-40"
                >
                  {rescheduleSubmitting ? "Saving..." : "Save New Slot"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduling(false);
                    setRescheduleError(null);
                    setRescheduleDate(booking.preferred_date);
                    setRescheduleSlot(booking.time_slot as TimeSlot);
                  }}
                  disabled={rescheduleSubmitting}
                  className="btn-secondary !px-3 !py-1.5 !text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-500">Submitted</p>
          <p className="font-medium text-slate-800">{formatDateTime(booking.created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Amount</p>
          <p className="font-bold text-slate-900">{formatCurrency(withHomeCollectionFee(booking.total_amount, booking.visit_mode))}</p>
        </div>
        {booking.payment_mode && (
          <div>
            <p className="text-xs text-slate-500">Payment Mode</p>
            <p className="font-medium capitalize text-slate-800">{booking.payment_mode}</p>
          </div>
        )}
        {booking.address && (
          <div className="col-span-2">
            <p className="text-xs text-slate-500">Address</p>
            <p className="font-medium text-slate-800">{booking.address}</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">Selected Items ({booking.items.length})</h4>
        <ul className="mt-2 divide-y divide-slate-100">
          {booking.items.map((item) => {
            const meta = getItemMeta(item, itemMeta);
            const details = [
              meta.category,
              meta.sampleType,
              meta.tat ? `TAT ${meta.tat}` : null,
            ].filter((value): value is string => Boolean(value));

            return (
              <li key={item.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                <div>
                  <span className="text-slate-800">
                    <span className="badge mr-2 bg-slate-100 text-slate-500">{item.item_type}</span>
                    {item.item_name}
                  </span>
                  {details.length > 0 && (
                    <p className="mt-1 pl-0.5 text-xs text-slate-500">{details.join(" · ")}</p>
                  )}
                </div>
                <span className="shrink-0 font-medium text-slate-800">{formatCurrency(item.price)}</span>
              </li>
            );
          })}
          {booking.visit_mode === "home" && (
            <li className="flex items-start justify-between gap-3 py-2.5 text-sm">
              <span className="text-slate-800">
                <span className="badge mr-2 bg-primary-50 text-primary-700">fee</span>
                Home Collection Fee
              </span>
              <span className="shrink-0 font-medium text-slate-800">{formatCurrency(HOME_COLLECTION_FEE)}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BookingStatusBadge status={booking.status} />
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="btn-primary !px-3 !py-1.5 !text-xs disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {generatingPdf ? "Generating..." : "Download PDF"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              disabled={status === booking.status}
              onClick={() => onStatusChange(booking.id, status)}
              className="btn-secondary !px-3 !py-1.5 !text-xs disabled:opacity-40"
            >
              Mark {status}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
