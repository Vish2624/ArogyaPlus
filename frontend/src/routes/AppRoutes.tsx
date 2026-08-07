import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Spinner from "@/components/common/Spinner";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import PublicLayout from "@/layouts/PublicLayout";
import BookingPage from "@/pages/BookingPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PackagesPage from "@/pages/PackagesPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import TestsPage from "@/pages/TestsPage";

// The entire admin panel is only ever reached by logged-in staff, never by a public visitor -
// lazy-loading it keeps its code out of the bundle every customer downloads just to browse
// packages/tests. This was previously flagged as a pending follow-up to the earlier bundle-size
// audit; doing it now as part of the broader performance/SEO pass.
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminBannersPage = lazy(() => import("@/pages/admin/AdminBannersPage"));
const AdminBookingsPage = lazy(() => import("@/pages/admin/AdminBookingsPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminPackageDetailPage = lazy(() => import("@/pages/admin/AdminPackageDetailPage"));
const AdminPackagesPage = lazy(() => import("@/pages/admin/AdminPackagesPage"));
const AdminParametersPage = lazy(() => import("@/pages/admin/AdminParametersPage"));
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfilePage"));
const AdminTestDetailPage = lazy(() => import("@/pages/admin/AdminTestDetailPage"));
const AdminTestsPage = lazy(() => import("@/pages/admin/AdminTestsPage"));

function AdminFallback() {
  return <Spinner className="flex min-h-screen items-center justify-center" label="Loading admin..." />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="packages" element={<AdminPackagesPage />} />
        <Route path="packages/:id" element={<AdminPackageDetailPage />} />
        <Route path="tests" element={<AdminTestsPage />} />
        <Route path="tests/:id" element={<AdminTestDetailPage />} />
        <Route path="parameters" element={<AdminParametersPage />} />
        <Route path="banners" element={<AdminBannersPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
