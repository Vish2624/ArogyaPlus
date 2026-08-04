import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import LabArtworkBackdrop from "@/components/home/LabArtworkBackdrop";
import PackageCard from "@/components/packages/PackageCard";
import PackageCardSkeleton from "@/components/packages/PackageCardSkeleton";
import PackageDetailModal from "@/components/packages/PackageDetailModal";
import PackageSearchAutocomplete from "@/components/packages/PackageSearchAutocomplete";
import { getApiErrorMessage } from "@/services/api";
import { listPackagesPaginated } from "@/services/packageService";
import type { Package } from "@/types/package";

const PAGE_SIZE = 9;

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "">("");
  const [page, setPage] = useState(1);

  const loadPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPackagesPaginated({
        search: search.trim() || undefined,
        category: category || undefined,
        sort: sort || undefined,
        page,
        page_size: PAGE_SIZE,
      });
      setPackages(data.items);
      setTotalPages(data.total_pages);
      setTotalRows(data.total_rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load the packages catalogue. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const param = searchParams.get("search");
    if (param !== null) {
      setSearch(param);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const delay = search ? 300 : 0;
    const timeout = setTimeout(loadPackages, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort, page]);

  // Derived from whatever page is currently loaded — chips reflect categories present on this
  // page only, not the whole catalogue (no endpoint exists to list categories without loading
  // every package).
  const categories = useMemo(
    () => Array.from(new Set(packages.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [packages]
  );

  return (
    <div className="section container-page">
      <div className="relative overflow-hidden rounded-card py-4 sm:py-6">
        <LabArtworkBackdrop compact />
        <div className="relative max-w-2xl">
          <p className="eyebrow text-primary-600">Health Packages</p>
          <h1 className="mt-2 text-page-title font-bold text-slate-900">Full Packages Catalogue</h1>
          <p className="mt-2 text-base leading-7 text-slate-500">
            Browse every health package we offer and compare Lab Visit and Home Visit pricing.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <PackageSearchAutocomplete
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          className="flex-1"
        />

        <div className="relative sm:w-52">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as typeof sort);
              setPage(1);
            }}
            className="form-input w-full appearance-none pr-9"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              category === "" ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                category === c ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ErrorState message={error} onRetry={loadPackages} />}
        {!loading && !error && packages.length === 0 && (
          <EmptyState title="No packages found" description="Try a different search term or clear the filters." />
        )}
        {!loading && !error && packages.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{packages.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalRows}</span>{" "}
              {totalRows === 1 ? "package" : "packages"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onViewDetails={setSelectedPackage} />
              ))}
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

      <PackageDetailModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
    </div>
  );
}
