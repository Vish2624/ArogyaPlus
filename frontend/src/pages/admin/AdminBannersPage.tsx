import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import BannerFormModal from "@/components/admin/BannerFormModal";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import { adminCreateBanner, adminDeleteBanner, adminListBanners, adminUpdateBanner } from "@/services/bannerService";
import type { Banner, BannerInput } from "@/types/banner";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const loadBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      setBanners(await adminListBanners());
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load banners. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const handleSubmit = async (values: BannerInput) => {
    if (editingBanner) {
      const updated = await adminUpdateBanner(editingBanner.id, values);
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } else {
      const created = await adminCreateBanner(values);
      setBanners((prev) => [...prev, created]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (banner: Banner) => {
    if (!window.confirm("Delete this banner? This cannot be undone.")) return;
    try {
      await adminDeleteBanner(banner.id);
      setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not delete this banner."));
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const updated = await adminUpdateBanner(banner.id, { is_active: !banner.is_active });
      setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not update this banner."));
    }
  };

  const atLimit = banners.length >= 3;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the promotional banner strip shown on the home page.{" "}
            <span className="font-medium text-slate-700">{banners.length}/3 banners used.</span>
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          disabled={atLimit}
          title={atLimit ? "Maximum of 3 banners allowed. Delete one to add another." : undefined}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Banner
        </button>
      </div>
      {atLimit && (
        <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
          Banner limit reached (3/3). Delete an existing banner to add a new one.
        </p>
      )}

      <div className="mt-6">
        {loading && <Spinner label="Loading banners..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadBanners} />}
        {!loading && !error && banners.length === 0 && (
          <EmptyState title="No banners yet" description="Add your first promotional banner to get started." />
        )}
        {!loading && !error && banners.length > 0 && (
          <div className="card overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <img src={banner.image_url} alt={banner.title ?? ""} className="h-12 w-20 rounded object-cover" />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{banner.title || "-"}</td>
                    <td className="px-4 py-3 text-slate-500">{banner.display_order}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(banner)}
                        className={`badge ${banner.is_active ? "bg-accent-500/10 text-accent-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {banner.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEditModal(banner)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700" aria-label="Edit banner">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(banner)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete banner">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BannerFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialBanner={editingBanner} />
    </div>
  );
}
