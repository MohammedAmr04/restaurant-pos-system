"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Calendar,
  BarChart3,
  Truck,
  Receipt,
  RotateCcw,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/routes";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { generateReportPdf } from "@/lib/utils/generate-report-pdf";
import { generateDailyDetailsPdf } from "@/lib/utils/generate-daily-details-pdf";
import {
  useDailyReport,
  useMonthlyReport,
  useCustomReport,
  useDeliveryReport,
  useExpenseReport,
  useReturnsReport,
  useDailyDetails,
  usePrintDailyReport,
} from "./hooks";
import { useSettings } from "@/features/settings/hooks";

type ReportTab = "daily" | "dailyDetails" | "monthly" | "custom" | "delivery" | "expense" | "returns";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentYear() {
  return new Date().getFullYear();
}

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getStatusLabel(status: string, t: ReturnType<typeof useTranslations>) {
  switch (status) {
    case "Completed":
      return t("statusCompleted");
    case "Returned":
      return t("statusReturned");
    default:
      return status;
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Returned":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getOrderTypeLabel(type: string, t: ReturnType<typeof useTranslations>) {
  switch (type) {
    case "DineIn":
      return t("dineIn");
    case "TakeAway":
      return t("takeAway");
    case "Delivery":
      return t("delivery");
    default:
      return type;
  }
}

function getPaymentMethodLabel(method: string | null, t: ReturnType<typeof useTranslations>) {
  switch (method) {
    case "Cash":
      return t("cash");
    case "Visa":
      return t("visa");
    case "Instapay":
      return t("instapay");
    case "Wallet":
      return t("wallet");
    default:
      return method || "-";
  }
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DailyReportTab() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");
  const [date, setDate] = useState(getToday());
  const [viewingDay, setViewingDay] = useState<any>(null);
  const { data, isLoading } = useDailyReport(date);
  const printDailyReport = usePrintDailyReport();

  const handlePrint = async () => {
    try {
      await printDailyReport.mutateAsync(date);
      toast.success(t("printSuccess"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("printError"));
    }
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message={t("loading")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("date")}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              generateReportPdf({
                title: t("daily"),
                dateRange: { from: date, to: date },
                headers: [t("date"), t("totalOrders"), t("completedOrders"), t("totalSales"), t("discounts"), t("serviceCharges"), t("returns"), t("expenses"), t("revenueBeforeExpenses"), t("revenueAfterExpenses")],
                rows: [[
                  new Date(data.businessDate).toLocaleDateString("ar-EG"),
                  data.totalOrders,
                  data.completedOrders,
                  formatCurrency(data.totalSales),
                  formatCurrency(data.discounts),
                  formatCurrency(data.serviceCharge),
                  formatCurrency(data.returns),
                  formatCurrency(data.expenses),
                  formatCurrency(data.revenueBeforeExpenses),
                  formatCurrency(data.revenueAfterExpenses),
                ]],
                totals: [
                  { label: t("dineIn"), value: `${data.orderTypes?.dineIn?.count ?? 0} ${t("ordersCount")} / ${formatCurrency(data.orderTypes?.dineIn?.amount ?? 0)}` },
                  { label: t("delivery"), value: `${data.orderTypes?.delivery?.count ?? 0} ${t("ordersCount")} / ${formatCurrency(data.orderTypes?.delivery?.amount ?? 0)}` },
                  { label: t("takeAway"), value: `${data.orderTypes?.takeAway?.count ?? 0} ${t("ordersCount")} / ${formatCurrency(data.orderTypes?.takeAway?.amount ?? 0)}` },
                ],
              })
            }
          >
            PDF {tCommon("export")}
          </Button>
        )}
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            disabled={printDailyReport.isPending}
          >
            <Printer className="w-4 h-4 ml-2" />
            {t("printDailyReport")}
          </Button>
        )}
        {data && data.shiftStart && (
          <span className="text-sm text-gray-500">
            {t("shift")}: {data.shiftStart} - {data.shiftEnd}
          </span>
        )}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label={t("totalSales")} value={`${formatCurrency(data.totalSales)} ${tCommon("currency")}`} icon={TrendingUp} />
            <SummaryCard label={t("totalOrders")} value={data.totalOrders.toString()} icon={BarChart3} />
            <SummaryCard label={t("expenses")} value={`${formatCurrency(data.expenses)} ${tCommon("currency")}`} icon={Receipt} />
            <SummaryCard label={t("netRevenue")} value={`${formatCurrency(data.revenueAfterExpenses)} ${tCommon("currency")}`} icon={TrendingUp} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("orderTypeBreakdown")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-md border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{t("dineIn")}</p>
                <p className="mt-2 text-sm text-gray-900">
                  {t("ordersCount")}: <span className="font-semibold">{data.orderTypes?.dineIn?.count ?? 0}</span>
                </p>
                <p className="text-sm text-gray-900">
                  {t("amount")}: <span className="font-semibold">{formatCurrency(data.orderTypes?.dineIn?.amount ?? 0)}</span>
                </p>
              </div>
              <div className="rounded-md border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{t("delivery")}</p>
                <p className="mt-2 text-sm text-gray-900">
                  {t("ordersCount")}: <span className="font-semibold">{data.orderTypes?.delivery?.count ?? 0}</span>
                </p>
                <p className="text-sm text-gray-900">
                  {t("amount")}: <span className="font-semibold">{formatCurrency(data.orderTypes?.delivery?.amount ?? 0)}</span>
                </p>
              </div>
              <div className="rounded-md border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{t("takeAway")}</p>
                <p className="mt-2 text-sm text-gray-900">
                  {t("ordersCount")}: <span className="font-semibold">{data.orderTypes?.takeAway?.count ?? 0}</span>
                </p>
                <p className="text-sm text-gray-900">
                  {t("amount")}: <span className="font-semibold">{formatCurrency(data.orderTypes?.takeAway?.amount ?? 0)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("date")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("completedOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalSales")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("discounts")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("serviceCharges")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("returns")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("expenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("revenueBeforeExpenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("revenueAfterExpenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(data.businessDate).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.completedOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.totalSales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.discounts)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.serviceCharge)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.returns)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.expenses)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.revenueBeforeExpenses)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.revenueAfterExpenses)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="ghost" size="sm" onClick={() => setViewingDay(data)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {data === null && (
        <EmptyState title={t("emptyTitle")} description={t("emptyForDate")} />
      )}

      <Dialog open={!!viewingDay} onOpenChange={(open) => { if (!open) setViewingDay(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("reportDetails")}</DialogTitle>
          </DialogHeader>
          {viewingDay && (
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">{t("date")}</p><p className="text-sm font-medium">{new Date(viewingDay.businessDate).toLocaleDateString("ar-EG")}</p></div>
              <div><p className="text-sm text-gray-500">{t("totalOrders")}</p><p className="text-sm font-medium">{viewingDay.totalOrders}</p></div>
              <div><p className="text-sm text-gray-500">{t("completedOrders")}</p><p className="text-sm font-medium">{viewingDay.completedOrders}</p></div>
              <div><p className="text-sm text-gray-500">{t("totalSales")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.totalSales)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("discounts")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.discounts)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("serviceCharges")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.serviceCharge)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("returns")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.returns)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("expenses")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.expenses)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("revenueBeforeExpenses")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.revenueBeforeExpenses)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("revenueAfterExpenses")}</p><p className="text-sm font-medium">{formatCurrency(viewingDay.revenueAfterExpenses)} {tCommon("currency")}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DailyDetailsTab() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");
  const tInvoices = useTranslations("invoices");
  const [date, setDate] = useState(getToday());
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data, isLoading } = useDailyDetails(date);
  const { data: settings } = useSettings();

  const handleExport = async () => {
    if (!data) return;
    const dateDisplay = new Date(data.businessDate).toLocaleDateString("ar-EG");
    await generateDailyDetailsPdf({
      title: t("dailyDetails"),
      date: dateDisplay,
      invoices: data.invoices.map((invoice) => ({
        invoiceNumber: invoice.invoiceNumber,
        orderType: getOrderTypeLabel(invoice.orderType, tInvoices),
        status: getStatusLabel(invoice.status, tInvoices),
        createdAt: invoice.createdAt,
        cashier: invoice.cashier,
        customerName: invoice.customerName,
        paymentMethod: getPaymentMethodLabel(invoice.paymentMethod, tInvoices),
        subtotal: invoice.subtotal,
        discountValue: invoice.discountValue,
        serviceCharge: invoice.serviceCharge,
        tax: invoice.tax,
        grandTotal: invoice.grandTotal,
        isReturned: invoice.isReturned,
        refundAmount: invoice.refundAmount,
        returnReason: invoice.returnReason,
        returnedItems: invoice.returnedItems,
        items: invoice.items.map((item) => ({
          menuItemName: item.menuItemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      })),
      totals: {
        totalOrders: data.totalOrders,
        completedOrders: data.completedOrders,
        returnedOrders: data.returnedOrders,
        grossSales: data.grossSales,
        returns: data.returns,
        discounts: data.discounts,
        serviceCharges: data.serviceCharges,
        tax: data.tax,
        expenses: data.expenses,
        net: data.net,
      },
      labels: {
        restaurantName: settings?.restaurantName || t("title"),
        title: t("dailyDetails"),
        date: t("date"),
        createdOn: t("createdOn"),
        invoiceNumber: t("invoiceNumberCol"),
        time: t("timeCol"),
        orderType: t("orderType"),
        cashier: t("cashierCol"),
        customer: t("customerCol"),
        paymentMethod: t("paymentMethodCol"),
        status: t("statusCol"),
        items: t("items"),
        itemName: t("itemName"),
        quantity: t("quantity"),
        unitPrice: t("unitPrice"),
        total: t("total"),
        subtotal: t("subtotal"),
        discount: t("discount"),
        serviceCharge: t("serviceCharge"),
        tax: t("tax"),
        grandTotal: t("grandTotal"),
        returned: t("returnedBadge"),
        refundAmount: t("refundAmountCol"),
        reason: t("returnReason"),
        returnedProducts: t("returnedProducts"),
        summary: t("summaryTitle"),
        totalOrders: t("totalOrders"),
        completedOrders: t("completedOrders"),
        returnedOrders: t("returnedOrders"),
        grossSales: t("grossSales"),
        returns: t("returns"),
        expenses: t("expenses"),
        net: t("netRevenue"),
        generalCustomer: tInvoices("generalCustomer"),
        notAvailable: t("notAvailable"),
      },
    });
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message={t("loadingDailyDetails")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("date")}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {data && (
          <Button variant="secondary" size="sm" onClick={handleExport}>
            PDF {tCommon("export")}
          </Button>
        )}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SummaryCard label={t("grossSales")} value={`${formatCurrency(data.grossSales)} ${tCommon("currency")}`} icon={TrendingUp} />
            <SummaryCard label={t("totalOrders")} value={data.totalOrders.toString()} icon={BarChart3} />
            <SummaryCard label={t("returnedOrders")} value={data.returnedOrders.toString()} icon={RotateCcw} />
            <SummaryCard label={t("expenses")} value={`${formatCurrency(data.expenses)} ${tCommon("currency")}`} icon={Receipt} />
            <SummaryCard label={t("netRevenue")} value={`${formatCurrency(data.net)} ${tCommon("currency")}`} icon={TrendingUp} />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("invoiceNumberCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("timeCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("cashierCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("customerCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("paymentMethodCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("total")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("statusCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.invoices.map((invoice) => (
                  <Fragment key={invoice.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.createdAt).toLocaleTimeString("ar-EG")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.cashier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customerName || tInvoices("generalCustomer")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getPaymentMethodLabel(invoice.paymentMethod, tInvoices)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.grandTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                          {getStatusLabel(invoice.status, tInvoices)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === invoice.id ? null : invoice.id)}>
                          {expanded === invoice.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </td>
                    </tr>
                    {expanded === invoice.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                            <span className="text-gray-500">{t("orderType")}: <span className="font-medium text-gray-900">{getOrderTypeLabel(invoice.orderType, tInvoices)}</span></span>
                            <span className="text-gray-500">{t("subtotal")}: <span className="font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span></span>
                            <span className="text-gray-500">{t("discount")}: <span className="font-medium text-gray-900">-{formatCurrency(invoice.discountValue)}</span></span>
                            <span className="text-gray-500">{t("serviceCharge")}: <span className="font-medium text-gray-900">{formatCurrency(invoice.serviceCharge)}</span></span>
                            <span className="text-gray-500">{t("tax")}: <span className="font-medium text-gray-900">{formatCurrency(invoice.tax)}</span></span>
                          </div>
                          {invoice.isReturned && (
                            <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                              {t("returnedBadge")} — {t("refundAmountCol")}: {formatCurrency(invoice.refundAmount)}
                              {invoice.returnedItems && (
                                <div className="mt-1">{t("returnedProducts")}: {invoice.returnedItems}</div>
                              )}
                              {invoice.returnReason && (
                                <div className="mt-1">{t("returnReason")}: {invoice.returnReason}</div>
                              )}
                            </div>
                          )}
                          <div className="rounded-lg border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t("itemName")}</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t("quantity")}</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t("unitPrice")}</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t("total")}</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                {invoice.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-2 text-sm text-gray-900">{item.menuItemName}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.total)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {data === null && (
        <EmptyState title={t("noInvoicesTitle")} description={t("noInvoicesDescription")} />
      )}
    </div>
  );
}

function MonthlyReportTab() {
  const t = useTranslations("reports");
  const tMonths = useTranslations("months");
  const tCommon = useTranslations("common");
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());
  const { data, isLoading } = useMonthlyReport(year, month);

  const MONTH_NAMES = [
    tMonths("january"), tMonths("february"), tMonths("march"), tMonths("april"),
    tMonths("may"), tMonths("june"), tMonths("july"), tMonths("august"),
    tMonths("september"), tMonths("october"), tMonths("november"), tMonths("december"),
  ];

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message={t("loading")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("year")}</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">{t("month")}</label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MONTH_NAMES.map((name, i) => (
            <option key={i + 1} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              generateReportPdf({
                title: t("monthly"),
                dateRange: { from: `${year}-${String(month).padStart(2, "0")}-01`, to: `${year}-${String(month).padStart(2, "0")}-28` },
                headers: [t("date"), t("totalOrders"), t("completedOrders"), t("sales"), t("discounts"), t("returns"), t("expenses"), t("netRevenue")],
                rows: data.dailySales.map((day) => [
                  new Date(day.businessDate).toLocaleDateString("ar-EG"),
                  day.totalOrders,
                  day.completedOrders,
                  formatCurrency(day.totalSales),
                  formatCurrency(day.discounts),
                  formatCurrency(day.returns),
                  formatCurrency(day.expenses),
                  formatCurrency(day.revenueAfterExpenses),
                ]),
                totals: [
                  { label: t("monthlySales"), value: `${formatCurrency(data.monthlyTotal)} ${tCommon("currency")}` },
                  { label: t("monthlyExpenses"), value: `${formatCurrency(data.monthlyExpenses)} ${tCommon("currency")}` },
                  { label: t("monthlyReturns"), value: `${formatCurrency(data.monthlyReturns)} ${tCommon("currency")}` },
                  { label: t("netRevenue"), value: `${formatCurrency(data.netRevenue)} ${tCommon("currency")}` },
                ],
              })
            }
          >
            PDF {tCommon("export")}
          </Button>
        )}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label={t("monthlySales")} value={`${formatCurrency(data.monthlyTotal)} ${tCommon("currency")}`} icon={TrendingUp} />
            <SummaryCard label={t("monthlyExpenses")} value={`${formatCurrency(data.monthlyExpenses)} ${tCommon("currency")}`} icon={Receipt} />
            <SummaryCard label={t("monthlyReturns")} value={`${formatCurrency(data.monthlyReturns)} ${tCommon("currency")}`} icon={RotateCcw} />
            <SummaryCard label={t("netRevenue")} value={`${formatCurrency(data.netRevenue)} ${tCommon("currency")}`} icon={TrendingUp} />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("date")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("completedOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("sales")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("discounts")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("returns")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("expenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("netRevenue")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.dailySales.map((day) => (
                  <tr key={day.businessDate}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.businessDate).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.completedOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.totalSales)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.discounts)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.returns)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.expenses)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(day.revenueAfterExpenses)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {data === null && (
        <EmptyState title={t("emptyTitle")} description={t("emptyForMonth")} />
      )}
    </div>
  );
}

function CustomReportTab() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [viewingRow, setViewingRow] = useState<any>(null);
  const { data, isLoading } = useCustomReport(startDate || undefined, endDate || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("startDate")}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">{t("endDate")}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              generateReportPdf({
                title: t("custom"),
                dateRange: { from: startDate, to: endDate },
                headers: [t("startDate"), t("endDate"), t("totalOrders"), t("sales"), t("returns"), t("expenses"), t("netRevenue")],
                rows: [[
                  new Date(data.startDate).toLocaleDateString("ar-EG"),
                  new Date(data.endDate).toLocaleDateString("ar-EG"),
                  data.totalOrders,
                  formatCurrency(data.sales),
                  formatCurrency(data.returns),
                  formatCurrency(data.expenses),
                  formatCurrency(data.netRevenue),
                ]],
              })
            }
          >
            PDF {tCommon("export")}
          </Button>
        )}
      </div>

      {isLoading && <LoadingOverlay isLoading={true} message={t("loading")} />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label={t("totalSales")} value={`${formatCurrency(data.sales)} ${tCommon("currency")}`} icon={TrendingUp} />
            <SummaryCard label={t("totalOrders")} value={data.totalOrders.toString()} icon={BarChart3} />
            <SummaryCard label={t("expenses")} value={`${formatCurrency(data.expenses)} ${tCommon("currency")}`} icon={Receipt} />
            <SummaryCard label={t("netRevenue")} value={`${formatCurrency(data.netRevenue)} ${tCommon("currency")}`} icon={TrendingUp} />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("startDate")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("endDate")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("sales")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("returns")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("expenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("netRevenue")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(data.startDate).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(data.endDate).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.sales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.returns)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.expenses)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.netRevenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button variant="ghost" size="sm" onClick={() => setViewingRow(data)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {startDate && endDate && data === null && (
        <EmptyState title={t("emptyTitle")} description={t("emptyForPeriod")} />
      )}

      <Dialog open={!!viewingRow} onOpenChange={(open) => { if (!open) setViewingRow(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("reportDetails")}</DialogTitle>
          </DialogHeader>
          {viewingRow && (
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">{t("startDate")}</p><p className="text-sm font-medium">{new Date(viewingRow.startDate).toLocaleDateString("ar-EG")}</p></div>
              <div><p className="text-sm text-gray-500">{t("endDate")}</p><p className="text-sm font-medium">{new Date(viewingRow.endDate).toLocaleDateString("ar-EG")}</p></div>
              <div><p className="text-sm text-gray-500">{t("totalOrders")}</p><p className="text-sm font-medium">{viewingRow.totalOrders}</p></div>
              <div><p className="text-sm text-gray-500">{t("sales")}</p><p className="text-sm font-medium">{formatCurrency(viewingRow.sales)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("returns")}</p><p className="text-sm font-medium">{formatCurrency(viewingRow.returns)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("expenses")}</p><p className="text-sm font-medium">{formatCurrency(viewingRow.expenses)} {tCommon("currency")}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">{t("netRevenue")}</p><p className="text-lg font-bold">{formatCurrency(viewingRow.netRevenue)} {tCommon("currency")}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeliveryReportTab() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [viewingRider, setViewingRider] = useState<any>(null);
  const { data, isLoading } = useDeliveryReport(startDate || undefined, endDate || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("startDate")}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">{t("endDate")}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              generateReportPdf({
                title: t("delivery"),
                dateRange: { from: startDate, to: endDate },
                headers: [t("riderName"), t("numberOfOrders"), t("totalSales")],
                rows: data.map((item) => [item.riderName, item.numberOfOrders, formatCurrency(item.totalSales)]),
                totals: [
                  { label: t("totalDeliveryOrders"), value: data.reduce((sum, d) => sum + d.numberOfOrders, 0).toString() },
                  { label: t("totalDeliverySales"), value: `${formatCurrency(data.reduce((sum, d) => sum + d.totalSales, 0))} ${tCommon("currency")}` },
                ],
              })
            }
          >
            PDF {tCommon("export")}
          </Button>
        )}
      </div>

      {isLoading && <LoadingOverlay isLoading={true} message={t("loadingDelivery")} />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryCard label={t("totalDeliveryOrders")} value={data.reduce((sum, d) => sum + d.numberOfOrders, 0).toString()} icon={Truck} />
            <SummaryCard label={t("totalDeliverySales")} value={`${formatCurrency(data.reduce((sum, d) => sum + d.totalSales, 0))} ${tCommon("currency")}`} icon={TrendingUp} />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("riderName")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("numberOfOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalSales")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.riderId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.riderName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.numberOfOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.totalSales)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="ghost" size="sm" onClick={() => setViewingRider(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {startDate && endDate && data === null && (
        <EmptyState title={t("emptyTitle")} description={t("emptyDelivery")} />
      )}

      <Dialog open={!!viewingRider} onOpenChange={(open) => { if (!open) setViewingRider(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("riderDetails")}</DialogTitle>
          </DialogHeader>
          {viewingRider && (
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">{t("riderName")}</p><p className="text-sm font-medium">{viewingRider.riderName}</p></div>
              <div><p className="text-sm text-gray-500">{t("numberOfOrders")}</p><p className="text-sm font-medium">{viewingRider.numberOfOrders}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">{t("totalSales")}</p><p className="text-lg font-bold">{formatCurrency(viewingRider.totalSales)} {tCommon("currency")}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExpenseReportTab() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [viewingExpense, setViewingExpense] = useState<any>(null);
  const { data, isLoading } = useExpenseReport(startDate || undefined, endDate || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("startDate")}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">{t("endDate")}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              generateReportPdf({
                title: t("expense"),
                dateRange: { from: startDate, to: endDate },
                headers: [t("titleCol"), t("expenses"), t("createdBy"), t("date"), t("notes")],
                rows: data.map((item) => [
                  item.title,
                  formatCurrency(item.amount),
                  item.createdBy,
                  new Date(item.date).toLocaleDateString("ar-EG"),
                  item.notes || "-",
                ]),
                totals: [
                  { label: t("totalExpensesReport"), value: `${formatCurrency(data.reduce((sum, e) => sum + e.amount, 0))} ${tCommon("currency")}` },
                ],
              })
            }
          >
            PDF {tCommon("export")}
          </Button>
        )}
      </div>

      {isLoading && <LoadingOverlay isLoading={true} message={t("loadingExpenses")} />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryCard label={t("totalExpensesReport")} value={`${formatCurrency(data.reduce((sum, e) => sum + e.amount, 0))} ${tCommon("currency")}`} icon={Receipt} />
            <SummaryCard label={t("numberOfExpenses")} value={data.length.toString()} icon={BarChart3} />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("titleCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("expenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("createdBy")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("date")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("notes")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.notes || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="ghost" size="sm" onClick={() => setViewingExpense(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {startDate && endDate && data === null && (
        <EmptyState title={t("emptyTitle")} description={t("emptyExpenses")} />
      )}

      <Dialog open={!!viewingExpense} onOpenChange={(open) => { if (!open) setViewingExpense(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("expenseDetails")}</DialogTitle>
          </DialogHeader>
          {viewingExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">{t("titleCol")}</p><p className="text-sm font-medium">{viewingExpense.title}</p></div>
                <div><p className="text-sm text-gray-500">{tCommon("amount")}</p><p className="text-sm font-medium">{formatCurrency(viewingExpense.amount)} {tCommon("currency")}</p></div>
                <div><p className="text-sm text-gray-500">{t("createdBy")}</p><p className="text-sm font-medium">{viewingExpense.createdBy}</p></div>
                <div><p className="text-sm text-gray-500">{t("date")}</p><p className="text-sm font-medium">{new Date(viewingExpense.date).toLocaleDateString("ar-EG")}</p></div>
              </div>
              {viewingExpense.notes && (
                <div><p className="text-sm text-gray-500">{tCommon("notes")}</p><p className="text-sm">{viewingExpense.notes}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReturnsReportTab() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [viewingReturn, setViewingReturn] = useState<any>(null);
  const { data, isLoading } = useReturnsReport(startDate || undefined, endDate || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">{t("startDate")}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">{t("endDate")}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {data && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              generateReportPdf({
                title: t("returns"),
                dateRange: { from: startDate, to: endDate },
                headers: [t("totalOrders"), t("returnDate"), t("returnedProducts"), t("refundAmountCol"), t("cashierCol")],
                rows: data.map((item) => [
                  item.invoiceNumber,
                  new Date(item.returnDate).toLocaleDateString("ar-EG"),
                  item.returnedItems,
                  formatCurrency(item.refundAmount),
                  item.cashier,
                ]),
                totals: [
                  { label: t("totalReturnsReport"), value: `${formatCurrency(data.reduce((sum, r) => sum + r.refundAmount, 0))} ${tCommon("currency")}` },
                ],
              })
            }
          >
            PDF {tCommon("export")}
          </Button>
        )}
      </div>

      {isLoading && <LoadingOverlay isLoading={true} message={t("loadingReturns")} />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryCard label={t("totalReturnsReport")} value={`${formatCurrency(data.reduce((sum, r) => sum + r.refundAmount, 0))} ${tCommon("currency")}`} icon={RotateCcw} />
            <SummaryCard label={t("numberOfReturns")} value={data.length.toString()} icon={BarChart3} />
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalOrders")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("returnDate")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("returnedProducts")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("refundAmountCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("cashierCol")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{tCommon("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.invoiceNumber}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.returnDate).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.returnedItems}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.refundAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cashier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="ghost" size="sm" onClick={() => setViewingReturn(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {startDate && endDate && data === null && (
        <EmptyState title={t("emptyTitle")} description={t("emptyReturns")} />
      )}

      <Dialog open={!!viewingReturn} onOpenChange={(open) => { if (!open) setViewingReturn(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("returnDetails")}</DialogTitle>
          </DialogHeader>
          {viewingReturn && (
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">{t("totalOrders")}</p><p className="text-sm font-medium">{viewingReturn.invoiceNumber}</p></div>
              <div><p className="text-sm text-gray-500">{t("returnDate")}</p><p className="text-sm font-medium">{new Date(viewingReturn.returnDate).toLocaleDateString("ar-EG")}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">{t("returnedProducts")}</p><p className="text-sm">{viewingReturn.returnedItems}</p></div>
              <div><p className="text-sm text-gray-500">{t("refundAmountCol")}</p><p className="text-lg font-bold">{formatCurrency(viewingReturn.refundAmount)} {tCommon("currency")}</p></div>
              <div><p className="text-sm text-gray-500">{t("cashierCol")}</p><p className="text-sm font-medium">{viewingReturn.cashier}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const t = useTranslations("reports");
  const [activeTab, setActiveTab] = useState<ReportTab>("daily");

  const TABS: { key: ReportTab; label: string; icon: React.ElementType }[] = [
    { key: "daily", label: t("daily"), icon: Calendar },
    { key: "dailyDetails", label: t("dailyDetails"), icon: FileText },
    { key: "monthly", label: t("monthly"), icon: BarChart3 },
    { key: "custom", label: t("custom"), icon: TrendingUp },
    { key: "delivery", label: t("delivery"), icon: Truck },
    { key: "expense", label: t("expense"), icon: Receipt },
    { key: "returns", label: t("returns"), icon: RotateCcw },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "daily":
        return <DailyReportTab />;
      case "dailyDetails":
        return <DailyDetailsTab />;
      case "monthly":
        return <MonthlyReportTab />;
      case "custom":
        return <CustomReportTab />;
      case "delivery":
        return <DeliveryReportTab />;
      case "expense":
        return <ExpenseReportTab />;
      case "returns":
        return <ReturnsReportTab />;
      default:
        return null;
    }
  };

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
        <div className="bg-white shadow rounded-lg mb-6">
          <nav className="flex overflow-x-auto border-b border-gray-200">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
}
