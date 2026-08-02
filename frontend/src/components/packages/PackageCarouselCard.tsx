import { CheckCircle2, Eye } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Package } from "@/types/package";
import { categoryStyle } from "@/utils/categoryColors";
import { iconForCategory } from "@/utils/categoryIcons";
import { percentOff } from "@/utils/discount";
import { formatCurrencyParts } from "@/utils/formatters";

interface PackageCarouselCardProps {
  pkg: Package;
  onViewDetails: (pkg: Package) => void;
}

export default function PackageCarouselCard({ pkg, onViewDetails }: PackageCarouselCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => s.items.some((i) => i.type === "package" && i.id === pkg.id));
  const showToast = useToastStore((s) => s.showToast);
  const off = percentOff(pkg.lab_price, pkg.original_lab_price);
  const price = formatCurrencyParts(pkg.lab_price);
  const originalPrice = pkg.original_lab_price ? formatCurrencyParts(pkg.original_lab_price) : null;
  const Icon = iconForCategory(pkg.category);
  const style = categoryStyle(pkg.category);

  const VISIBLE_TEST_ROWS = 3;
  const hasMoreTests = pkg.tests.length > VISIBLE_TEST_ROWS;

  return (
    <div
      className={`card relative flex h-full flex-col p-4 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-hover hover:ring-primary-500/40 sm:p-6 ${
        pkg.is_featured ? "ring-2 ring-primary-500" : ""
      }`}
    >
      <div className="mb-2.5 flex items-start justify-between sm:mb-3">
        {pkg.image_url ? (
          <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 sm:h-10 sm:w-10">
            <img src={pkg.image_url} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text} sm:h-10 sm:w-10`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </span>
        )}
        {pkg.is_featured && (
          <span className="whitespace-nowrap rounded-full bg-accent-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white sm:px-3 sm:py-1.5 sm:text-[10px]">
            Best Value
          </span>
        )}
      </div>

      <h3 className="line-clamp-2 text-base font-bold leading-tight text-slate-900 sm:line-clamp-1 sm:text-lg">{pkg.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
        {pkg.description || `${pkg.tests.length}+ Key Health Markers`}
      </p>

      <div className="mt-2.5 flex flex-wrap items-end gap-x-2 gap-y-1 sm:mt-3">
        {originalPrice && (
          <span className="text-xs text-slate-400 line-through">
            {originalPrice.currency} {originalPrice.amount}
          </span>
        )}
        <span className="text-slate-900">
          <span className="text-xs font-semibold text-slate-500 sm:text-sm">{price.currency}</span>{" "}
          <span className="text-xl font-extrabold sm:text-2xl">{price.amount}</span>
        </span>
        {off !== null && (
          <span className="mb-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
            {off}% Off
          </span>
        )}
      </div>

      <ul className="custom-scrollbar mt-2.5 max-h-24 flex-1 space-y-1 overflow-y-auto border-t border-slate-100 pr-2 pt-2.5 text-xs text-slate-600 sm:mt-3 sm:max-h-28 sm:space-y-1.5 sm:pt-3">
        {pkg.tests.map((test) => (
          <li key={test.id} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary-500" aria-hidden="true" />
            <span className="uppercase tracking-wide">{test.name}</span>
          </li>
        ))}
      </ul>
      {hasMoreTests && (
        <p className="mt-1 text-[11px] font-semibold text-primary-600">
          +{pkg.tests.length - VISIBLE_TEST_ROWS} more — scroll to see all {pkg.tests.length} tests
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-2.5 sm:mt-4 sm:pt-3">
        <button
          type="button"
          onClick={() => onViewDetails(pkg)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-700"
        >
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
            });
            showToast(`${pkg.name} added to cart`);
          }}
          className={`btn flex-1 !px-3 !text-xs text-white ${
            pkg.is_featured ? "bg-accent-600 hover:bg-accent-700" : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {inCart ? "Added" : "Add to Booking"}
        </button>
      </div>
    </div>
  );
}
