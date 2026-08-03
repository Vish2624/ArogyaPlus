import { CheckCircle2, ChevronDown, ChevronUp, Clock, FlaskConical, Utensils } from "lucide-react";
import { useState } from "react";

import Modal from "@/components/common/Modal";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Package } from "@/types/package";
import { formatCurrency } from "@/utils/formatters";

interface PackageDetailModalProps {
  pkg: Package | null;
  onClose: () => void;
}

export default function PackageDetailModal({ pkg, onClose }: PackageDetailModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => (pkg ? s.items.some((i) => i.type === "package" && i.id === pkg.id) : false));
  const showToast = useToastStore((s) => s.showToast);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  if (!pkg) return null;

  const totalParameters = new Set(pkg.tests.flatMap((test) => test.parameters.map((p) => p.id))).size;

  return (
    <Modal
      open={Boolean(pkg)}
      onClose={onClose}
      title={pkg.name}
      maxWidthClassName="max-w-xl"
      footer={
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
            onClose();
          }}
          className="btn-primary w-full"
        >
          {inCart ? "Already in Cart" : "Add to Cart"}
        </button>
      }
    >
      {pkg.description && (
        <div className="custom-scrollbar max-h-28 overflow-y-auto pr-1">
          <p className="text-sm leading-relaxed text-slate-600">{pkg.description}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {pkg.tat && (
          <span className="badge gap-1.5 border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
            <Clock className="h-4 w-4 text-primary-600" aria-hidden="true" />
            Report in {pkg.tat}
          </span>
        )}
        {pkg.fasting_required === true && (
          <span className="badge gap-1.5 border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            <Utensils className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Fasting Required
          </span>
        )}
        {pkg.fasting_required === false && (
          <span className="badge gap-1.5 border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <Utensils className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Non Fasting
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(pkg.lab_price)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-primary-600">Home collection available</p>
          <p className="text-xs text-slate-500">+AED 75 flat fee</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900">Included Tests ({pkg.tests.length})</h4>
          <span className="badge gap-1.5 border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Total Parameters ({totalParameters})
          </span>
        </div>
        <ul className="custom-scrollbar mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
          {pkg.tests.map((test) => {
            const isExpanded = expandedTestId === test.id;
            return (
              <li
                key={test.id}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  isExpanded ? "border-primary-200 bg-primary-50/30" : "border-slate-200 hover:border-primary-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left hover:bg-primary-50/40"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold text-slate-900">{test.name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                    {test.parameters.length} parameter{test.parameters.length === 1 ? "" : "s"}
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </span>
                </button>
                {isExpanded && (
                  <div className="space-y-2 border-t border-primary-100 bg-white px-3.5 py-3">
                    {test.sample_type && (
                      <p className="text-xs text-slate-500">
                        Sample type: <span className="font-semibold text-slate-700">{test.sample_type}</span>
                      </p>
                    )}
                    {test.parameters.length > 0 ? (
                      <ul className="space-y-1">
                        {test.parameters.map((parameter) => (
                          <li key={parameter.id} className="py-0.5 text-xs">
                            <span className="font-semibold text-slate-800">{parameter.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">No parameters listed for this test.</p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
