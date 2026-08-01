import { CheckCircle2, ChevronDown, ChevronUp, Clock } from "lucide-react";
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
      {pkg.description && <p className="text-sm text-slate-600">{pkg.description}</p>}

      {pkg.tat && (
        <div className="badge mt-3 gap-1.5 border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
          <Clock className="h-4 w-4 text-primary-600" aria-hidden="true" />
          Report in {pkg.tat}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">Lab Visit Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(pkg.lab_price)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Home Visit Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(pkg.home_price)}</p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">Included Tests ({pkg.tests.length})</h4>
        <ul className="custom-scrollbar mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {pkg.tests.map((test) => {
            const isExpanded = expandedTestId === test.id;
            return (
              <li key={test.id} className="rounded-lg border border-slate-100">
                <button
                  type="button"
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                    {test.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-normal text-slate-500">
                    {test.parameters.length} parameter{test.parameters.length === 1 ? "" : "s"}
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </span>
                </button>
                {isExpanded && (
                  <div className="space-y-2 border-t border-slate-100 px-3 py-2">
                    {test.sample_type && (
                      <p className="text-xs text-slate-500">
                        Sample type: <span className="font-semibold text-slate-700">{test.sample_type}</span>
                      </p>
                    )}
                    {test.parameters.length > 0 ? (
                      <ul className="space-y-1">
                        {test.parameters.map((parameter) => (
                          <li key={parameter.id} className="flex items-center justify-between gap-2 py-0.5 text-xs text-slate-600">
                            <span>{parameter.name}</span>
                            {(parameter.unit || parameter.reference_range) && (
                              <span className="shrink-0 text-slate-400">
                                {[parameter.unit, parameter.reference_range].filter(Boolean).join(" · ")}
                              </span>
                            )}
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
