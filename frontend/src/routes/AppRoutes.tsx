import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import PublicLayout from "@/layouts/PublicLayout";
import AdminBannersPage from "@/pages/admin/AdminBannersPage";
import AdminBookingsPage from "@/pages/admin/AdminBookingsPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminPackageDetailPage from "@/pages/admin/AdminPackageDetailPage";
import AdminPackagesPage from "@/pages/admin/AdminPackagesPage";
import AdminParametersPage from "@/pages/admin/AdminParametersPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminTestDetailPage from "@/pages/admin/AdminTestDetailPage";
import AdminTestsPage from "@/pages/admin/AdminTestsPage";
import BookingPage from "@/pages/BookingPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import PackagesPage from "@/pages/PackagesPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import TestsPage from "@/pages/TestsPage";

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

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
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
