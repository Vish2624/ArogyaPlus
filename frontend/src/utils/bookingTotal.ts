import type { VisitMode } from "@/types/booking";
import { HOME_COLLECTION_FEE } from "@/utils/constants";

/**
 * The flat home collection fee is a frontend-only concept (see `HOME_COLLECTION_FEE`) — the
 * backend has no field for it and `total_amount` on every booking response/record is just the
 * sum of item prices, silently missing this fee whenever `visit_mode` is "home". Every place
 * that displays a booking's total must run it through here so it matches what the customer
 * actually saw (and was charged) at checkout.
 */
export function withHomeCollectionFee(totalAmount: number, visitMode: VisitMode): number {
  return visitMode === "home" ? totalAmount + HOME_COLLECTION_FEE : totalAmount;
}
