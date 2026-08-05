import { Clock, Plus, Trash2, Truck } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { itemPrice, useCartStore } from "@/store/cartStore";
import { HOME_COLLECTION_FEE } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatters";

export default function CartList() {
  const items = useCartStore((s) => s.items);
  const homeCollectionAdded = useCartStore((s) => s.homeCollectionAdded);
  const addHomeCollection = useCartStore((s) => s.addHomeCollection);
  const removeHomeCollection = useCartStore((s) => s.removeHomeCollection);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse our health packages or individual lab tests and add them to your cart to get started."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => {
        const [currency, amount] = formatCurrency(itemPrice(item)).split(" ");
        return (
          <li key={`${item.type}-${item.id}`} className="flex items-center justify-between gap-4 py-4">
            <div>
              <span className="badge mb-1.5 bg-slate-100 text-slate-500">
                {item.type === "package" ? "Package" : "Test"}
              </span>
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              {item.category && <p className="text-xs text-slate-500">{item.category}</p>}
              {item.tat && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary-700">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  Report in {item.tat}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <p className="w-20 shrink-0 text-right tabular-nums text-slate-900">
                <span className="text-xs font-semibold text-slate-500">{currency}</span>{" "}
                <span className="text-sm font-bold">{amount}</span>
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.type, item.id)}
                className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        );
      })}
      <li className="py-4">
        {homeCollectionAdded ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="badge mb-1.5 bg-primary-50 text-primary-700">Home Collection</span>
              <p className="text-sm font-semibold text-slate-900">Home Collection Fee</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Truck className="h-3 w-3" aria-hidden="true" />
                Flat rate — one fee for the entire visit
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="w-20 shrink-0 text-right tabular-nums text-slate-900">
                <span className="text-xs font-semibold text-slate-500">AED</span>{" "}
                <span className="text-sm font-bold">{HOME_COLLECTION_FEE.toFixed(2)}</span>
              </p>
              <button
                type="button"
                onClick={removeHomeCollection}
                className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Remove Home Collection"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={addHomeCollection}
            className="flex w-full flex-col gap-1.5 rounded-xl border border-dashed border-slate-300 px-3.5 py-3 text-left transition-colors hover:border-primary-400 hover:bg-primary-50/40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="truncate text-sm font-semibold text-slate-900">Add Home Collection</span>
              </span>
              <span className="shrink-0 text-slate-900">
                <span className="text-xs font-semibold text-slate-500">AED</span>{" "}
                <span className="text-sm font-bold">{HOME_COLLECTION_FEE.toFixed(2)}</span>
              </span>
            </div>
            <p className="flex items-center gap-1 pl-[42px] text-xs text-slate-500">
              <Truck className="h-3 w-3 shrink-0" aria-hidden="true" />
              A phlebotomist visits your home
            </p>
          </button>
        )}
      </li>
    </ul>
  );
}
