"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Calendar, DollarSign, TrendingUp, TrendingDown, History } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/components/ui/dialog";
import { ROUTES } from "@/lib/constants/routes";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import { useDailyClosingSummary, useDailyClosingHistory, useCreateDailyClosing, DailyClosing } from "./hooks";
import { dailyClosingSchema, DailyClosingFormData } from "./validation";

export default function DailyClosingPage() {
  const router = useRouter();
  const t = useTranslations("dailyClosing");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");
  const [isClosingOpen, setIsClosingOpen] = useState(false);
  const [viewingClosing, setViewingClosing] = useState<DailyClosing | null>(null);

  const { data: summary, isLoading: isLoadingSummary } = useDailyClosingSummary();
  const { data: history, isLoading: isLoadingHistory } = useDailyClosingHistory();
  const createClosingMutation = useCreateDailyClosing();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DailyClosingFormData>({
    resolver: zodResolver(dailyClosingSchema(tVal)),
    defaultValues: {
      actualCash: 0,
      notes: "",
    },
  });

  const actualCashValue = watch("actualCash");
  const difference = summary ? actualCashValue - summary.expectedCash : 0;

  const handleCreateClosing = async (data: DailyClosingFormData) => {
    await createClosingMutation.mutateAsync(data);
    setIsClosingOpen(false);
    reset();
  };

  if (isLoadingSummary || isLoadingHistory) {
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
          <Button onClick={() => setIsClosingOpen(true)}>
            <Calendar className="w-5 h-5 ml-2" />
            {t("closeDay")}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("totalSales")}</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalSales.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("totalExpenses")}</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("cashCollected")}</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.cashCollected.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("expectedCash")}</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.expectedCash.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5" />
              {t("historyTitle")}
            </h2>
          </div>
          {history && history.length === 0 ? (
            <EmptyState title={t("emptyHistory")} description={t("emptyHistoryDescription")} />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("date")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("totalSales")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("expenses")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("returns")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actual")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("difference")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history?.map((closing) => (
                  <tr key={closing.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(closing.businessDate).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {closing.totalSales.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {closing.totalExpenses.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {closing.totalReturns.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {closing.actualCash.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        closing.difference === 0
                          ? "bg-green-100 text-green-800"
                          : closing.difference > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {closing.difference > 0 ? "+" : ""}{closing.difference.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingClosing(closing)}
                      >
                        {t("details")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Dialog open={isClosingOpen} onOpenChange={(open) => { if (!open) { setIsClosingOpen(false); reset(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("closingTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreateClosing)} className="space-y-6">
            {summary && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("summaryTotalSales")}:</span>
                  <span className="font-semibold">{summary.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("summaryExpenses")}:</span>
                  <span className="font-semibold">{summary.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("summaryReturns")}:</span>
                  <span className="font-semibold">{summary.totalReturns.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">{t("summaryCashCollected")}:</span>
                  <span className="font-semibold">{summary.cashCollected.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("summaryExpectedCash")}:</span>
                  <span className="font-semibold text-blue-600">{summary.expectedCash.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="actualCash">{t("actualCashLabel")}</Label>
              <Input
                id="actualCash"
                type="number"
                step="0.01"
                {...register("actualCash", { valueAsNumber: true })}
              />
              {errors.actualCash?.message && (
                <p className="text-sm text-red-500">{errors.actualCash.message}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("differenceLabel")}</span>
                <span className={`font-semibold ${difference === 0 ? "text-green-600" : difference > 0 ? "text-yellow-600" : "text-red-600"}`}>
                  {difference > 0 ? "+" : ""}{difference.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Input
                id="notes"
                {...register("notes")}
              />
              {errors.notes?.message && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsClosingOpen(false);
                  reset();
                }}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={createClosingMutation.isPending}>
                {t("saveClosing")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingClosing} onOpenChange={(open) => { if (!open) setViewingClosing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("detailTitle")}</DialogTitle>
          </DialogHeader>
          {viewingClosing && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("detailDate")}:</span>
                  <span className="font-semibold">{new Date(viewingClosing.businessDate).toLocaleDateString("ar-EG")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("detailTotalSales")}:</span>
                  <span className="font-semibold">{viewingClosing.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("detailExpenses")}:</span>
                  <span className="font-semibold">{viewingClosing.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("detailReturns")}:</span>
                  <span className="font-semibold">{viewingClosing.totalReturns.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">{t("detailCashCollected")}:</span>
                  <span className="font-semibold">{viewingClosing.cashCollected.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("detailExpectedCash")}:</span>
                  <span className="font-semibold">{viewingClosing.expectedCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("detailActualCash")}:</span>
                  <span className="font-semibold">{viewingClosing.actualCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">{t("detailDifference")}:</span>
                  <span className={`font-semibold ${viewingClosing.difference === 0 ? "text-green-600" : viewingClosing.difference > 0 ? "text-yellow-600" : "text-red-600"}`}>
                    {viewingClosing.difference > 0 ? "+" : ""}{viewingClosing.difference.toFixed(2)}
                  </span>
                </div>
                {viewingClosing.notes && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600">{t("detailNotes")}:</span>
                    <p className="mt-1">{viewingClosing.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setViewingClosing(null)}>
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
