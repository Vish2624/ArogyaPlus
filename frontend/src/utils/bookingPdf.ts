import type { Booking } from "@/types/booking";
import { getItemMeta, type ItemMetaLookup } from "./bookingItemMeta";
import { formatCurrency, formatDate, formatDateTime } from "./formatters";

const PRIMARY: [number, number, number] = [5, 150, 105];
const SLATE: [number, number, number] = [100, 116, 139];
const DARK: [number, number, number] = [15, 23, 42];

// jsPDF (+ its html2canvas/dompurify dependencies) is ~250KB gzipped and only ever needed
// here, so it's loaded on demand rather than bundled into the main app chunk.
export async function downloadBookingPdf(booking: Booking, lookup: ItemMetaLookup): Promise<void> {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 50;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PRIMARY);
  doc.text("ArogyaPlus Healthcare", marginX, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE);
  doc.text("Booking Confirmation", pageWidth - marginX, y, { align: "right" });

  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 28;
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(`Booking ${booking.booking_reference}`, marginX, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PRIMARY);
  doc.text(booking.status, pageWidth - marginX, y, { align: "right" });

  y += 26;

  const infoRows: [string, string][] = [
    ["Customer", booking.customer_name],
    ["Age / Gender", `${booking.age} / ${booking.gender}`],
    ["Phone", booking.phone],
    ["Email", booking.email],
    ["Visit Mode", `${booking.visit_mode === "home" ? "Home" : "Lab"} Visit`],
    ["Preferred Date", `${formatDate(booking.preferred_date)} at ${booking.time_slot}`],
    ["Submitted", formatDateTime(booking.created_at)],
    ["Total Amount", formatCurrency(booking.total_amount)],
  ];

  const colWidth = (pageWidth - marginX * 2) / 2;
  infoRows.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = marginX + col * colWidth;
    const rowY = y + row * 34;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE);
    doc.text(label.toUpperCase(), x, rowY);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(value, x, rowY + 15);
  });

  y += Math.ceil(infoRows.length / 2) * 34 + 16;

  autoTable(doc, {
    startY: y,
    head: [["Type", "Item", "Category", "Sample Type", "TAT", "Price"]],
    body: booking.items.map((item) => {
      const meta = getItemMeta(item, lookup);
      return [
        item.item_type === "package" ? "Package" : "Test",
        item.item_name,
        meta.category ?? "-",
        meta.sampleType ?? "-",
        meta.tat ?? "-",
        formatCurrency(item.price),
      ];
    }),
    theme: "grid",
    headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: marginX, right: marginX },
    columnStyles: {
      5: { halign: "right" },
    },
  });

  const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 40;

  doc.setFontSize(11.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(`Total: ${formatCurrency(booking.total_amount)}`, pageWidth - marginX, finalY + 26, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE);
  doc.text(
    `Generated on ${formatDateTime(new Date().toISOString())}`,
    marginX,
    doc.internal.pageSize.getHeight() - 30,
  );

  doc.save(`booking-${booking.booking_reference}.pdf`);
}
