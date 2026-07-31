import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Modal from "@/components/common/Modal";
import { getApiErrorMessage } from "@/services/api";
import type { Parameter } from "@/types/parameter";
import { parameterFormSchema, type ParameterFormValues } from "@/utils/validation";

interface ParameterFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ParameterFormValues) => Promise<void>;
  initialParameter: Parameter | null;
}

const DEFAULTS: ParameterFormValues = {
  name: "",
  unit: "",
  reference_range: "",
  method: "",
  description: "",
  is_active: true,
};

export default function ParameterFormModal({ open, onClose, onSubmit, initialParameter }: ParameterFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParameterFormValues>({ resolver: zodResolver(parameterFormSchema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    reset(
      initialParameter
        ? {
            name: initialParameter.name,
            unit: initialParameter.unit ?? "",
            reference_range: initialParameter.reference_range ?? "",
            method: initialParameter.method ?? "",
            description: initialParameter.description ?? "",
            is_active: initialParameter.is_active,
          }
        : DEFAULTS
    );
  }, [open, initialParameter, reset]);

  const submitHandler = async (values: ParameterFormValues) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not save the parameter. Please try again."));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialParameter ? "Edit Parameter" : "Add Parameter"}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" noValidate>
        <div>
          <label className="form-label" htmlFor="param-name">Parameter Name</label>
          <input id="param-name" className="form-input" {...register("name")} />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="param-unit">Unit</label>
            <input id="param-unit" className="form-input" placeholder="e.g. mg/dL" {...register("unit")} />
          </div>
          <div>
            <label className="form-label" htmlFor="param-reference">Reference Range</label>
            <input id="param-reference" className="form-input" placeholder="e.g. 13-17" {...register("reference_range")} />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="param-method">Method</label>
          <input id="param-method" className="form-input" placeholder="e.g. Colorimetric" {...register("method")} />
        </div>

        <div>
          <label className="form-label" htmlFor="param-description">Description</label>
          <textarea id="param-description" rows={2} className="form-input" {...register("description")} />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded text-primary-600" {...register("is_active")} />
          Active
        </label>

        {submitError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save Parameter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
