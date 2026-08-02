import { ChevronDown, Download, Eye, FileDown, Search } from "lucide-react";
import { useEffect, useState } from "react";

import BookingDetailModal from "@/components/admin/BookingDetailModal";
import BookingStatusBadge from "@/components/admin/BookingStatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import { getApiErrorMessage } from "@/services/api";
import { adminListBookings, adminUpdateBookingStatus } from "@/services/bookingService";
import { adminListPackages } from "@/services/packageService";
import { adminListTests } from "@/services/testService";
import type { Booking, BookingStatus } from "@/types/booking";
import { buildItemMetaLookup } from "@/utils/bookingItemMeta";
import { downloadBookingsCsv } from "@/utils/bookingCsv";
import { downloadBookingPdf } from "@/utils/bookingPdf";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";

const STATUS_OPTIONS: BookingStatus[] = ["New", "Contacted", "Done"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [itemMeta, setItemMeta] = useState(() => buildItemMetaLookup([], []));
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([adminListTests(), adminListPackages()])
      .then(([tests, packages]) => setItemMeta(buildItemMetaLookup(tests, packages)))
      .catch(() => {
        // Booking details still render without category/sample type/TAT enrichment.
      });
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListBookings({
        search: search || undefined,
        status_filter: statusFilter || undefined,
        booking_date: dateFilter || undefined,
      });
      setBookings(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load bookings. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadBookings, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, dateFilter]);

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    try {
      const updated = await adminUpdateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setSelectedBooking((prev) => (prev && prev.id === id ? updated : prev));
    } catch (err) {
      window.alert(getApiErrorMessage(err, "Could not update booking status."));
    }
  };

  const handleDownloadPdf = async (booking: Booking) => {
    setDownloadingId(booking.id);
    try {
      await downloadBookingPdf(booking, itemMeta);
    } catch (err) {
      window.alert("Could not generate the PDF. Please try again.");
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage customer booking requests.</p>
        </div>
        <button
          type="button"
          onClick={() => downloadBookingsCsv(bookings, itemMeta)}
          disabled={bookings.length === 0}
          className="btn-secondary !px-4 !py-2 !text-sm disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email or reference..."
            className="form-input pl-10"
          />
        </div>
        <div className="relative sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
            className="form-input w-full appearance-none pr-9"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-input sm:w-44"
        />
      </div>

      <div className="mt-6">
        {loading && <Spinner label="Loading bookings..." />}
        {!loading && error && <ErrorState message={error} onRetry={loadBookings} />}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState title="No bookings found" description="Try adjusting your search or filters." />
        )}
        {!loading && !error && bookings.length > 0 && (
          <div className="card overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Visit</th>
                  <th className="px-4 py-3">Date / Slot</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{booking.booking_reference}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {booking.customer_name}
                      <div className="text-xs text-slate-500">{booking.phone}</div>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-500">{booking.visit_mode}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(booking.preferred_date)}<div className="text-xs">{booking.time_slot}</div></td>
                    <td className="px-4 py-3 font-medium text-slate-800">{formatCurrency(booking.total_amount)}</td>
                    <td className="px-4 py-3"><BookingStatusBadge status={booking.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(booking.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700"
                          aria-label={`View booking ${booking.booking_reference}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(booking)}
                          disabled={downloadingId === booking.id}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700 disabled:opacity-40"
                          aria-label={`Download booking ${booking.booking_reference} as PDF`}
                          title="Download PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusChange={handleStatusChange}
        itemMeta={itemMeta}
      />
    </div>
  );
}
