import clsx from "clsx";

import { TIME_SLOTS, type TimeSlot } from "@/types/booking";

interface TimeSlotPickerProps {
  value: TimeSlot | undefined;
  onChange: (slot: TimeSlot) => void;
}

export default function TimeSlotPicker({ value, onChange }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {TIME_SLOTS.map((slot) => {
        const selected = value === slot;
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            aria-pressed={selected}
            className={clsx(
              "rounded-lg border px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
              selected
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
