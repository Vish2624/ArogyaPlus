import { Clock, Truck, Utensils } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Test } from "@/types/test";
import { categoryStyle } from "@/utils/categoryColors";
import { iconForCategory } from "@/utils/categoryIcons";
import { percentOff } from "@/utils/discount";
import { formatCurrencyParts } from "@/utils/formatters";

interface TestCardProps {
  test: Test;
}

export default function TestCard({ test }: TestCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.type === "test" && i.id === test.id));
  const includingPackage = useCartStore((s) => s.getIncludingPackage(test.id));
  const showToast = useToastStore((s) => s.showToast);
  const Icon = iconForCategory(test.category);
  const style = categoryStyle(test.category);
  const labPrice = formatCurrencyParts(test.lab_price);
  const originalLabPrice = test.original_lab_price ? formatCurrencyParts(test.original_lab_price) : null;
  const off = percentOff(test.lab_price, test.original_lab_price);

  return (
    <div className="card flex flex-col p-4 hover:-translate-y-0.5 hover:shadow-hover hover:ring-primary-500/40 sm:p-5">
      <div className="mb-2 flex items-center gap-2 sm:mb-2.5 sm:gap-2.5">
        {test.image_url ? (
          <span className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 sm:h-9 sm:w-9">
            <img src={test.image_url} alt={test.name} loading="lazy" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text} sm:h-9 sm:w-9`}>
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          </span>
        )}
        {test.category && <span className={`badge w-fit ${style.bg} ${style.text}`}>{test.category}</span>}
      </div>
      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{test.name}</h3>
      {test.tat && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary-700">
          <Clock className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
          Report in {test.tat}
        </p>
      )}
      {test.fasting_required === true && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-700">
          <Utensils className="h-3 w-3 text-amber-600" aria-hidden="true" />
          Fasting Required
        </p>
      )}
      {test.fasting_required === false && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Utensils className="h-3 w-3 text-emerald-600" aria-hidden="true" />
          Non Fasting
        </p>
      )}

      {test.parameters.length > 0 && (
        <p className="mt-1.5 text-xs text-slate-500">
          {test.parameters.length} {test.parameters.length === 1 ? "parameter" : "parameters"} included
        </p>
      )}

      <div className="mt-2.5 flex items-end justify-between border-t border-slate-100 pt-2 sm:mt-3 sm:pt-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-slate-500">Price</p>
            {off !== null && (
              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold leading-none text-emerald-600">
                {off}% Off
              </span>
            )}
          </div>
          <p className="mt-1 flex items-baseline gap-1.5 text-slate-900">
            {originalLabPrice && (
              <span className="text-xs text-slate-400 line-through">
                {originalLabPrice.currency} {originalLabPrice.amount}
              </span>
            )}
            <span>
              <span className="text-xs font-semibold text-slate-500">{labPrice.currency}</span>{" "}
              <span className="text-base font-bold">{labPrice.amount}</span>
            </span>
          </p>
        </div>
        <span className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold text-primary-600">
          <Truck className="h-3 w-3" aria-hidden="true" />
          Home collection available
        </span>
      </div>

      <div className="mt-auto pt-3">
        <button
          type="button"
          disabled={inCart || !!includingPackage}
          onClick={() => {
            addItem({
              type: "test",
              id: test.id,
              name: test.name,
              category: test.category,
              labPrice: test.lab_price,
              homePrice: test.home_price,
              tat: test.tat,
            });
            showToast(`${test.name} added to cart`);
          }}
          className="btn-primary w-full !py-2 !text-xs"
        >
          {inCart ? "Added" : includingPackage ? "In Package" : "Add to Booking"}
        </button>
        {includingPackage && (
          <p className="mt-1 text-center text-[11px] text-slate-400">
            Included in &ldquo;{includingPackage.name}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
