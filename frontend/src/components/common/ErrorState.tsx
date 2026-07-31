import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-14 text-center"
      role="alert"
    >
      <AlertTriangle className="mb-3 h-8 w-8 text-red-500" aria-hidden="true" />
      <p className="max-w-sm text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
