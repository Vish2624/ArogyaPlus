import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface SpinnerProps {
  className?: string;
  label?: string;
}

export default function Spinner({ className, label = "Loading..." }: SpinnerProps) {
  return (
    <div
      className={clsx("flex flex-col items-center justify-center gap-2 py-12 text-slate-500", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary-600" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
