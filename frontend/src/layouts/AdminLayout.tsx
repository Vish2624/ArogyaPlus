import { Menu } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";

import AdminSidebar from "@/components/admin/AdminSidebar";
import Spinner from "@/components/common/Spinner";
import { getCurrentAdmin } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout() {
  const admin = useAuthStore((s) => s.admin);
  const setAdmin = useAuthStore((s) => s.setAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!admin) {
      getCurrentAdmin().then(setAdmin).catch(() => {});
    }
    // `admin` starts null and the `if` guard skips the fetch once it's set, so adding it here
    // doesn't cause a refetch loop - it only lets the effect correctly react to that one transition.
  }, [admin, setAdmin]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Covers every nested admin route in one place rather than adding this to each admin
          page individually - internal/private tooling has no business being indexed. */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <a
        href="#admin-main-content"
        className="sr-only z-[100] rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 overflow-x-hidden lg:pl-64">
        <div className="flex h-14 items-center gap-3 border-b border-slate-100 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-primary-800">ArogyaPlus Admin</span>
        </div>
        <main id="admin-main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Each admin page component is itself lazy-loaded (see AppRoutes.tsx) - this
              Suspense is what actually catches that when navigating between admin pages
              (dashboard -> packages, etc). The one wrapping <AdminLayout> in AppRoutes only
              covers AdminLayout's own lazy load, not what it renders here via <Outlet>. */}
          <Suspense fallback={<Spinner className="py-32" label="Loading..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
