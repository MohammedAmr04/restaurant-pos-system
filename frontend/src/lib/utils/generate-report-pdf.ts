import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PdfOptions {
  title: string;
  subtitle?: string;
  dateRange?: { from: string; to: string };
  headers: string[];
  rows: (string | number)[][];
  totals?: { label: string; value: string }[];
}

function escapeHtml(text: string | number): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReportHtml({
  title,
  subtitle,
  dateRange,
  headers,
  rows,
  totals,
}: PdfOptions): string {
  const restaurantName = subtitle || "نظام نقطة بيع المطعم";
  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-EG");
  const timeStr = now.toLocaleTimeString("ar-EG");

  let tableRows = "";
  for (const row of rows) {
    let cells = "";
    for (const cell of row) {
      cells += `<td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;color:#000;">${escapeHtml(cell)}</td>`;
    }
    tableRows += `<tr>${cells}</tr>`;
  }

  let tableHeaders = "";
  for (const header of headers) {
    tableHeaders += `<th style="background:#3b82f6;color:#fff;padding:10px 12px;text-align:right;font-weight:bold;border:1px solid #2563eb;">${escapeHtml(header)}</th>`;
  }

  let totalsHtml = "";
  if (totals && totals.length > 0) {
    let items = "";
    for (const total of totals) {
      items += `<div style="font-size:14px;font-weight:bold;margin-bottom:6px;color:#000;">${escapeHtml(total.label)}: ${escapeHtml(total.value)}</div>`;
    }
    totalsHtml = `<div style="margin-top:20px;padding-top:10px;border-top:2px solid #3b82f6;">${items}</div>`;
  }

  const dateRangeHtml = dateRange
    ? `<div style="font-size:12px;color:#555;">من: ${escapeHtml(dateRange.from)} &nbsp;&nbsp; إلى: ${escapeHtml(dateRange.to)}</div>`
    : "";

  return `<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Tahoma, sans-serif; background: #fff; color: #000; }
</style>
</head>
<body>
<div style="padding:30px;width:1000px;">
  <div style="text-align:center;margin-bottom:20px;">
    <div style="font-size:22px;font-weight:bold;margin-bottom:6px;color:#000;">${escapeHtml(restaurantName)}</div>
    <div style="font-size:16px;margin-bottom:8px;color:#000;">${escapeHtml(title)}</div>
    ${dateRangeHtml}
    <div style="font-size:11px;color:#888;margin-top:4px;">تاريخ الإنشاء: ${dateStr} ${timeStr}</div>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:13px;">
    <thead><tr>${tableHeaders}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  ${totalsHtml}
</div>
</body>
</html>`;
}

export async function generateReportPdf(options: PdfOptions): Promise<void> {
  const { title } = options;
  const fullHtml = buildReportHtml(options);

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1000px;height:0;border:none;z-index:-1;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error("Cannot access iframe document");
  }

  iframeDoc.open();
  iframeDoc.write(fullHtml);
  iframeDoc.close();

  await new Promise((r) => setTimeout(r, 200));

  try {
    const body = iframeDoc.body;
    const canvas = await html2canvas(body, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 1000,
      windowWidth: 1000,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "landscape" : "portrait",
      unit: "pt",
      format: [imgWidth * 0.75, imgHeight * 0.75],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth * 0.75, imgHeight * 0.75);

    const fileName = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(iframe);
  }
}
