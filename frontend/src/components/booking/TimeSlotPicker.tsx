import clsx from "clsx";

import { TIME_SLOTS, type TimeSlot } from "@/types/booking";
import { isTimeSlotPast } from "@/utils/formatters";

interface TimeSlotPickerProps {
  value: TimeSlot | undefined;
  onChange: (slot: TimeSlot) => void;
  preferredDate: string;
}

export default function TimeSlotPicker({ value, onChange, preferredDate }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {TIME_SLOTS.map((slot) => {
        const selected = value === slot;
        const disabled = isTimeSlotPast(preferredDate, slot);
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            disabled={disabled}
            aria-pressed={selected}
            title={disabled ? "This slot has already passed" : undefined}
            className={clsx(
              "rounded-lg border px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
              disabled
                ? "cursor-not-allowed border-slate-100 text-slate-300 line-through"
                : selected
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-slate-200 text-slate-600 hover:border-primary-300"
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
