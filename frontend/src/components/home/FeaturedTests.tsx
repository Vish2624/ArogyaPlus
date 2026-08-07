import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import TestCard from "@/components/tests/TestCard";
import TestCardSkeleton from "@/components/tests/TestCardSkeleton";
import type { Test } from "@/types/test";
import { cardGridClass } from "@/utils/gridCols";

interface FeaturedTestsProps {
  tests: Test[];
  loading?: boolean;
}

export default function FeaturedTests({ tests, loading = false }: FeaturedTestsProps) {
  if (!loading && tests.length === 0) return null;

  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-primary-600">Individual Tests</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Popular Lab Tests</h2>
          </div>
          <Link to="/tests" className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800">
            View Full Test Catalogue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className={`mt-10 grid gap-5 ${loading ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : cardGridClass(tests.length)}`}>
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <TestCardSkeleton key={i} />)
            : tests.map((test) => <TestCard key={test.id} test={test} />)}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/tests" className="btn-primary">
            View All Tests
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
