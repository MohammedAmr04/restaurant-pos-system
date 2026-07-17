"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Search,
  Eye,
  Printer,
  FileText,
  RotateCcw,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { ORDER_TYPE, PAYMENT_METHOD } from "@/lib/constants/order-status";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import { useInvoices, Order } from "./hooks";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatCurrency(value: number) {
  return value.toLocaleString("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Returned":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusArabic(status: string) {
  switch (status) {
    case "Completed":
      return "مكتمل";
    case "Returned":
      return "مرجع";
    default:
      return status;
  }
}

function getOrderTypeArabic(type: string) {
  switch (type) {
    case "DineIn":
      return "صالة";
    case "TakeAway":
      return "تيك أواي";
    case "Delivery":
      return "ديلفري";
    default:
      return type;
  }
}

function getPaymentMethodArabic(method: string) {
  switch (method) {
    case "Cash":
      return "نقدي";
    case "Visa":
      return "فيزا";
    case "Instapay":
      return "انستاباي";
    case "Wallet":
      return "محفظة";
    default:
      return method || "-";
  }
}

export default function InvoicesPage() {
  const t = useTranslations("invoices");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [orderType, setOrderType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateFrom, setDateFrom] = useState(getToday());
  const [dateTo, setDateTo] = useState(getToday());
  const [viewingInvoice, setViewingInvoice] = useState<Order | null>(null);

  const { data: invoices, isLoading } = useInvoices({
    search: search || undefined,
    orderType: orderType || undefined,
    paymentMethod: paymentMethod || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const handlePrint = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl">
      <head>
        <title>فاتورة ${order.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
          .header { text-align: center; margin-bottom: 20px; }
          .invoice-number { font-size: 18px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f5f5f5; }
          .total-row { font-weight: bold; background-color: #f0f0f0; }
          .info { margin: 10px 0; }
          .info span { display: block; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="invoice-number">فاتورة رقم: ${order.invoiceNumber}</div>
          <div>${order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-EG") : ""}</div>
        </div>
        <div class="info">
          <span>النوع: ${getOrderTypeArabic(order.orderType)}</span>
          <span>العميل: ${order.customerName || "عميل عام"}</span>
          <span>طريقة الدفع: ${getPaymentMethodArabic(order.paymentMethod || "")}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>${item.menuItemName}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${formatCurrency(item.total)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="info">
          <span>المجموع الفرعي: ${formatCurrency(order.subtotal)}</span>
          ${order.discountValue > 0 ? `<span>الخصم: ${formatCurrency(order.discountValue)}</span>` : ""}
          ${order.serviceCharge > 0 ? `<span>رسوم الخدمة: ${formatCurrency(order.serviceCharge)}</span>` : ""}
          ${order.tax > 0 ? `<span>الضريبة: ${formatCurrency(order.tax)}</span>` : ""}
          <span class="total-row" style="font-size: 16px; display: block; margin-top: 10px;">الإجمالي: ${formatCurrency(order.grandTotal)}</span>
        </div>
        <script>window.onload=function(){window.print();}</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message={t("loading")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label className="mb-1 block">{t("search")}</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1 block">{t("orderType")}</Label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
              >
                <option value="">{t("allTypes")}</option>
                <option value={ORDER_TYPE.DINE_IN}>{t("dineIn")}</option>
                <option value={ORDER_TYPE.TAKE_AWAY}>{t("takeAway")}</option>
                <option value={ORDER_TYPE.DELIVERY}>{t("delivery")}</option>
              </select>
            </div>
            <div>
              <Label className="mb-1 block">{t("paymentMethod")}</Label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
              >
                <option value="">{t("allMethods")}</option>
                <option value={PAYMENT_METHOD.CASH}>{t("cash")}</option>
                <option value={PAYMENT_METHOD.VISA}>{t("visa")}</option>
                <option value={PAYMENT_METHOD.INSTAPAY}>{t("instapay")}</option>
                <option value={PAYMENT_METHOD.WALLET}>{t("wallet")}</option>
              </select>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="mb-1 block">{t("fromDate")}</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label className="mb-1 block">{t("toDate")}</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {invoices && invoices.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            icon={<FileText className="w-12 h-12 text-gray-400" />}
          />
        ) : invoices ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("invoiceNumber")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("customer")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("orderTypeCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("paymentMethodCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("grandTotal")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("status")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("date")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOrderTypeArabic(invoice.orderType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPaymentMethodArabic(invoice.paymentMethod || "")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(invoice.grandTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                        {getStatusArabic(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingInvoice(invoice)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrint(invoice)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        {invoice.status === "Completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(ROUTES.RETURNS)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>

      <Dialog
        open={!!viewingInvoice}
        onOpenChange={(open) => {
          if (!open) setViewingInvoice(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("invoiceDetails")}</DialogTitle>
          </DialogHeader>
          {viewingInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t("invoiceNumber")}</p>
                  <p className="text-sm font-medium">{viewingInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("status")}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(viewingInvoice.status)}`}>
                    {getStatusArabic(viewingInvoice.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("customer")}</p>
                  <p className="text-sm font-medium">{viewingInvoice.customerName || "عميل عام"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("orderTypeCol")}</p>
                  <p className="text-sm font-medium">{getOrderTypeArabic(viewingInvoice.orderType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("paymentMethodCol")}</p>
                  <p className="text-sm font-medium">{getPaymentMethodArabic(viewingInvoice.paymentMethod || "")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("date")}</p>
                  <p className="text-sm font-medium">
                    {new Date(viewingInvoice.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">{t("items")}</p>
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t("itemName")}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t("quantity")}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t("unitPrice")}</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t("itemTotal")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewingInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm">{item.menuItemName}</td>
                        <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2 text-sm">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("subtotal")}</span>
                  <span>{formatCurrency(viewingInvoice.subtotal)}</span>
                </div>
                {viewingInvoice.discountValue > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>{t("discount")}</span>
                    <span>-{formatCurrency(viewingInvoice.discountValue)}</span>
                  </div>
                )}
                {viewingInvoice.serviceCharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t("serviceCharge")}</span>
                    <span>{formatCurrency(viewingInvoice.serviceCharge)}</span>
                  </div>
                )}
                {viewingInvoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t("tax")}</span>
                    <span>{formatCurrency(viewingInvoice.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t("grandTotal")}</span>
                  <span>{formatCurrency(viewingInvoice.grandTotal)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={() => handlePrint(viewingInvoice)}>
                  <Printer className="w-4 h-4 ml-2" />
                  {t("print")}
                </Button>
                <Button variant="secondary" onClick={() => setViewingInvoice(null)}>
                  {tCommon("close")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
