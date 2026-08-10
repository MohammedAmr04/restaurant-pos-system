import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface DailyDetailsPdfItem {
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DailyDetailsPdfInvoice {
  invoiceNumber: string;
  orderType: string;
  status: string;
  createdAt: string;
  cashier: string;
  customerName: string | null;
  paymentMethod: string | null;
  subtotal: number;
  discountValue: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  isReturned: boolean;
  refundAmount: number;
  returnReason: string | null;
  returnedItems: string | null;
  items: DailyDetailsPdfItem[];
}

export interface DailyDetailsPdfTotals {
  totalOrders: number;
  completedOrders: number;
  returnedOrders: number;
  grossSales: number;
  returns: number;
  discounts: number;
  serviceCharges: number;
  tax: number;
  expenses: number;
  net: number;
}

export interface DailyDetailsPdfLabels {
  restaurantName: string;
  title: string;
  date: string;
  createdOn: string;
  invoiceNumber: string;
  time: string;
  orderType: string;
  cashier: string;
  customer: string;
  paymentMethod: string;
  status: string;
  items: string;
  itemName: string;
  quantity: string;
  unitPrice: string;
  total: string;
  subtotal: string;
  discount: string;
  serviceCharge: string;
  tax: string;
  grandTotal: string;
  returned: string;
  refundAmount: string;
  reason: string;
  returnedProducts: string;
  summary: string;
  totalOrders: string;
  completedOrders: string;
  returnedOrders: string;
  grossSales: string;
  returns: string;
  expenses: string;
  net: string;
  generalCustomer: string;
  notAvailable: string;
}

interface DailyDetailsPdfOptions {
  title: string;
  date: string;
  invoices: DailyDetailsPdfInvoice[];
  totals: DailyDetailsPdfTotals;
  labels: DailyDetailsPdfLabels;
}

function escapeHtml(text: string | number): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCurrency(value: number): string {
  return value.toLocaleString("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildInvoiceSection(invoice: DailyDetailsPdfInvoice, labels: DailyDetailsPdfLabels): string {
  let itemRows = "";
  for (const item of invoice.items) {
    itemRows += `<tr>
      <td style="padding:6px 10px;text-align:right;border:1px solid #e5e7eb;color:#000;">${escapeHtml(item.menuItemName)}</td>
      <td style="padding:6px 10px;text-align:center;border:1px solid #e5e7eb;color:#000;">${item.quantity}</td>
      <td style="padding:6px 10px;text-align:center;border:1px solid #e5e7eb;color:#000;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding:6px 10px;text-align:center;border:1px solid #e5e7eb;color:#000;">${formatCurrency(item.total)}</td>
    </tr>`;
  }

  let totalsRows = `
    <tr><td style="padding:5px 10px;text-align:right;color:#000;border:1px solid #e5e7eb;">${escapeHtml(labels.subtotal)}</td><td style="padding:5px 10px;text-align:left;color:#000;border:1px solid #e5e7eb;">${formatCurrency(invoice.subtotal)}</td></tr>`;
  if (invoice.discountValue > 0) {
    totalsRows += `<tr><td style="padding:5px 10px;text-align:right;color:#000;border:1px solid #e5e7eb;">${escapeHtml(labels.discount)}</td><td style="padding:5px 10px;text-align:left;color:#000;border:1px solid #e5e7eb;">-${formatCurrency(invoice.discountValue)}</td></tr>`;
  }
  if (invoice.serviceCharge > 0) {
    totalsRows += `<tr><td style="padding:5px 10px;text-align:right;color:#000;border:1px solid #e5e7eb;">${escapeHtml(labels.serviceCharge)}</td><td style="padding:5px 10px;text-align:left;color:#000;border:1px solid #e5e7eb;">${formatCurrency(invoice.serviceCharge)}</td></tr>`;
  }
  if (invoice.tax > 0) {
    totalsRows += `<tr><td style="padding:5px 10px;text-align:right;color:#000;border:1px solid #e5e7eb;">${escapeHtml(labels.tax)}</td><td style="padding:5px 10px;text-align:left;color:#000;border:1px solid #e5e7eb;">${formatCurrency(invoice.tax)}</td></tr>`;
  }
  totalsRows += `<tr><td style="padding:6px 10px;text-align:right;color:#fff;background:#3b82f6;border:1px solid #2563eb;font-weight:bold;">${escapeHtml(labels.grandTotal)}</td><td style="padding:6px 10px;text-align:left;color:#fff;background:#3b82f6;border:1px solid #2563eb;font-weight:bold;">${formatCurrency(invoice.grandTotal)}</td></tr>`;

  const returnHtml = invoice.isReturned
    ? `<div style="margin-top:8px;padding:8px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;color:#b91c1c;font-size:13px;">
        <strong>${escapeHtml(labels.returned)}</strong> — ${escapeHtml(labels.refundAmount)}: ${formatCurrency(invoice.refundAmount)}
        ${invoice.returnedItems ? `<div style="margin-top:4px;">${escapeHtml(labels.returnedProducts)}: ${escapeHtml(invoice.returnedItems)}</div>` : ""}
        ${invoice.returnReason ? `<div style="margin-top:4px;">${escapeHtml(labels.reason)}: ${escapeHtml(invoice.returnReason)}</div>` : ""}
      </div>`
    : "";

  const time = new Date(invoice.createdAt).toLocaleTimeString("ar-EG");

  return `
  <div style="margin-top:16px;padding-top:10px;border-top:2px solid #d1d5db;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div style="font-size:15px;font-weight:bold;color:#000;">${escapeHtml(invoice.invoiceNumber)}</div>
      <div style="font-size:12px;color:#555;">${escapeHtml(labels.time)}: ${time}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px;">
      <tr>
        <td style="padding:4px 8px;color:#555;">${escapeHtml(labels.orderType)}</td><td style="padding:4px 8px;color:#000;">${escapeHtml(invoice.orderType)}</td>
        <td style="padding:4px 8px;color:#555;">${escapeHtml(labels.cashier)}</td><td style="padding:4px 8px;color:#000;">${escapeHtml(invoice.cashier || labels.notAvailable)}</td>
      </tr>
      <tr>
        <td style="padding:4px 8px;color:#555;">${escapeHtml(labels.customer)}</td><td style="padding:4px 8px;color:#000;">${escapeHtml(invoice.customerName || labels.generalCustomer)}</td>
        <td style="padding:4px 8px;color:#555;">${escapeHtml(labels.paymentMethod)}</td><td style="padding:4px 8px;color:#000;">${escapeHtml(invoice.paymentMethod || labels.notAvailable)}</td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:12px;">
      <thead>
        <tr>
          <th style="background:#f3f4f6;color:#000;padding:6px 10px;text-align:right;font-weight:bold;border:1px solid #e5e7eb;">${escapeHtml(labels.itemName)}</th>
          <th style="background:#f3f4f6;color:#000;padding:6px 10px;text-align:center;font-weight:bold;border:1px solid #e5e7eb;">${escapeHtml(labels.quantity)}</th>
          <th style="background:#f3f4f6;color:#000;padding:6px 10px;text-align:center;font-weight:bold;border:1px solid #e5e7eb;">${escapeHtml(labels.unitPrice)}</th>
          <th style="background:#f3f4f6;color:#000;padding:6px 10px;text-align:center;font-weight:bold;border:1px solid #e5e7eb;">${escapeHtml(labels.total)}</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table style="width:260px;margin-left:0;margin-top:8px;border-collapse:collapse;font-size:12px;">${totalsRows}</table>
    ${returnHtml}
  </div>`;
}

function buildHtml(options: DailyDetailsPdfOptions): string {
  const { labels } = options;
  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-EG");
  const timeStr = now.toLocaleTimeString("ar-EG");

  let invoicesHtml = "";
  for (const invoice of options.invoices) {
    invoicesHtml += buildInvoiceSection(invoice, labels);
  }

  const summaryRows = [
    [labels.totalOrders, options.totals.totalOrders],
    [labels.completedOrders, options.totals.completedOrders],
    [labels.returnedOrders, options.totals.returnedOrders],
    [labels.grossSales, formatCurrency(options.totals.grossSales)],
    [labels.returns, formatCurrency(options.totals.returns)],
    [labels.discount, formatCurrency(options.totals.discounts)],
    [labels.serviceCharge, formatCurrency(options.totals.serviceCharges)],
    [labels.tax, formatCurrency(options.totals.tax)],
    [labels.expenses, formatCurrency(options.totals.expenses)],
  ];

  let summaryHtml = "";
  for (const [label, value] of summaryRows) {
    summaryHtml += `<tr><td style="padding:6px 12px;text-align:right;color:#000;border:1px solid #e5e7eb;">${escapeHtml(label)}</td><td style="padding:6px 12px;text-align:left;color:#000;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`;
  }
  summaryHtml += `<tr><td style="padding:8px 12px;text-align:right;color:#fff;background:#3b82f6;border:1px solid #2563eb;font-weight:bold;">${escapeHtml(labels.net)}</td><td style="padding:8px 12px;text-align:left;color:#fff;background:#3b82f6;border:1px solid #2563eb;font-weight:bold;">${formatCurrency(options.totals.net)}</td></tr>`;

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
<div style="padding:24px;width:1000px;">
  <div style="text-align:center;margin-bottom:16px;">
    <div style="font-size:22px;font-weight:bold;margin-bottom:6px;color:#000;">${escapeHtml(labels.restaurantName)}</div>
    <div style="font-size:16px;margin-bottom:6px;color:#000;">${escapeHtml(labels.title)}</div>
    <div style="font-size:12px;color:#555;">${escapeHtml(labels.date)}: ${escapeHtml(options.date)}</div>
    <div style="font-size:11px;color:#888;margin-top:4px;">${escapeHtml(labels.createdOn)}: ${dateStr} ${timeStr}</div>
  </div>
  ${invoicesHtml}
  <div style="margin-top:20px;padding-top:12px;border-top:2px solid #3b82f6;">
    <div style="font-size:15px;font-weight:bold;color:#000;margin-bottom:8px;">${escapeHtml(labels.summary)}</div>
    <table style="width:400px;border-collapse:collapse;font-size:13px;">${summaryHtml}</table>
  </div>
</div>
</body>
</html>`;
}

export async function generateDailyDetailsPdf(options: DailyDetailsPdfOptions): Promise<void> {
  const fullHtml = buildHtml(options);

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

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const imgWidth = pageWidth - margin * 2;
    const imgScale = imgWidth / canvas.width;
    const imgHeight = canvas.height * imgScale;
    const pageImgHeight = pageHeight - margin * 2;

    let rendered = 0;
    let pageIndex = 0;
    while (rendered < imgHeight) {
      if (pageIndex > 0) {
        pdf.addPage();
      }
      const sliceHeight = Math.min(pageImgHeight, imgHeight - rendered);
      const srcY = rendered / imgScale;
      const srcH = sliceHeight / imgScale;

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = srcH;
      const sliceCtx = sliceCanvas.getContext("2d");
      if (sliceCtx) {
        sliceCtx.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          srcH,
          0,
          0,
          canvas.width,
          srcH
        );
        pdf.addImage(
          sliceCanvas.toDataURL("image/jpeg", 0.92),
          "JPEG",
          margin,
          margin,
          imgWidth,
          sliceHeight
        );
      }
      rendered += sliceHeight;
      pageIndex += 1;
    }

    const fileName = `${options.title.replace(/\s+/g, "_")}_${options.date}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(iframe);
  }
}
