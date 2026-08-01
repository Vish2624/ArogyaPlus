import { Clock, Droplet } from "lucide-react";

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
  const showToast = useToastStore((s) => s.showToast);

  if (!test) return null;

  return (
    <Modal
      open={Boolean(test)}
      onClose={onClose}
      title={test.name}
      maxWidthClassName="max-w-xl"
      footer={
        <button
          type="button"
          disabled={inCart}
          onClick={() => {
            addItem({
              type: "test",
              id: test.id,
              name: test.name,
              category: test.category,
              labPrice: test.lab_price,
              homePrice: test.home_price,
            });
            showToast(`${test.name} added to cart`);
            onClose();
          }}
          className="btn-primary w-full"
        >
          {inCart ? "Already in Cart" : "Add to Cart"}
        </button>
      }
    >
      {test.description && <p className="text-sm text-slate-600">{test.description}</p>}

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
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">Lab Visit Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(test.lab_price)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Home Visit Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(test.home_price)}</p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-900">Parameters Included ({test.parameters.length})</h4>
        {test.parameters.length > 0 ? (
          <ul className="custom-scrollbar mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
            {test.parameters.map((parameter) => (
              <li key={parameter.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{parameter.name}</span>
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
