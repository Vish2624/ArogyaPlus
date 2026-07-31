import { ListTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PackageFormModal from "@/components/admin/PackageFormModal";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import {
  adminCreatePackage,
  adminDeletePackage,
  adminListPackages,
  adminUpdatePackage,
} from "@/services/packageService";
import { adminListTests } from "@/services/testService";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test";
import { formatCurrency } from "@/utils/formatters";
import type { PackageFormValues } from "@/utils/validation";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [packagesData, testsData] = await Promise.all([adminListPackages(), adminListTests()]);
      setPackages(packagesData);
      setAllTests(testsData);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load packages. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      setPackages((prev) => [...prev, created]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (pkg: Package) => {
    if (!window.confirm(`Delete package "${pkg.name}"? This cannot be undone.`)) return;
    try {
      await adminDeletePackage(pkg.id);
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
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

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Packages</h1>
          <p className="mt-1 text-sm text-slate-500">Manage health packages, pricing and included tests.</p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Package
        </button>
      </div>

      <div className="mt-6">
        {loading && <Spinner label="Loading packages..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadData} />}
        {!loading && !error && packages.length === 0 && (
          <EmptyState title="No packages yet" description="Add your first health package to get started." />
        )}
        {!loading && !error && packages.length > 0 && (
          <div className="card overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
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
                  <tr key={pkg.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
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
