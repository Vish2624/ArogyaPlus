import { CheckCircle2, Eye } from "lucide-react";

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
  const homePrice = formatCurrencyParts(pkg.home_price);

  const VISIBLE_TEST_ROWS = 3;
  const hasMoreTests = pkg.tests.length > VISIBLE_TEST_ROWS;

  return (
    <div
      className={`card relative flex h-full flex-col p-5 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-hover hover:ring-primary-500/40 ${pkg.is_featured ? "ring-2 ring-primary-500" : ""}`}
    >
      {pkg.is_featured && (
        <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-primary-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Most Popular
        </span>
      )}
      <div className="mb-3 flex items-center gap-2.5">
        {pkg.image_url ? (
          <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200">
            <img src={pkg.image_url} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        {pkg.category && <span className={`badge w-fit ${style.bg} ${style.text}`}>{pkg.category}</span>}
      </div>
      <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{pkg.name}</h3>
      {pkg.description && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{pkg.description}</p>}

      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <CheckCircle2 className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
        {pkg.tests.length} tests included
      </div>

      <ul className="custom-scrollbar mt-2.5 max-h-28 flex-1 space-y-1.5 overflow-y-auto border-t border-slate-100 pr-2 pt-2.5 text-xs text-slate-600">
        {pkg.tests.map((test) => (
          <li key={test.id} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary-500" aria-hidden="true" />
            <span className="uppercase tracking-wide">{test.name}</span>
          </li>
        ))}
      </ul>
      {hasMoreTests && (
        <p className="mt-1 text-[11px] font-semibold text-primary-600">
          +{pkg.tests.length - VISIBLE_TEST_ROWS} more — scroll to see all
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs text-slate-500">Lab Visit</p>
          <p className="text-slate-900">
            <span className="text-xs font-semibold text-slate-500">{labPrice.currency}</span>{" "}
            <span className="text-lg font-extrabold">{labPrice.amount}</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Home Visit</p>
          <p className="text-slate-900">
            <span className="text-xs font-semibold text-slate-500">{homePrice.currency}</span>{" "}
            <span className="text-lg font-extrabold">{homePrice.amount}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
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
            });
            showToast(`${pkg.name} added to cart`);
          }}
          className="btn-primary flex-1 !px-3 !py-2 !text-xs"
        >
          {inCart ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
