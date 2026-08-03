import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";

import Modal from "@/components/common/Modal";
import { getApiErrorMessage } from "@/services/api";
import { uploadImage } from "@/services/uploadService";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test";
import { PACKAGE_CATEGORIES } from "@/utils/constants";
import { packageFormSchema, type PackageFormValues } from "@/utils/validation";

interface PackageFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PackageFormValues) => Promise<void>;
  initialPackage: Package | null;
  allTests: Test[];
}

const DEFAULTS: PackageFormValues = {
  name: "",
  description: "",
  category: "",
  image_url: "",
  lab_price: 0,
  home_price: 0,
  original_lab_price: undefined,
  original_home_price: undefined,
  tat: "",
  fasting_required: null,
  is_active: true,
  is_featured: false,
  test_ids: [],
};

export default function PackageFormModal({ open, onClose, onSubmit, initialPackage, allTests }: PackageFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [testSearch, setTestSearch] = useState("");
  const [pinnedTestIds, setPinnedTestIds] = useState<Set<number>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormValues>({ resolver: zodResolver(packageFormSchema), defaultValues: DEFAULTS });

  const imageUrl = watch("image_url");
  const fastingRequired = watch("fasting_required");

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    setTestSearch("");
    setPinnedTestIds(new Set(initialPackage?.tests.map((t) => t.id) ?? []));
    reset(
      initialPackage
        ? {
            name: initialPackage.name,
            description: initialPackage.description ?? "",
            category: initialPackage.category ?? "",
            image_url: initialPackage.image_url ?? "",
            lab_price: initialPackage.lab_price,
            home_price: initialPackage.home_price,
            original_lab_price: initialPackage.original_lab_price ?? undefined,
            original_home_price: initialPackage.original_home_price ?? undefined,
            tat: initialPackage.tat ?? "",
            fasting_required: initialPackage.fasting_required ?? null,
            is_active: initialPackage.is_active,
            is_featured: initialPackage.is_featured,
            test_ids: initialPackage.tests.map((t) => t.id),
          }
        : DEFAULTS
    );
  }, [open, initialPackage, reset]);

  const fullTestList = useMemo(() => {
    const byId = new Map(allTests.map((t) => [t.id, t]));
    for (const t of initialPackage?.tests ?? []) {
      if (!byId.has(t.id)) byId.set(t.id, t);
    }
    return Array.from(byId.values());
  }, [allTests, initialPackage]);

  const filteredTests = useMemo(() => {
    const term = testSearch.trim().toLowerCase();
    const list = term ? fullTestList.filter((t) => t.name.toLowerCase().includes(term)) : fullTestList;
    return [...list].sort((a, b) => {
      const aPinned = pinnedTestIds.has(a.id);
      const bPinned = pinnedTestIds.has(b.id);
      if (aPinned !== bPinned) return aPinned ? -1 : 1;
      return 0;
    });
  }, [fullTestList, testSearch, pinnedTestIds]);

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

  const submitHandler = async (values: PackageFormValues) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not save the package. Please try again."));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialPackage ? "Edit Package" : "Add Package"} maxWidthClassName="max-w-xl">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" noValidate>
        <div>
          <label className="form-label" htmlFor="pkg-name">Package Name</label>
          <input id="pkg-name" className="form-input" {...register("name")} />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="form-label" htmlFor="pkg-description">Description</label>
          <textarea id="pkg-description" rows={2} className="form-input" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="pkg-category">Category</label>
            <input id="pkg-category" className="form-input" list="pkg-category-options" placeholder="Select or type a category" {...register("category")} />
            <datalist id="pkg-category-options">
              {PACKAGE_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <label className="form-label" htmlFor="pkg-image">Icon Image</label>
            <p className="mb-1.5 text-xs text-slate-500">
              Shown as this package's icon on the public site, instead of the generic category icon.
            </p>
            <input id="pkg-image" className="form-input" placeholder="https://..." {...register("image_url")} />
            <div className="mt-1.5 flex items-center gap-2">
              {imageUrl && <img src={imageUrl} alt="Package icon preview" className="h-8 w-8 rounded-full object-cover" />}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="pkg-lab-price">Lab Visit Price (AED)</label>
            <input id="pkg-lab-price" type="number" step="0.01" min={0} className="form-input" {...register("lab_price")} />
            {errors.lab_price && <p className="form-error">{errors.lab_price.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="pkg-home-price">Home Visit Price (AED)</label>
            <input id="pkg-home-price" type="number" step="0.01" min={0} className="form-input" {...register("home_price")} />
            {errors.home_price && <p className="form-error">{errors.home_price.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="pkg-original-lab-price">Original Lab Price (optional)</label>
            <p className="mb-1.5 text-xs text-slate-500">
              Set this higher than the Lab Visit Price to show a strikethrough discount badge on the public site.
            </p>
            <input id="pkg-original-lab-price" type="number" step="0.01" min={0} className="form-input" {...register("original_lab_price")} />
            {errors.original_lab_price && <p className="form-error">{errors.original_lab_price.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="pkg-tat">Report Time</label>
            <input id="pkg-tat" className="form-input" placeholder="e.g. 24 hours" {...register("tat")} />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="pkg-fasting">Fasting Requirement</label>
          <select
            id="pkg-fasting"
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

        <div>
          <span className="form-label">Included Tests</span>
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              placeholder="Search tests..."
              className="form-input pl-9"
            />
          </div>
          <Controller
            name="test_ids"
            control={control}
            render={({ field }) => (
              <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {fullTestList.length === 0 && <p className="text-xs text-slate-500">No tests available yet.</p>}
                {fullTestList.length > 0 && filteredTests.length === 0 && (
                  <p className="text-xs text-slate-500">No tests match your search.</p>
                )}
                {filteredTests.map((test) => {
                  const checked = field.value.includes(test.id);
                  return (
                    <label key={test.id} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded text-primary-600"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) field.onChange([...field.value, test.id]);
                          else field.onChange(field.value.filter((id) => id !== test.id));
                        }}
                      />
                      {test.name}
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded text-primary-600" {...register("is_active")} />
            Active (visible on the public website)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded text-primary-600" {...register("is_featured")} />
            Mark as Most Popular
          </label>
        </div>

        {submitError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save Package"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
