import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AttachEntityModal from "@/components/admin/AttachEntityModal";
import ReorderableList from "@/components/admin/ReorderableList";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import { adminListParameters } from "@/services/parameterService";
import { adminAddTestParameter, adminGetTest, adminRemoveTestParameter, adminReorderTestParameters } from "@/services/testService";
import type { Parameter } from "@/types/parameter";
import type { Test } from "@/types/test";

export default function AdminTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const testId = Number(id);

  const [test, setTest] = useState<Test | null>(null);
  const [allParameters, setAllParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [testData, parametersData] = await Promise.all([adminGetTest(testId), adminListParameters()]);
      setTest(testData);
      setAllParameters(parametersData);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load this test. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    load();
  }, [load]);

  const linkedIds = useMemo(() => new Set(test?.parameters.map((p) => p.id) ?? []), [test]);
  const attachableParameters = useMemo(
    () =>
      allParameters
        .filter((p) => !linkedIds.has(p.id))
        .map((p) => ({ id: p.id, name: p.name, subtitle: p.unit ?? undefined })),
    [allParameters, linkedIds]
  );

  const handleAttach = async (parameterId: number) => {
    const updated = await adminAddTestParameter(testId, parameterId);
    setTest(updated);
  };

  const handleRemove = async (parameterId: number) => {
    setRemovingId(parameterId);
    try {
      const updated = await adminRemoveTestParameter(testId, parameterId);
      setTest(updated);
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not remove this parameter."));
    } finally {
      setRemovingId(null);
    }
  };

  const handleReorder = async (orderedIds: number[]) => {
    if (!test) return;
    const reordered = orderedIds
      .map((pid) => test.parameters.find((p) => p.id === pid))
      .filter((p): p is Parameter => Boolean(p));
    setTest({ ...test, parameters: reordered });
    try {
      await adminReorderTestParameters(testId, orderedIds);
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not save the new order."));
      load();
    }
  };

  if (loading) return <Spinner label="Loading test..." />;
  if (error || !test) return <ErrorState message={error ?? "Test not found."} onRetry={load} />;

  return (
    <div>
      <Link to="/admin/tests" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Tests
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{test.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sample type: <span className="font-semibold text-slate-700">{test.sample_type ?? "Not set"}</span> · Manage
            the clinical parameters included in this test.
          </p>
        </div>
        <button type="button" onClick={() => setAttachOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Parameter
        </button>
      </div>

      <div className="card mt-6 p-4">
        <ReorderableList
          items={test.parameters.map((p) => ({
            id: p.id,
            name: p.name,
            subtitle: [p.unit, p.reference_range].filter(Boolean).join(" · ") || undefined,
          }))}
          onReorder={handleReorder}
          onRemove={handleRemove}
          removingId={removingId}
          emptyLabel="No parameters linked yet. Add one to get started."
        />
      </div>

      <AttachEntityModal
        open={attachOpen}
        onClose={() => setAttachOpen(false)}
        title="Add Parameter to Test"
        items={attachableParameters}
        onAttach={handleAttach}
        emptyLabel="All parameters are already linked, or none exist yet."
      />
    </div>
  );
}
