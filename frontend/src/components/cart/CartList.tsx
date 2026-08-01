import { Trash2 } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { itemPrice, useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatters";

export default function CartList() {
  const items = useCartStore((s) => s.items);
  const visitMode = useCartStore((s) => s.visitMode);
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
        const [currency, amount] = formatCurrency(itemPrice(item, visitMode)).split(" ");
        return (
          <li key={`${item.type}-${item.id}`} className="flex items-center justify-between gap-4 py-4">
            <div>
              <span className="badge mb-1.5 bg-slate-100 text-slate-500">
                {item.type === "package" ? "Package" : "Test"}
              </span>
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              {item.category && <p className="text-xs text-slate-500">{item.category}</p>}
            </div>
            <div className="flex items-center gap-3">
              <p className="text-slate-900">
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
    </ul>
  );
}
