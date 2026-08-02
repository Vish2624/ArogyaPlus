import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import ParameterFormModal from "@/components/admin/ParameterFormModal";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import {
  adminCreateParameter,
  adminDeleteParameter,
  adminListParametersPaginated,
  adminUpdateParameter,
} from "@/services/parameterService";
import type { Parameter } from "@/types/parameter";
import type { ParameterFormValues } from "@/utils/validation";

const PAGE_SIZE = 20;

export default function AdminParametersPage() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);

  const loadParameters = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminListParametersPaginated({ page, page_size: PAGE_SIZE });
      setParameters(result.items);
      setTotalPages(result.total_pages);
      setTotalRows(result.total_rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load parameters. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParameters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openAddModal = () => {
    setEditingParameter(null);
    setModalOpen(true);
  };

  const openEditModal = (parameter: Parameter) => {
    setEditingParameter(parameter);
    setModalOpen(true);
  };

  const handleSubmit = async (values: ParameterFormValues) => {
    if (editingParameter) {
      const updated = await adminUpdateParameter(editingParameter.id, values);
      setParameters((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await adminCreateParameter(values);
      setTotalRows((n) => n + 1);
      if (parameters.length < PAGE_SIZE) {
        setParameters((prev) => [...prev, created]);
      }
    }
    setModalOpen(false);
  };

  const handleDelete = async (parameter: Parameter) => {
    if (!window.confirm(`Delete parameter "${parameter.name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteParameter(parameter.id);
      setTotalRows((n) => n - 1);
      const remaining = parameters.filter((p) => p.id !== parameter.id);
      if (remaining.length === 0 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setParameters(remaining);
      }
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not delete this parameter."));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parameters</h1>
          <p className="mt-1 text-sm text-slate-500">
            Master list of clinical parameters (units, reference ranges, methods) linked to tests.
          </p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Parameter
        </button>
      </div>

      <div className="mt-6">
        {loading && <Spinner label="Loading parameters..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadParameters} />}
        {!loading && !error && parameters.length === 0 && (
          <EmptyState title="No parameters yet" description="Add your first clinical parameter to get started." />
        )}
        {!loading && !error && parameters.length > 0 && (
          <>
            <p className="mb-3 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{parameters.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalRows}</span>{" "}
              {totalRows === 1 ? "parameter" : "parameters"}
            </p>
            <div className="card overflow-x-auto p-2">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Unit</th>
                    <th className="px-4 py-3">Reference Range</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((parameter) => (
                    <tr key={parameter.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{parameter.name}</td>
                      <td className="px-4 py-3 text-slate-500">{parameter.unit ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-500">{parameter.reference_range ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-500">{parameter.method ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${parameter.is_active ? "bg-accent-500/10 text-accent-700" : "bg-slate-100 text-slate-500"}`}>
                          {parameter.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => openEditModal(parameter)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700" aria-label={`Edit ${parameter.name}`}>
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => handleDelete(parameter)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${parameter.name}`}>
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

      <ParameterFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialParameter={editingParameter}
      />
    </div>
  );
}
