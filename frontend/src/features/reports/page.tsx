"use client";

import { useState } from "react";
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
} from "lucide-react";
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
import {
  useDailyReport,
  useMonthlyReport,
  useCustomReport,
  useDeliveryReport,
  useExpenseReport,
  useReturnsReport,
} from "./hooks";

type ReportTab = "daily" | "monthly" | "custom" | "delivery" | "expense" | "returns";

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
            <SummaryCard label={t("totalSales")} value={`${formatCurrency(data.totalSales)} ${tCommon("currency")}`} icon={TrendingUp} />
            <SummaryCard label={t("totalOrders")} value={data.totalOrders.toString()} icon={BarChart3} />
            <SummaryCard label={t("expenses")} value={`${formatCurrency(data.expenses)} ${tCommon("currency")}`} icon={Receipt} />
            <SummaryCard label={t("netRevenue")} value={`${formatCurrency(data.revenueAfterExpenses)} ${tCommon("currency")}`} icon={TrendingUp} />
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
