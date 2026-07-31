import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import Modal from "@/components/common/Modal";
import { getApiErrorMessage } from "@/services/api";
import { uploadImage } from "@/services/uploadService";
import type { Banner, BannerInput } from "@/types/banner";

interface BannerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BannerInput) => Promise<void>;
  initialBanner: Banner | null;
}

const DEFAULTS: BannerInput = {
  image_url: "",
  title: "",
  subtitle: "",
  tags: "",
  link_url: "",
  display_order: 1,
  is_active: true,
};

export default function BannerFormModal({ open, onClose, onSubmit, initialBanner }: BannerFormModalProps) {
  const [values, setValues] = useState<BannerInput>(DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    setValues(
      initialBanner
        ? {
            image_url: initialBanner.image_url,
            title: initialBanner.title ?? "",
            subtitle: initialBanner.subtitle ?? "",
            tags: initialBanner.tags ?? "",
            link_url: initialBanner.link_url ?? "",
            display_order: initialBanner.display_order,
            is_active: initialBanner.is_active,
          }
        : DEFAULTS
    );
  }, [open, initialBanner]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSubmitError(null);
    try {
      const url = await uploadImage(file);
      setValues((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not upload the image."));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.image_url) {
      setSubmitError("Please upload a banner image.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Could not save the banner. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialBanner ? "Edit Banner" : "Add Banner"} maxWidthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="form-label">Banner Image</span>
          {values.image_url && (
            <img src={values.image_url} alt="Banner preview" className="mb-2 h-32 w-full rounded-lg object-cover" />
          )}
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="text-sm" />
          {uploading && <p className="mt-1 text-xs text-slate-500">Uploading...</p>}
        </div>

        <div>
          <label className="form-label" htmlFor="banner-title">Title (optional)</label>
          <input
            id="banner-title"
            className="form-input"
            value={values.title ?? ""}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="banner-subtitle">Subtitle (optional)</label>
          <input
            id="banner-subtitle"
            className="form-input"
            value={values.subtitle ?? ""}
            onChange={(e) => setValues({ ...values, subtitle: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="banner-tags">Tags (comma-separated, optional)</label>
          <input
            id="banner-tags"
            className="form-input"
            placeholder="e.g. 118 Parameters, Heart, Liver"
            value={values.tags ?? ""}
            onChange={(e) => setValues({ ...values, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="banner-link">Link URL (optional)</label>
          <input
            id="banner-link"
            className="form-input"
            placeholder="https://..."
            value={values.link_url ?? ""}
            onChange={(e) => setValues({ ...values, link_url: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="banner-order">Display Order</label>
            <input
              id="banner-order"
              type="number"
              min={1}
              className="form-input"
              value={values.display_order}
              onChange={(e) => setValues({ ...values, display_order: Number(e.target.value) || 1 })}
            />
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded text-primary-600"
                checked={values.is_active}
                onChange={(e) => setValues({ ...values, is_active: e.target.checked })}
              />
              Active (visible on the public website)
            </label>
          </div>
        </div>

        {submitError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting || uploading} className="btn-primary">
            {submitting ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
