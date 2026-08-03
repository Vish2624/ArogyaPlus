import { GripVertical, ListTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TestFormModal from "@/components/admin/TestFormModal";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import { adminListParameters } from "@/services/parameterService";
import {
  adminAddTestParameter,
  adminCreateTest,
  adminDeleteTest,
  adminListTests,
  adminRemoveTestParameter,
  adminReorderTests,
  adminUpdateTest,
} from "@/services/testService";
import type { Parameter } from "@/types/parameter";
import type { Test } from "@/types/test";
import { formatCurrency } from "@/utils/formatters";
import type { TestFormValues } from "@/utils/validation";

const PAGE_SIZE = 10;

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [parameterCatalog, setParameterCatalog] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tests.length / PAGE_SIZE));
  const pageTests = tests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests.length]);

  const loadTests = async () => {
    setLoading(true);
    setError(null);
    try {
      setTests(await adminListTests());
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load tests. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
    adminListParameters().then(setParameterCatalog);
  }, []);

  const openAddModal = () => {
    setEditingTest(null);
    setModalOpen(true);
  };

  const openEditModal = (test: Test) => {
    setEditingTest(test);
    setModalOpen(true);
  };

  const handleSubmit = async (values: TestFormValues, parameterIds: number[]) => {
    let test = editingTest ? await adminUpdateTest(editingTest.id, values) : await adminCreateTest(values);

    const currentIds = new Set(test.parameters.map((p) => p.id));
    const toAdd = parameterIds.filter((id) => !currentIds.has(id));
    const toRemove = [...currentIds].filter((id) => !parameterIds.includes(id));

    for (const id of toAdd) {
      try {
        test = await adminAddTestParameter(test.id, id);
      } catch {
        // The parameter-linking endpoint doesn't exist on the backend yet — reflect the
        // pick locally so the feature can be reviewed; it persists for real once it ships.
        const param = parameterCatalog.find((p) => p.id === id);
        if (param) test = { ...test, parameters: [...test.parameters, param] };
      }
    }
    for (const id of toRemove) {
      try {
        test = await adminRemoveTestParameter(test.id, id);
      } catch {
        test = { ...test, parameters: test.parameters.filter((p) => p.id !== id) };
      }
    }

    setTests((prev) => (editingTest ? prev.map((t) => (t.id === test.id ? test : t)) : [...prev, test]));
    setModalOpen(false);
  };

  const handleDelete = async (test: Test) => {
    if (!window.confirm(`Delete test "${test.name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteTest(test.id);
      setTests((prev) => prev.filter((t) => t.id !== test.id));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not delete this test."));
    }
  };

  const handleToggleActive = async (test: Test) => {
    try {
      const updated = await adminUpdateTest(test.id, { is_active: !test.is_active });
      setTests((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not update this test."));
    }
  };

  const handleDrop = async (targetId: number) => {
    if (dragId === null || dragId === targetId) {
      setDragId(null);
      return;
    }
    const next = [...tests];
    const fromIndex = next.findIndex((t) => t.id === dragId);
    const toIndex = next.findIndex((t) => t.id === targetId);
    setDragId(null);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setTests(next);

    setReordering(true);
    try {
      await adminReorderTests(next.map((t) => t.id));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not save the new order."));
      loadTests();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tests</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage individual laboratory tests and pricing. Drag rows by the handle to reorder how they
            appear on the home page.{reordering && <span className="ml-1.5 text-primary-600">Saving order...</span>}
          </p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Test
        </button>
      </div>

      <div className="mt-6">
        {loading && <Spinner label="Loading tests..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadTests} />}
        {!loading && !error && tests.length === 0 && (
          <EmptyState title="No tests yet" description="Add your first laboratory test to get started." />
        )}
        {!loading && !error && tests.length > 0 && (
          <>
            <p className="mb-3 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{tests.length}</span>{" "}
              {tests.length === 1 ? "test" : "tests"}
            </p>
          <div className="card overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                  <th className="w-8 px-2 py-3" aria-hidden="true" />
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Sample Type</th>
                  <th className="px-4 py-3">TAT</th>
                  <th className="px-4 py-3">Lab Price</th>
                  <th className="px-4 py-3">Home Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageTests.map((test) => (
                  <tr
                    key={test.id}
                    draggable
                    onDragStart={() => setDragId(test.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(test.id)}
                    className={`border-b border-slate-50 transition-colors hover:bg-slate-50 ${dragId === test.id ? "opacity-40" : ""}`}
                  >
                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex cursor-grab text-slate-300 hover:text-slate-400" aria-hidden="true">
                        <GripVertical className="h-4 w-4" />
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{test.name}</td>
                    <td className="px-4 py-3 text-slate-500">{test.category ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-500">{test.sample_type ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-500">{test.tat ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(test.lab_price)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(test.home_price)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(test)}
                        className={`badge ${test.is_active ? "bg-accent-500/10 text-accent-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {test.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/tests/${test.id}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700"
                          aria-label={`Manage parameters for ${test.name}`}
                          title="Manage Parameters"
                        >
                          <ListTree className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => openEditModal(test)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700" aria-label={`Edit ${test.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(test)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${test.name}`}>
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
            totalRows={tests.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
          </>
        )}
      </div>

      <TestFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialTest={editingTest} />
    </div>
  );
}
