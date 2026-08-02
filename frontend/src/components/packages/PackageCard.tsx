import { CheckCircle2, Eye, Truck, Utensils } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Package } from "@/types/package";
import { iconForCategory } from "@/utils/categoryIcons";
import { categoryStyle } from "@/utils/categoryColors";
import { formatCurrencyParts } from "@/utils/formatters";

interface PackageCardProps {
  pkg: Package;
  onViewDetails: (pkg: Package) => void;
}

export default function PackageCard({ pkg, onViewDetails }: PackageCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.type === "package" && i.id === pkg.id));
  const showToast = useToastStore((s) => s.showToast);
  const Icon = iconForCategory(pkg.category);
  const style = categoryStyle(pkg.category);
  const labPrice = formatCurrencyParts(pkg.lab_price);

  return (
    <div
      className={`card relative flex h-full flex-col p-4 hover:-translate-y-0.5 hover:shadow-hover hover:ring-primary-500/40 sm:p-5 ${pkg.is_featured ? "ring-2 ring-primary-500" : ""}`}
    >
      {pkg.is_featured && (
        <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-accent-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:px-3 sm:text-[11px]">
          Best Value
        </span>
      )}
      <div className="mb-2.5 flex items-center gap-2 sm:mb-3 sm:gap-2.5">
        {pkg.image_url ? (
          <span className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 sm:h-9 sm:w-9">
            <img src={pkg.image_url} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text} sm:h-9 sm:w-9`}>
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          </span>
        )}
        {pkg.category && <span className={`badge w-fit ${style.bg} ${style.text}`}>{pkg.category}</span>}
      </div>
      <h3 className="line-clamp-1 text-base font-bold text-slate-900 sm:text-lg">{pkg.name}</h3>
      {pkg.description && <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">{pkg.description}</p>}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-2.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
          {pkg.tests.length} tests included
        </span>
        {pkg.fasting_required === true && (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
            <Utensils className="h-3 w-3 text-amber-600" aria-hidden="true" />
            Fasting Required
          </span>
        )}
        {pkg.fasting_required === false && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <Utensils className="h-3 w-3 text-emerald-600" aria-hidden="true" />
            Non Fasting
          </span>
        )}
      </div>

      <ul className="custom-scrollbar mt-2 max-h-24 flex-1 space-y-1 overflow-y-auto border-t border-slate-100 pr-2 pt-2 text-xs text-slate-600 sm:mt-2.5 sm:max-h-28 sm:space-y-1.5 sm:pt-2.5">
        {pkg.tests.map((test) => (
          <li key={test.id} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary-500" aria-hidden="true" />
            <span className="uppercase tracking-wide">{test.name}</span>
          </li>
        ))}
      </ul>

      <div className="mt-2.5 flex items-end justify-between border-t border-slate-100 pt-2.5 sm:mt-3 sm:pt-3">
        <div>
          <p className="text-[11px] text-slate-500 sm:text-xs">Price</p>
          <p className="text-slate-900">
            <span className="text-[11px] font-semibold text-slate-500 sm:text-xs">{labPrice.currency}</span>{" "}
            <span className="text-base font-extrabold sm:text-lg">{labPrice.amount}</span>
          </p>
        </div>
        <span className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold text-primary-600">
          <Truck className="h-3 w-3" aria-hidden="true" />
          Home collection available
        </span>
      </div>

      <div className="mt-3 flex gap-2 sm:mt-4">
        <button type="button" onClick={() => onViewDetails(pkg)} className="btn-secondary flex-1 !px-3 !py-2 !text-xs">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Details
        </button>
        <button
          type="button"
          disabled={inCart}
          onClick={() => {
            addItem({
              type: "package",
              id: pkg.id,
              name: pkg.name,
              category: pkg.category,
              labPrice: pkg.lab_price,
              homePrice: pkg.home_price,
              tat: pkg.tat,
              includedTestIds: pkg.tests.map((t) => t.id),
            });
            showToast(`${pkg.name} added to cart`);
          }}
          className={`btn flex-1 !px-3 !py-2 !text-xs text-white ${pkg.is_featured ? "bg-accent-600 hover:bg-accent-700" : "bg-primary-600 hover:bg-primary-700"}`}
        >
          {inCart ? "Added" : "Add to Booking"}
        </button>
      </div>
    </div>
  );
}
