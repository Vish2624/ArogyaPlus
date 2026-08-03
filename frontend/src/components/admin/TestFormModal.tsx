import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import Modal from "@/components/common/Modal";
import { getApiErrorMessage } from "@/services/api";
import { adminListParameters } from "@/services/parameterService";
import { uploadImage } from "@/services/uploadService";
import type { Parameter } from "@/types/parameter";
import type { Test } from "@/types/test";
import { TEST_CATEGORIES } from "@/utils/constants";
import { testFormSchema, type TestFormValues } from "@/utils/validation";

interface TestFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TestFormValues, parameterIds: number[]) => Promise<void>;
  initialTest: Test | null;
}

const SAMPLE_TYPE_SUGGESTIONS = ["EDTA", "Serum", "Plasma", "Fasting", "Urine", "Whole Blood", "Fluoride", "Citrate"];

const DEFAULTS: TestFormValues = {
  name: "",
  description: "",
  category: "",
  sample_type: "",
  image_url: "",
  lab_price: 0,
  home_price: 0,
  original_lab_price: undefined,
  original_home_price: undefined,
  tat: "",
  fasting_required: null,
  is_active: true,
};

export default function TestFormModal({ open, onClose, onSubmit, initialTest }: TestFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [catalog, setCatalog] = useState<Parameter[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set());
  const [paramSearch, setParamSearch] = useState("");
  const [paramError, setParamError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestFormValues>({ resolver: zodResolver(testFormSchema), defaultValues: DEFAULTS });

  const imageUrl = watch("image_url");
  const fastingRequired = watch("fasting_required");

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    setParamSearch("");
    setParamError(false);
    const initialIds = new Set(initialTest?.parameters.map((p) => p.id) ?? []);
    setSelectedIds(initialIds);
    setPinnedIds(initialIds);
    reset(
      initialTest
        ? {
            name: initialTest.name,
            description: initialTest.description ?? "",
            category: initialTest.category ?? "",
            sample_type: initialTest.sample_type ?? "",
            image_url: initialTest.image_url ?? "",
            lab_price: initialTest.lab_price,
            home_price: initialTest.home_price,
            original_lab_price: initialTest.original_lab_price ?? undefined,
            original_home_price: initialTest.original_home_price ?? undefined,
            tat: initialTest.tat ?? "",
            fasting_required: initialTest.fasting_required ?? null,
            is_active: initialTest.is_active,
          }
        : DEFAULTS
    );
  }, [open, initialTest, reset]);

  useEffect(() => {
    if (!open) return;
    setCatalogLoading(true);
    adminListParameters()
      .then(setCatalog)
      .finally(() => setCatalogLoading(false));
  }, [open]);

  const fullCatalog = useMemo(() => {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    for (const p of initialTest?.parameters ?? []) {
      if (!byId.has(p.id)) byId.set(p.id, p);
    }
    return Array.from(byId.values());
  }, [catalog, initialTest]);

  const filteredCatalog = useMemo(() => {
    const term = paramSearch.trim().toLowerCase();
    const list = term ? fullCatalog.filter((p) => p.name.toLowerCase().includes(term)) : fullCatalog;
    return [...list].sort((a, b) => {
      const aPinned = pinnedIds.has(a.id);
      const bPinned = pinnedIds.has(b.id);
      if (aPinned !== bPinned) return aPinned ? -1 : 1;
      return 0;
    });
  }, [fullCatalog, paramSearch, pinnedIds]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSubmitError(null);
    try {
      const url = await uploadImage(file);
      setValue("image_url", url);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not upload the image."));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleParameter = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size > 0) setParamError(false);
      return next;
    });
  };

  const submitHandler = async (values: TestFormValues) => {
    setSubmitError(null);
    if (selectedIds.size === 0) {
      setParamError(true);
      return;
    }
    setParamError(false);
    try {
      await onSubmit(values, Array.from(selectedIds));
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not save the test. Please try again."));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialTest ? "Edit Test" : "Add Test"}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" noValidate>
        <div>
          <label className="form-label" htmlFor="test-name">Test Name</label>
          <input id="test-name" className="form-input" {...register("name")} />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="form-label" htmlFor="test-description">Description</label>
          <textarea id="test-description" rows={2} className="form-input" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="test-category">Category</label>
            <input id="test-category" className="form-input" list="test-category-options" placeholder="Select or type a category" {...register("category")} />
            <datalist id="test-category-options">
              {TEST_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="form-label" htmlFor="test-tat">Report TAT</label>
            <input id="test-tat" className="form-input" placeholder="e.g. 24 hours" {...register("tat")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="test-sample-type">Sample Type</label>
            <input
              id="test-sample-type"
              className="form-input"
              list="sample-type-suggestions"
              placeholder="e.g. EDTA, Serum, Fasting"
              {...register("sample_type")}
            />
            <datalist id="sample-type-suggestions">
              {SAMPLE_TYPE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="form-label" htmlFor="test-fasting">Fasting Requirement</label>
            <select
              id="test-fasting"
              className="form-input"
              value={fastingRequired === true ? "fasting_required" : fastingRequired === false ? "non_fasting" : ""}
              onChange={(e) => {
                const v = e.target.value;
                setValue("fasting_required", v === "fasting_required" ? true : v === "non_fasting" ? false : null);
              }}
            >
              <option value="">— Not specified —</option>
              <option value="fasting_required">Fasting Required</option>
              <option value="non_fasting">Non Fasting</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="test-image">Icon Image</label>
          <p className="mb-1.5 text-xs text-slate-500">
            Shown as this test's icon on the public site, instead of the generic category icon.
          </p>
          <input id="test-image" className="form-input" placeholder="https://..." {...register("image_url")} />
          <div className="mt-1.5 flex items-center gap-2">
            {imageUrl && (
              <img src={imageUrl} alt="Test icon preview" className="h-8 w-8 rounded-full object-cover" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="text-xs"
            />
            {uploading && <span className="text-xs text-slate-500">Uploading...</span>}
          </div>
        </div>

        <div>
          <label className="form-label">
            Parameters Included <span className="text-red-500">*</span>{" "}
            {selectedIds.size > 0 && <span className="font-normal text-slate-500">({selectedIds.size} selected)</span>}
          </label>
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={paramSearch}
              onChange={(e) => setParamSearch(e.target.value)}
              placeholder="Search parameters..."
              className="form-input pl-9"
            />
          </div>
          <div className={`max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2 ${paramError ? "border-red-300" : "border-slate-200"}`}>
            {catalogLoading && <p className="px-2 py-3 text-center text-sm text-slate-500">Loading parameters...</p>}
            {!catalogLoading && filteredCatalog.length === 0 && (
              <p className="px-2 py-3 text-center text-sm text-slate-500">No parameters found.</p>
            )}
            {!catalogLoading &&
              filteredCatalog.map((param) => (
                <label
                  key={param.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0 rounded text-primary-600"
                      checked={selectedIds.has(param.id)}
                      onChange={() => toggleParameter(param.id)}
                    />
                    <span className="truncate text-sm font-medium text-slate-800">{param.name}</span>
                  </span>
                  {param.unit && <span className="shrink-0 text-xs text-slate-500">{param.unit}</span>}
                </label>
              ))}
          </div>
          {paramError && <p className="form-error">Select at least one parameter.</p>}
          <p className="mt-1 text-xs text-slate-400">
            Manage the master parameter list under Admin → Parameters.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="test-lab-price">Lab Visit Price (AED)</label>
            <input id="test-lab-price" type="number" step="0.01" min={0} className="form-input" {...register("lab_price")} />
            {errors.lab_price && <p className="form-error">{errors.lab_price.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="test-home-price">Home Visit Price (AED)</label>
            <input id="test-home-price" type="number" step="0.01" min={0} className="form-input" {...register("home_price")} />
            {errors.home_price && <p className="form-error">{errors.home_price.message}</p>}
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="test-original-lab-price">Original Lab Price (optional)</label>
          <p className="mb-1.5 text-xs text-slate-500">
            Set this higher than the Lab Visit Price to show a strikethrough discount badge on the public site.
          </p>
          <input id="test-original-lab-price" type="number" step="0.01" min={0} className="form-input" {...register("original_lab_price")} />
          {errors.original_lab_price && <p className="form-error">{errors.original_lab_price.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded text-primary-600" {...register("is_active")} />
          Active (visible on the public website)
        </label>

        {submitError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save Test"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
