import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import Seo from "@/components/common/Seo";
import LabArtworkBackdrop from "@/components/home/LabArtworkBackdrop";
import TestCard from "@/components/tests/TestCard";
import TestCardSkeleton from "@/components/tests/TestCardSkeleton";
import TestSearchAutocomplete from "@/components/tests/TestSearchAutocomplete";
import { getApiErrorMessage } from "@/services/api";
import { listTestsPaginated } from "@/services/testService";
import type { Test } from "@/types/test";
import { breadcrumbSchema, itemListSchema } from "@/utils/structuredData";
import { cardGridClass } from "@/utils/gridCols";

const BREADCRUMB_ITEMS = [{ name: "Lab Tests", path: "/tests" }];
const SEO_DESCRIPTION =
  "Browse the full ArogyaPlus individual lab test catalogue in Dubai. Compare Lab Visit and Home Visit pricing and book online in minutes.";

const PAGE_SIZE = 9;

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | "">("");
  const [page, setPage] = useState(1);

  // Memoized so its identity only changes when a value it actually captures changes - the
  // debounce effect below depends on this function itself rather than repeating that list.
  const loadTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTestsPaginated({
        search: search.trim() || undefined,
        category: category || undefined,
        sort: sort || undefined,
        page,
        page_size: PAGE_SIZE,
      });
      setTests(data.items);
      setTotalPages(data.total_pages);
      setTotalRows(data.total_rows);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load the test catalogue. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    const param = searchParams.get("search");
    if (param !== null) {
      setSearch(param);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const delay = search ? 300 : 0;
    const timeout = setTimeout(loadTests, delay);
    return () => clearTimeout(timeout);
  }, [search, loadTests]);

  // Derived from whatever page is currently loaded — chips reflect categories present on this
  // page only, not the whole catalogue (no endpoint exists to list categories without loading
  // every test).
  const categories = useMemo(
    () => Array.from(new Set(tests.map((t) => t.category).filter((c): c is string => Boolean(c)))),
    [tests]
  );

  return (
    <div className="section container-page">
      <Seo
        title="Full Test Catalogue"
        description={SEO_DESCRIPTION}
        path="/tests"
        jsonLd={[
          breadcrumbSchema(BREADCRUMB_ITEMS),
          ...(tests.length > 0 ? [itemListSchema(tests.map((t) => ({ name: t.name, price: t.lab_price })))] : []),
        ]}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} className="mb-4" />
      <div className="relative overflow-hidden rounded-card py-4 sm:py-6">
        <LabArtworkBackdrop compact />
        <div className="relative max-w-2xl">
          <p className="eyebrow text-primary-600">Lab Tests</p>
          <h1 className="mt-2 text-page-title font-bold text-slate-900">Full Test Catalogue</h1>
          <p className="mt-2 text-base leading-7 text-slate-500">
            Browse every individual laboratory test we offer and compare Lab Visit and Home Visit pricing.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <TestSearchAutocomplete
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
            <option value="">Sort by : Popular</option>
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
        {/* Each TestCard title is an h3 with nothing above it on this page but the h1 -
            an sr-only h2 keeps the outline valid (h1 -> h2 -> h3) without changing the visual
            design, which doesn't call for a second visible heading here. */}
        <h2 className="sr-only">Tests</h2>
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TestCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ErrorState message={error} onRetry={loadTests} />}
        {!loading && !error && tests.length === 0 && (
          <EmptyState title="No tests found" description="Try a different search term or clear the filters." />
        )}
        {!loading && !error && tests.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{tests.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalRows}</span>{" "}
              {totalRows === 1 ? "test" : "tests"}
            </p>
            <div className={`grid gap-5 ${cardGridClass(tests.length)}`}>
              {tests.map((test) => (
                <TestCard key={test.id} test={test} />
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

    </div>
  );
}
