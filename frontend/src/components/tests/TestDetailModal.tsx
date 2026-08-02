import { Clock, Droplet, Utensils } from "lucide-react";

import Modal from "@/components/common/Modal";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Test } from "@/types/test";
import { formatCurrency } from "@/utils/formatters";

interface TestDetailModalProps {
  test: Test | null;
  onClose: () => void;
}

export default function TestDetailModal({ test, onClose }: TestDetailModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) => (test ? s.items.some((i) => i.type === "test" && i.id === test.id) : false));
  const includingPackage = useCartStore((s) => (test ? s.getIncludingPackage(test.id) : undefined));
  const showToast = useToastStore((s) => s.showToast);

  if (!test) return null;

  return (
    <Modal
      open={Boolean(test)}
      onClose={onClose}
      title={test.name}
      maxWidthClassName="max-w-xl"
      footer={
        <div>
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
              onClose();
            }}
            className="btn-primary w-full"
          >
            {inCart ? "Already in Cart" : includingPackage ? "Included in Package" : "Add to Cart"}
          </button>
          {includingPackage && (
            <p className="mt-2 text-center text-xs text-slate-500">
              Already included in &ldquo;{includingPackage.name}&rdquo;
            </p>
          )}
        </div>
      }
    >
      {test.description && (
        <div className="custom-scrollbar max-h-28 overflow-y-auto pr-1">
          <p className="text-sm leading-relaxed text-slate-600">{test.description}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        {test.tat && (
          <span className="badge gap-1.5 border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
            <Clock className="h-4 w-4 text-primary-600" aria-hidden="true" />
            Report in {test.tat}
          </span>
        )}
        {test.sample_type && (
          <span className="flex items-center gap-1.5">
            <Droplet className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
            Sample: {test.sample_type}
          </span>
        )}
        {test.fasting_required === true && (
          <span className="badge gap-1.5 border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            <Utensils className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            Fasting Required
          </span>
        )}
        {test.fasting_required === false && (
          <span className="badge gap-1.5 border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <Utensils className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            Non Fasting
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(test.lab_price)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-primary-600">Home collection available</p>
          <p className="text-xs text-slate-500">+AED 75 flat fee</p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">Parameters Included ({test.parameters.length})</h4>
        {test.parameters.length > 0 ? (
          <ul className="custom-scrollbar mt-2 max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {test.parameters.map((parameter) => (
              <li
                key={parameter.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3.5 py-2.5 text-sm"
              >
                <span className="font-medium text-slate-900">{parameter.name}</span>
                {(parameter.unit || parameter.reference_range) && (
                  <span className="shrink-0 text-xs text-slate-500">
                    {[parameter.unit, parameter.reference_range].filter(Boolean).join(" · ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No parameters listed for this test.</p>
        )}
      </div>
    </Modal>
  );
}
