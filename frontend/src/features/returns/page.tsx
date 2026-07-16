"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  ArrowRight,
  Search,
  Eye,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/lib/components/ui/dialog";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import {
  useReturns,
  useCreateReturn,
  ReturnDto,
  CreateReturnDto,
} from "./hooks";
import { useOrders, Order } from "@/features/orders/hooks";
import { createReturnSchema, CreateReturnFormData } from "./validation";

export default function ReturnsPage() {
  const t = useTranslations("returns");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingReturn, setViewingReturn] = useState<ReturnDto | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: returns, isLoading } = useReturns();
  const { data: orders } = useOrders();
  const createMutation = useCreateReturn();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateReturnFormData>({
    resolver: zodResolver(createReturnSchema(tVal)),
    defaultValues: {
      orderId: 0,
      reason: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const filteredReturns = useMemo(() => {
    if (!returns) return [];
    if (!searchQuery.trim()) return returns;
    return returns.filter((r) =>
      r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [returns, searchQuery]);

  const matchedOrders = useMemo(() => {
    if (!orders || !orderSearch.trim()) return [];
    return orders.filter((o) =>
      o.invoiceNumber.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderSearch("");
    reset({
      orderId: order.id,
      reason: "",
      items: order.items.map((item) => ({
        orderItemId: item.id,
        quantity: 1,
      })),
    });
  };

  const handleCreate = async (data: CreateReturnFormData) => {
    const dto: CreateReturnDto = {
      orderId: data.orderId,
      reason: data.reason,
      items: data.items,
    };
    await createMutation.mutateAsync(dto);
    setIsCreateOpen(false);
    setSelectedOrder(null);
    setOrderSearch("");
    reset();
  };

  const openCreateDialog = () => {
    setSelectedOrder(null);
    setOrderSearch("");
    reset({ orderId: 0, reason: "", items: [] });
    setIsCreateOpen(true);
  };

  const toggleItem = (orderItemId: number) => {
    const existingIndex = fields.findIndex(
      (f) => f.orderItemId === orderItemId
    );
    if (existingIndex >= 0) {
      remove(existingIndex);
    } else {
      append({ orderItemId, quantity: 1 });
    }
  };

  const isItemSelected = (orderItemId: number) =>
    fields.some((f) => f.orderItemId === orderItemId);

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
          <Button onClick={openCreateDialog}>
            <Plus className="w-5 h-5 ml-2" />
            {t("createTitle")}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t("searchInvoicePlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {filteredReturns.length === 0 ? (
          <EmptyState
            title={tCommon("noData")}
            description={searchQuery ? t("noResultsDescription") : t("emptyDescription")}
            icon={<RotateCcw className="w-12 h-12 text-gray-400" />}
          />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("invoiceNumber")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("refundAmount")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("reason")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("date")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("cashier")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tCommon("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReturns.map((returnItem) => (
                  <tr key={returnItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {returnItem.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.totalRefund.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {returnItem.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(returnItem.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {returnItem.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingReturn(returnItem)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setSelectedOrder(null);
            setOrderSearch("");
            reset();
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("createTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            {!selectedOrder ? (
              <div>
                <Label className="mb-2 block">{t("searchInvoice")}</Label>
                <Input
                  placeholder={t("searchInvoicePlaceholder")}
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
                {matchedOrders.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                    {matchedOrders.map((order) => (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => handleSelectOrder(order)}
                        className="w-full text-right px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {order.invoiceNumber}
                        </span>
                        <span className="text-sm text-gray-500">
                          {order.grandTotal.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {orderSearch && matchedOrders.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {t("noMatchingOrders")}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t("invoiceNumber")}: {selectedOrder.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tCommon("total")}: {selectedOrder.grandTotal.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(null);
                      setOrderSearch("");
                      reset({ orderId: 0, reason: "", items: [] });
                    }}
                  >
                    {t("changeOrder")}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="block">{t("itemsLabel")}</Label>
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-md border ${
                        isItemSelected(item.id)
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isItemSelected(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.menuItemName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.unitPrice.toFixed(2)} | x{item.quantity}
                        </p>
                      </div>
                      {isItemSelected(item.id) && (
                        <Input
                          type="number"
                          min="1"
                          max={item.quantity}
                          {...register(`items.${fields.findIndex((f) => f.orderItemId === item.id)}.quantity`, {
                            valueAsNumber: true,
                          })}
                          className="w-20 text-center"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {errors.items && (
                  <p className="text-sm text-red-600">{errors.items.message}</p>
                )}

                <div className="mt-4">
                  <Label className="mb-2 block">{t("returnReason")}</Label>
                  <Textarea
                    {...register("reason")}
                    placeholder={t("returnReasonPlaceholder")}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsCreateOpen(false);
                  setSelectedOrder(null);
                  setOrderSearch("");
                  reset();
                }}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !selectedOrder}
              >
                {t("confirmReturn")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!viewingReturn}
        onOpenChange={(open) => {
          if (!open) setViewingReturn(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("detailTitle")}</DialogTitle>
          </DialogHeader>
          {viewingReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t("invoiceNumber")}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {viewingReturn.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("refundAmount")}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {viewingReturn.totalRefund.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("cashier")}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {viewingReturn.userName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("date")}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingReturn.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">{t("reason")}</p>
                <p className="text-sm text-gray-900">{viewingReturn.reason}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">{t("returnedItems")}</p>
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        {t("returnedItemsTable.item")}
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        {t("returnedItemsTable.quantity")}
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        {t("returnedItemsTable.unitPrice")}
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        {t("returnedItemsTable.total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewingReturn.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.menuItemName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => setViewingReturn(null)}
                >
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
