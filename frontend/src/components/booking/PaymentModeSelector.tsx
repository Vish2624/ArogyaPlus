import { Banknote, CreditCard } from "lucide-react";
import clsx from "clsx";

import type { PaymentMode } from "@/types/booking";

interface PaymentModeSelectorProps {
  value: PaymentMode;
  onChange: (mode: PaymentMode) => void;
}

const OPTIONS: { value: PaymentMode; label: string; icon: typeof Banknote }[] = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "online", label: "Online", icon: CreditCard },
];

export default function PaymentModeSelector({ value, onChange }: PaymentModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={clsx(
              "flex items-center justify-center gap-2 rounded-input border px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
              selected
                ? "border-primary-600 bg-primary-50 text-primary-700 shadow-sm"
                : "border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700"
            )}
          >
            <option.icon className="h-4 w-4" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
