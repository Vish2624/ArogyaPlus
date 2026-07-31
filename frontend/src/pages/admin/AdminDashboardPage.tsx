import { ClipboardList, FlaskConical, Package as PackageIcon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BookingStatusBadge from "@/components/admin/BookingStatusBadge";
import StatCard from "@/components/admin/StatCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import { adminGetDashboardStats } from "@/services/bookingService";
import type { DashboardStats } from "@/types/booking";
import { formatDateTime } from "@/utils/formatters";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await adminGetDashboardStats());
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load the dashboard. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error || !stats) return <ErrorState message={error ?? "No data available."} onRetry={loadStats} />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of packages, tests and bookings.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={PackageIcon} label="Total Packages" value={stats.total_packages} color="primary" />
        <StatCard icon={FlaskConical} label="Total Tests" value={stats.total_tests} color="accent" />
        <StatCard icon={ClipboardList} label="Total Bookings" value={stats.total_bookings} color="slate" />
        <StatCard icon={Sparkles} label="New Bookings" value={stats.new_bookings} color="gold" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900">Booking Status Summary</h2>
          <div className="mt-4 space-y-3">
            {(Object.keys(stats.status_summary) as Array<keyof typeof stats.status_summary>).map((status) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <BookingStatusBadge status={status} />
                <span className="font-semibold text-slate-700">{stats.status_summary[status]}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
            <Link to="/admin/packages" className="block text-sm font-medium text-primary-700 hover:text-primary-800">Manage Packages &rarr;</Link>
            <Link to="/admin/tests" className="block text-sm font-medium text-primary-700 hover:text-primary-800">Manage Tests &rarr;</Link>
            <Link to="/admin/bookings" className="block text-sm font-medium text-primary-700 hover:text-primary-800">Manage Bookings &rarr;</Link>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs font-semibold text-primary-700 hover:text-primary-800">
              View All &rarr;
            </Link>
          </div>
          {stats.recent_bookings.length === 0 ? (
            <EmptyState title="No bookings yet" description="New bookings will appear here as customers submit them." />
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                    <th className="py-2 pr-4">Reference</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
                      <td className="py-3 pr-4 font-medium text-slate-800">{booking.booking_reference}</td>
                      <td className="py-3 pr-4 text-slate-600">{booking.customer_name}</td>
                      <td className="py-3 pr-4 text-slate-500">{formatDateTime(booking.created_at)}</td>
                      <td className="py-3 pr-4"><BookingStatusBadge status={booking.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
