import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfOptions {
  title: string;
  dateRange?: { from: string; to: string };
  headers: string[];
  rows: (string | number)[][];
  totals?: { label: string; value: string }[];
}

export function generateReportPdf({
  title,
  dateRange,
  headers,
  rows,
  totals,
}: PdfOptions) {
  const doc = new jsPDF({ orientation: "landscape" });

  const restaurantName = "Restaurant POS";

  doc.setFontSize(18);
  doc.text(restaurantName, 14, 20);

  doc.setFontSize(14);
  doc.text(title, 14, 30);

  let y = 36;

  if (dateRange) {
    doc.setFontSize(10);
    doc.text(`From: ${dateRange.from}  To: ${dateRange.to}`, 14, y);
    y += 6;
  }

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [headers],
    body: rows,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  if (totals && totals.length > 0) {
    const finalY = (doc as any).lastAutoTable?.finalY ?? y + 10;
    let totalY = finalY + 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    totals.forEach((t) => {
      doc.text(`${t.label}: ${t.value}`, 14, totalY);
      totalY += 7;
    });
  }

  const fileName = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
