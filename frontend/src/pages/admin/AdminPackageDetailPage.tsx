import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ReorderableList from "@/components/admin/ReorderableList";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import { adminGetPackage, adminReorderPackageTests, adminUpdatePackage } from "@/services/packageService";
import { getApiErrorMessage } from "@/services/api";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test";

export default function AdminPackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const packageId = Number(id);

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPkg(await adminGetPackage(packageId));
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load this package. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (testId: number) => {
    if (!pkg) return;
    setRemovingId(testId);
    try {
      const remainingIds = pkg.tests.filter((t) => t.id !== testId).map((t) => t.id);
      const updated = await adminUpdatePackage(packageId, { test_ids: remainingIds });
      setPkg(updated);
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not remove this test."));
    } finally {
      setRemovingId(null);
    }
  };

  const handleReorder = async (orderedIds: number[]) => {
    if (!pkg) return;
    const reordered = orderedIds
      .map((tid) => pkg.tests.find((t) => t.id === tid))
      .filter((t): t is Test => Boolean(t));
    setPkg({ ...pkg, tests: reordered });
    try {
      await adminReorderPackageTests(packageId, orderedIds);
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not save the new order."));
      load();
    }
  };

  if (loading) return <Spinner label="Loading package..." />;
  if (error || !pkg) return <ErrorState message={error ?? "Package not found."} onRetry={load} />;

  return (
    <div>
      <Link to="/admin/packages" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Packages
      </Link>

      <div className="mt-3">
        <h1 className="text-2xl font-bold text-slate-900">{pkg.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Reorder the tests included in this package. To add or remove tests, use the Edit button on the
          Packages list.
        </p>
      </div>

      <div className="card mt-6 p-4">
        <ReorderableList
          items={pkg.tests.map((t) => ({
            id: t.id,
            name: t.name,
            subtitle: `${t.parameters.length} parameter${t.parameters.length === 1 ? "" : "s"}`,
          }))}
          onReorder={handleReorder}
          onRemove={handleRemove}
          removingId={removingId}
          emptyLabel="No tests linked yet. Add tests from the package's Edit form."
        />
      </div>
    </div>
  );
}
