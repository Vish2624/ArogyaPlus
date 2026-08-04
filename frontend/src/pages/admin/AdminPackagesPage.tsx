import { GripVertical, ListTree, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PackageFormModal from "@/components/admin/PackageFormModal";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import {
  adminCreatePackage,
  adminDeletePackage,
  adminListPackagesPaginated,
  adminReorderPackages,
  adminUpdatePackage,
} from "@/services/packageService";
import { adminListTests } from "@/services/testService";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test";
import { formatCurrency } from "@/utils/formatters";
import type { PackageFormValues } from "@/utils/validation";

const PAGE_SIZE = 10;

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const loadPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListPackagesPaginated({
        search: search.trim() || undefined,
        page,
        page_size: PAGE_SIZE,
      });
      setPackages(data.items);
      setTotalPages(data.total_pages);
      setTotalRows(data.total_rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load packages. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = search ? 300 : 0;
    const timeout = setTimeout(loadPackages, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  // One-time full-catalogue fetch feeding the "included tests" picker in the add/edit modal —
  // unrelated to the paginated table above, so it doesn't refetch when the page changes.
  useEffect(() => {
    adminListTests().then(setAllTests);
  }, []);

  const openAddModal = () => {
    setEditingPackage(null);
    setModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingPackage(pkg);
    setModalOpen(true);
  };

  const handleSubmit = async (values: PackageFormValues) => {
    if (editingPackage) {
      const updated = await adminUpdatePackage(editingPackage.id, values);
      setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await adminCreatePackage(values);
      setTotalRows((n) => n + 1);
      if (packages.length < PAGE_SIZE) {
        setPackages((prev) => [...prev, created]);
      }
    }
    setModalOpen(false);
  };

  const handleDelete = async (pkg: Package) => {
    if (!window.confirm(`Delete package "${pkg.name}"? This cannot be undone.`)) return;
    try {
      await adminDeletePackage(pkg.id);
      setTotalRows((n) => n - 1);
      const remaining = packages.filter((p) => p.id !== pkg.id);
      if (remaining.length === 0 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setPackages(remaining);
      }
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not delete this package."));
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    try {
      const updated = await adminUpdatePackage(pkg.id, { is_active: !pkg.is_active });
      setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not update this package."));
    }
  };

  const handleDrop = async (targetId: number) => {
    if (dragId === null || dragId === targetId) {
      setDragId(null);
      return;
    }
    const next = [...packages];
    const fromIndex = next.findIndex((p) => p.id === dragId);
    const toIndex = next.findIndex((p) => p.id === targetId);
    setDragId(null);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setPackages(next);

    setReordering(true);
    try {
      await adminReorderPackages(next.map((p) => p.id), (page - 1) * PAGE_SIZE);
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not save the new order."));
      loadPackages();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Packages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage health packages, pricing and included tests. Drag rows by the handle to reorder how they
            appear on the home page.{reordering && <span className="ml-1.5 text-primary-600">Saving order...</span>}
          </p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Package
        </button>
      </div>

      <div className="relative mt-6 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search packages by name or code..."
          className="form-input pl-10"
        />
      </div>

      <div className="mt-4">
        {loading && <Spinner label="Loading packages..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadPackages} />}
        {!loading && !error && packages.length === 0 && (
          <EmptyState
            title={search ? "No matching packages" : "No packages yet"}
            description={search ? "Try a different search term." : "Add your first health package to get started."}
          />
        )}
        {!loading && !error && packages.length > 0 && (
          <>
            <p className="mb-3 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{packages.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalRows}</span>{" "}
              {totalRows === 1 ? "package" : "packages"}
            </p>
          <div className="card overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                  <th className="w-8 px-2 py-3" aria-hidden="true" />
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Lab Price</th>
                  <th className="px-4 py-3">Home Price</th>
                  <th className="px-4 py-3">Tests</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    draggable
                    onDragStart={() => setDragId(pkg.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(pkg.id)}
                    className={`border-b border-slate-50 transition-colors hover:bg-slate-50 ${dragId === pkg.id ? "opacity-40" : ""}`}
                  >
                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex cursor-grab text-slate-300 hover:text-slate-400" aria-hidden="true">
                        <GripVertical className="h-4 w-4" />
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {pkg.name}
                      {pkg.is_featured && <span className="badge ml-2 bg-primary-50 text-primary-700">Most Popular</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{pkg.category ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(pkg.lab_price)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(pkg.home_price)}</td>
                    <td className="px-4 py-3 text-slate-500">{pkg.tests.length}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(pkg)}
                        className={`badge ${pkg.is_active ? "bg-accent-500/10 text-accent-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {pkg.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/packages/${pkg.id}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700"
                          aria-label={`Manage tests for ${pkg.name}`}
                          title="Manage Tests"
                        >
                          <ListTree className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => openEditModal(pkg)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700" aria-label={`Edit ${pkg.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(pkg)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${pkg.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalRows={totalRows}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
          </>
        )}
      </div>

      <PackageFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialPackage={editingPackage}
        allTests={allTests}
      />
    </div>
  );
}
