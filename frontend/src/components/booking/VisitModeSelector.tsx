import { Building2, CheckCircle2, Home } from "lucide-react";
import clsx from "clsx";

import type { VisitMode } from "@/types/booking";

interface VisitModeSelectorProps {
  value: VisitMode;
  onChange: (mode: VisitMode) => void;
}

const OPTIONS: { value: VisitMode; label: string; description: string; icon: typeof Home }[] = [
  { value: "home", label: "Home Visit", description: "We collect the sample at your home.", icon: Home },
  { value: "lab", label: "Lab Visit", description: "Visit our partner lab location.", icon: Building2 },
];

export default function VisitModeSelector({ value, onChange }: VisitModeSelectorProps) {
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
              "group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
              selected
                ? "border-primary-600 bg-primary-50 shadow-sm"
                : "border-slate-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-elevated"
            )}
          >
            {selected && <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary-600" aria-hidden="true" />}
            <span
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                selected ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600"
              )}
            >
              <option.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className={clsx("text-sm font-semibold", selected ? "text-primary-800" : "text-slate-800")}>
              {option.label}
            </span>
            <span className="text-xs text-slate-500">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
