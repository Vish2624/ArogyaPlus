import { CheckCircle2 } from "lucide-react";

import { useToastStore } from "@/store/toastStore";

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="animate-toast-in flex items-center gap-2.5 rounded-input bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-hover"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
          {toast.text}
        </div>
      ))}
    </div>
  );
}
