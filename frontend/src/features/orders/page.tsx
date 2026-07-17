"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Trash2, RotateCcw } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import {
  ORDER_TYPE,
  DISCOUNT_TYPE,
  PAYMENT_METHOD,
} from "@/lib/constants/order-status";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { ConfirmDialog } from "@/lib/components/ui/confirm-dialog";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { LoadingOverlay } from "@/lib/components/ui/loading-overlay";
import { useMenuItems } from "@/features/menu-items/hooks";
import { useTables } from "@/features/tables/hooks";
import { useCustomers } from "@/features/customers/hooks";
import { useDeliveryRiders } from "@/features/delivery-riders/hooks";
import {
  useOrders,
  useOrder,
  useHoldOrders,
  useCreateOrder,
  useAddOrderItem,
  useUpdateOrderItem,
  useRemoveOrderItem,
  useApplyDiscount,
  useRemoveDiscount,
  useApplyServiceCharge,
  useRemoveServiceCharge,
  useCompleteOrder,
  useResumeOrder,
  useDeleteOrder,
  Order,
} from "./hooks";
import type { MenuItem } from "@/features/menu-items/hooks";
import type { CartItem } from "./types";
import { OrderPanel } from "./components/OrderPanel";
import { MenuPanel } from "./components/MenuPanel";
import { AddCustomerDialog } from "./components/AddCustomerDialog";

export default function POSPage() {
  const router = useRouter();
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");

  const [orderType, setOrderType] = useState<string>(ORDER_TYPE.DINE_IN);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuSearch, setMenuSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

  const [isHoldOrdersOpen, setIsHoldOrdersOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isServiceChargeOpen, setIsServiceChargeOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isItemNotesOpen, setIsItemNotesOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [itemNotes, setItemNotes] = useState("");
  const [discountType, setDiscountType] = useState<string>(DISCOUNT_TYPE.AMOUNT);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [serviceChargeValue, setServiceChargeValue] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHOD.CASH);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const { data: menuItems, isLoading: isLoadingMenu } = useMenuItems();
  const { data: tables } = useTables();
  const { data: customers } = useCustomers();
  const { data: riders } = useDeliveryRiders();
  const { data: holdOrders } = useHoldOrders();
  const { data: serverOrder } = useOrder(activeOrderId ?? 0);

  const createOrderMutation = useCreateOrder();
  const addItemMutation = useAddOrderItem();
  const updateItemMutation = useUpdateOrderItem();
  const removeItemMutation = useRemoveOrderItem();
  const applyDiscountMutation = useApplyDiscount();
  const removeDiscountMutation = useRemoveDiscount();
  const applyServiceChargeMutation = useApplyServiceCharge();
  const removeServiceChargeMutation = useRemoveServiceCharge();
  const completeOrderMutation = useCompleteOrder();
  const resumeOrderMutation = useResumeOrder();
  const deleteOrderMutation = useDeleteOrder();

  const categories = useMemo(() => {
    if (!menuItems) return [];
    const map = new Map<number, string>();
    menuItems.forEach((item: MenuItem) => {
      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, item.categoryName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item: MenuItem) => {
      if (!item.isAvailable) return false;
      if (categoryFilter && item.categoryId !== categoryFilter) return false;
      if (menuSearch && !item.name.includes(menuSearch)) return false;
      return true;
    });
  }, [menuItems, menuSearch, categoryFilter]);

  const cartSubtotal = useMemo(() => {
    if (serverOrder) return serverOrder.subtotal;
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cartItems, serverOrder]);

  const cartDiscount = useMemo(() => {
    if (serverOrder) {
      if (!serverOrder.discountType) return 0;
      if (serverOrder.discountType === DISCOUNT_TYPE.PERCENTAGE) {
        return (serverOrder.subtotal * serverOrder.discountValue) / 100;
      }
      return serverOrder.discountValue;
    }
    return 0;
  }, [serverOrder]);

  const cartServiceCharge = serverOrder?.serviceCharge || 0;
  const cartTax = serverOrder?.tax || 0;
  const cartGrandTotal = serverOrder
    ? serverOrder.grandTotal
    : cartSubtotal - cartDiscount + cartServiceCharge + cartTax;

  const resetForm = () => {
    setActiveOrderId(null);
    setCartItems([]);
    setSelectedTableId(null);
    setSelectedCustomerId(null);
    setSelectedRiderId(null);
    setDiscountValue(0);
    setServiceChargeValue(0);
  };

  const handleOrderTypeChange = (type: string) => {
    if (serverOrder) return;
    setOrderType(type);
    setSelectedTableId(null);
    setSelectedCustomerId(null);
    setSelectedRiderId(null);
  };

  const handleAddToCart = (menuItemId: number, name: string, price: number) => {
    if (serverOrder) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItemId);
      if (existing) {
        return prev.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menuItemId, menuItemName: name, unitPrice: price, quantity: 1, notes: "" }];
    });
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    if (serverOrder) return;
    setCartItems((prev) => {
      const newItems = [...prev];
      const newQty = newItems[index].quantity + delta;
      if (newQty <= 0) {
        newItems.splice(index, 1);
      } else {
        newItems[index] = { ...newItems[index], quantity: newQty };
      }
      return newItems;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    if (serverOrder) return;
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenItemNotes = (index: number) => {
    setEditingItemIndex(index);
    setItemNotes(cartItems[index]?.notes || "");
    setIsItemNotesOpen(true);
  };

  const handleSaveItemNotes = () => {
    if (editingItemIndex !== null) {
      setCartItems((prev) =>
        prev.map((item, i) => (i === editingItemIndex ? { ...item, notes: itemNotes } : item))
      );
    }
    setIsItemNotesOpen(false);
    setEditingItemIndex(null);
    setItemNotes("");
  };

  const handleCustomerCreated = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setIsAddCustomerOpen(false);
  };

  const handleCreateOrder = async () => {
    const items = cartItems.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes || undefined,
    }));
    const orderData = {
      orderType,
      ...(selectedTableId && { tableId: selectedTableId }),
      ...(selectedCustomerId && { customerId: selectedCustomerId }),
      ...(selectedRiderId && { deliveryRiderId: selectedRiderId }),
      items,
    };
    const result = await createOrderMutation.mutateAsync(orderData);
    setActiveOrderId(result.id);
  };

  const handleAddItemToOrder = async (menuItemId: number, name: string, price: number) => {
    if (!serverOrder) return;
    await addItemMutation.mutateAsync({
      orderId: serverOrder.id,
      data: { menuItemId, quantity: 1 },
    });
  };

  const handleUpdateOrderItemQty = async (itemId: number, newQty: number) => {
    if (!serverOrder) return;
    if (newQty <= 0) {
      await removeItemMutation.mutateAsync({ orderId: serverOrder.id, itemId });
    } else {
      await updateItemMutation.mutateAsync({
        orderId: serverOrder.id,
        itemId,
        data: { quantity: newQty },
      });
    }
  };

  const handleRemoveOrderItem = async (itemId: number) => {
    if (!serverOrder) return;
    await removeItemMutation.mutateAsync({ orderId: serverOrder.id, itemId });
  };

  const handleApplyDiscount = async () => {
    if (!serverOrder) return;
    await applyDiscountMutation.mutateAsync({
      orderId: serverOrder.id,
      data: { discountType, discountValue },
    });
    setIsDiscountOpen(false);
  };

  const handleRemoveDiscount = async () => {
    if (!serverOrder) return;
    await removeDiscountMutation.mutateAsync(serverOrder.id);
  };

  const handleApplyServiceCharge = async () => {
    if (!serverOrder) return;
    await applyServiceChargeMutation.mutateAsync({
      orderId: serverOrder.id,
      data: { serviceCharge: serviceChargeValue },
    });
    setIsServiceChargeOpen(false);
  };

  const handleRemoveServiceCharge = async () => {
    if (!serverOrder) return;
    await removeServiceChargeMutation.mutateAsync(serverOrder.id);
  };

  const handleHoldOrder = async () => {
    if (!serverOrder) {
      await handleCreateOrder();
    }
    resetForm();
  };

  const handleResumeOrder = async (order: Order) => {
    await resumeOrderMutation.mutateAsync(order.id);
    setActiveOrderId(order.id);
    setOrderType(order.orderType);
    setSelectedTableId(order.tableId);
    setSelectedCustomerId(order.customerId);
    setSelectedRiderId(order.deliveryRiderId);
    setIsHoldOrdersOpen(false);
  };

  const handleCompleteOrder = async () => {
    if (!serverOrder) return;
    try {
      await completeOrderMutation.mutateAsync({
        orderId: serverOrder.id,
        data: { paymentMethod, paidAmount: paidAmount || cartGrandTotal },
      });
      resetForm();
      setIsPaymentOpen(false);
    } catch (error: any) {
      alert(error.message || t("completeError"));
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    await deleteOrderMutation.mutateAsync(deletingOrder.id);
    setDeletingOrder(null);
    if (serverOrder?.id === deletingOrder.id) {
      resetForm();
    }
  };

  const openPaymentDialog = () => {
    setPaidAmount(cartGrandTotal);
    setIsPaymentOpen(true);
  };

  const orderTypeLabels: Record<string, string> = {
    [ORDER_TYPE.DINE_IN]: t("dineIn"),
    [ORDER_TYPE.TAKE_AWAY]: t("takeAway"),
    [ORDER_TYPE.DELIVERY]: t("delivery"),
  };

  if (isLoadingMenu) {
    return <LoadingOverlay isLoading={true} message={t("loading")} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!serverOrder && cartItems.length === 0 && (
            <Button variant="destructive" size="sm" onClick={resetForm}>
              {tCommon("new")}
            </Button>
          )}
        </div>
      </header>

      {/* Main Content: Two-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Order Panel - 30% */}
        <div className="w-[30%] min-w-[380px] max-w-[480px] border-r border-gray-200 shrink-0">
          <OrderPanel
            orderType={orderType}
            onOrderTypeChange={handleOrderTypeChange}
            selectedTableId={selectedTableId}
            onTableChange={setSelectedTableId}
            selectedCustomerId={selectedCustomerId}
            onCustomerChange={setSelectedCustomerId}
            selectedRiderId={selectedRiderId}
            onRiderChange={setSelectedRiderId}
            activeOrder={serverOrder ?? null}
            cartItems={cartItems}
            tables={tables}
            customers={customers}
            riders={riders}
            subtotal={cartSubtotal}
            discount={cartDiscount}
            discountType={serverOrder?.discountType || null}
            serviceCharge={cartServiceCharge}
            tax={cartTax}
            grandTotal={cartGrandTotal}
            onOpenHoldOrders={() => setIsHoldOrdersOpen(true)}
            onOpenDiscount={() => setIsDiscountOpen(true)}
            onOpenServiceCharge={() => setIsServiceChargeOpen(true)}
            onOpenPayment={openPaymentDialog}
            onHoldOrder={handleHoldOrder}
            onCreateOrder={handleCreateOrder}
            onCancelOrder={resetForm}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onUpdateOrderItemQty={handleUpdateOrderItemQty}
            onRemoveOrderItem={handleRemoveOrderItem}
            onRemoveDiscount={handleRemoveDiscount}
            onRemoveServiceCharge={handleRemoveServiceCharge}
            onOpenItemNotes={handleOpenItemNotes}
            onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
            holdCount={holdOrders?.length || 0}
            isCreating={createOrderMutation.isPending}
            isUpdatingItem={updateItemMutation.isPending}
            isRemovingItem={removeItemMutation.isPending}
          />
        </div>

        {/* Menu Panel - 70% */}
        <div className="flex-1 min-w-0">
          <MenuPanel
            categories={categories}
            filteredItems={filteredMenuItems}
            search={menuSearch}
            onSearchChange={setMenuSearch}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            onAddItem={serverOrder ? handleAddItemToOrder : handleAddToCart}
            isAddingItem={addItemMutation.isPending}
          />
        </div>
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Hold Orders Dialog */}
      <Dialog open={isHoldOrdersOpen} onOpenChange={setIsHoldOrdersOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("holdOrders")}</DialogTitle>
          </DialogHeader>
          {holdOrders && holdOrders.length === 0 ? (
            <EmptyState title={t("noHoldOrders")} />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {holdOrders?.map((order: Order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order.invoiceNumber} - {orderTypeLabels[order.orderType] || order.orderType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("itemsCount", { count: order.items.length })} - {order.grandTotal.toFixed(2)}
                    </p>
                    {order.tableNumber && (
                      <p className="text-xs text-gray-400">
                        {t("tableLabel", { number: order.tableNumber })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResumeOrder(order)}
                      disabled={resumeOrderMutation.isPending}
                    >
                      <RotateCcw className="w-4 h-4 ml-1" />
                      {t("resume")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingOrder(order)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("applyDiscount")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("discountType")}</Label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={DISCOUNT_TYPE.AMOUNT}>{t("fixedAmount")}</option>
                <option value={DISCOUNT_TYPE.PERCENTAGE}>{t("percentage")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>
                {discountType === DISCOUNT_TYPE.PERCENTAGE
                  ? t("discountPercentage")
                  : t("discountAmount")}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={discountValue || ""}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsDiscountOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button onClick={handleApplyDiscount} disabled={applyDiscountMutation.isPending}>
                {tCommon("apply")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Charge Dialog */}
      <Dialog open={isServiceChargeOpen} onOpenChange={setIsServiceChargeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("serviceChargeTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("serviceChargeAmount")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={serviceChargeValue || ""}
                onChange={(e) => setServiceChargeValue(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsServiceChargeOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button
                onClick={handleApplyServiceCharge}
                disabled={applyServiceChargeMutation.isPending}
              >
                {tCommon("apply")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("paymentTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">{t("totalLabel")}</p>
              <p className="text-3xl font-bold text-gray-900">{cartGrandTotal.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <Label>{t("paymentMethodLabel")}</Label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={PAYMENT_METHOD.CASH}>{t("cash")}</option>
                <option value={PAYMENT_METHOD.VISA}>{t("visa")}</option>
                <option value={PAYMENT_METHOD.INSTAPAY}>{t("instapay")}</option>
                <option value={PAYMENT_METHOD.WALLET}>{t("wallet")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>{t("paidAmountLabel")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={paidAmount || ""}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </div>
            {paidAmount > 0 && paidAmount >= cartGrandTotal && (
              <div className="text-center py-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">{t("changeDue")}</p>
                <p className="text-xl font-bold text-green-700">
                  {(paidAmount - cartGrandTotal).toFixed(2)}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsPaymentOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button onClick={handleCompleteOrder} disabled={completeOrderMutation.isPending}>
                {t("confirmPayment")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Notes Dialog */}
      <Dialog open={isItemNotesOpen} onOpenChange={setIsItemNotesOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("itemNotesTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("itemNotesLabel")}</Label>
              <Input
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder={t("itemNotesPlaceholder")}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsItemNotesOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button onClick={handleSaveItemNotes}>{tCommon("save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleDeleteOrder}
        title={t("deleteTitle")}
        message={t("deleteConfirm", { number: deletingOrder?.invoiceNumber ?? 0 })}
        confirmText={tCommon("delete")}
        variant="danger"
        isLoading={deleteOrderMutation.isPending}
      />

      <AddCustomerDialog
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  );
}
