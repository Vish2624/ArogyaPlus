import { SearchX } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Seo from "@/components/common/Seo";

export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* This SPA can't return a real HTTP 404 (the Apache fallback serves index.html with a
          200 for any unmatched path - a "soft 404"). noindex is the best mitigation available
          without server-side route awareness; see the SEO report for the full caveat. */}
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist or may have been moved." path={pathname} noindex nofollow />
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <SearchX className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-primary-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Back to Home</Link>
        <Link to="/packages" className="btn-secondary">Browse Packages</Link>
      </div>
    </div>
  );
}
