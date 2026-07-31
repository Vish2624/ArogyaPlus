import clsx from "clsx";

import type { BookingStatus } from "@/types/booking";

const STYLES: Record<BookingStatus, string> = {
  New: "bg-amber-50 text-amber-700",
  Contacted: "bg-primary-50 text-primary-700",
  Done: "bg-accent-500/10 text-accent-700",
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <span className={clsx("badge", STYLES[status])}>{status}</span>;
}
