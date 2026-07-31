import { Building2, Home } from "lucide-react";
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
              "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
              selected ? "border-primary-600 bg-primary-50" : "border-slate-200 hover:border-primary-300"
            )}
          >
            <option.icon className={clsx("h-5 w-5", selected ? "text-primary-700" : "text-slate-500")} aria-hidden="true" />
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
