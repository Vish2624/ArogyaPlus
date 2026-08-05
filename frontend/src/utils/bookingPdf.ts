import type { Booking } from "@/types/booking";
import { getItemMeta, type ItemMetaLookup } from "./bookingItemMeta";
import { withHomeCollectionFee } from "./bookingTotal";
import { formatCurrency, formatDate, formatDateTime } from "./formatters";

const PRIMARY: [number, number, number] = [5, 150, 105];
const SLATE: [number, number, number] = [100, 116, 139];
const DARK: [number, number, number] = [15, 23, 42];

/**
 * Standard Vacutainer cap-color coding for the common sample types this business collects.
 * Draw volumes are fixed/static (not sourced from the API — no such field exists yet) and were
 * confirmed with the business rather than invented here. Unrecognized sample type strings still
 * get a generic tube icon with just the name, no fabricated volume.
 */
const SAMPLE_INFO: Record<string, { label: string; volume: string | null; color: [number, number, number]; kind: "tube" | "cup" }> = {
  serum: { label: "SERUM", volume: "5ml", color: [217, 164, 6], kind: "tube" },
  edta: { label: "EDTA", volume: "2ml", color: [124, 58, 237], kind: "tube" },
  fluoride: { label: "Fluoride", volume: "2ml", color: [148, 163, 184], kind: "tube" },
  fluride: { label: "Fluoride", volume: "2ml", color: [148, 163, 184], kind: "tube" },
  urine: { label: "Urine", volume: "10 - 20 ml", color: [220, 38, 38], kind: "cup" },
};

function resolveSampleInfo(raw: string): { label: string; volume: string | null; color: [number, number, number]; kind: "tube" | "cup" } {
  const key = raw.trim().toLowerCase();
  return SAMPLE_INFO[key] ?? { label: raw.trim(), volume: null, color: SLATE, kind: "tube" };
}

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

  type InfoCell = [string, string] | null;
  const infoGrid: [InfoCell, InfoCell][] = [
    [["Customer", booking.customer_name], ["Age / Gender", `${booking.age} / ${booking.gender}`]],
    [["Phone", booking.phone], ["Email", booking.email]],
    [
      ["Visit Mode", `${booking.visit_mode === "home" ? "Home" : "Lab"} Visit`],
      ["Preferred Date", `${formatDate(booking.preferred_date)} at ${booking.time_slot}`],
    ],
    [["Submitted", formatDateTime(booking.created_at)], ["Total Amount", formatCurrency(withHomeCollectionFee(booking.total_amount, booking.visit_mode))]],
  ];
  if (booking.payment_mode) {
    infoGrid.push([null, ["Payment Mode", booking.payment_mode === "cash" ? "Cash" : "Online"]]);
  }

  const colWidth = (pageWidth - marginX * 2) / 2;
  infoGrid.forEach((row, rowIndex) => {
    row.forEach((cell, col) => {
      if (!cell) return;
      const [label, value] = cell;
      const x = marginX + col * colWidth;
      const rowY = y + rowIndex * 34;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE);
      doc.text(label.toUpperCase(), x, rowY);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(value, x, rowY + 15);
    });
  });

  y += infoGrid.length * 34 + 16;

  if (booking.address) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE);
    doc.text("ADDRESS", marginX, y);
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    const addressLines = doc.splitTextToSize(booking.address, pageWidth - marginX * 2) as string[];
    doc.text(addressLines, marginX, y + 15);
    y += 15 + addressLines.length * 13 + 12;
  }

  autoTable(doc, {
    startY: y,
    head: [["Type", "Item", "Category", "Sample Type", "TAT"]],
    body: booking.items.map((item) => {
      const meta = getItemMeta(item, lookup);
      return [
        item.item_type === "package" ? "Package" : "Test",
        item.item_name,
        meta.category ?? "-",
        meta.sampleType ?? "-",
        meta.tat ?? "-",
      ];
    }),
    theme: "grid",
    headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: marginX, right: marginX },
  });

  const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 40;

  const sampleTypes = new Map<string, string>();
  booking.items.forEach((item) => {
    const meta = getItemMeta(item, lookup);
    meta.sampleType?.split(",").forEach((raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const key = trimmed.toLowerCase();
      if (!sampleTypes.has(key)) sampleTypes.set(key, trimmed);
    });
  });

  let sampleY = finalY + 34;
  if (sampleTypes.size > 0) {
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SLATE);
    doc.text("SAMPLES to be Collected", marginX + 24, sampleY);
    sampleY += 20;

    const iconX = marginX + 24;
    [...sampleTypes.values()].forEach((raw) => {
      const info = resolveSampleInfo(raw);
      if (sampleY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        sampleY = 50;
      }

      if (info.kind === "cup") {
        doc.setDrawColor(...info.color);
        doc.setLineWidth(1.1);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(iconX, sampleY, 15, 19, 2, 2, "FD");
        doc.line(iconX, sampleY + 5, iconX + 15, sampleY + 5);
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        const label = info.volume ? `${info.label}  ${info.volume}` : info.label;
        doc.text(label, iconX + 26, sampleY + 13.5);
        sampleY += 34;
      } else {
        const pillW = 100;
        const pillH = 20;
        const tint: [number, number, number] = [
          Math.round(info.color[0] + (255 - info.color[0]) * 0.85),
          Math.round(info.color[1] + (255 - info.color[1]) * 0.85),
          Math.round(info.color[2] + (255 - info.color[2]) * 0.85),
        ];
        doc.setDrawColor(...info.color);
        doc.setLineWidth(1.1);
        doc.setFillColor(...tint);
        doc.roundedRect(iconX, sampleY, pillW, pillH, pillH / 2, pillH / 2, "FD");
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(info.label.toUpperCase(), iconX + pillW / 2, sampleY + pillH / 2 + 3.3, { align: "center" });
        if (info.volume) {
          doc.setFontSize(10.5);
          doc.text(info.volume, iconX + pillW + 16, sampleY + pillH / 2 + 3.3);
        }
        sampleY += 34;
      }
    });
  }

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
