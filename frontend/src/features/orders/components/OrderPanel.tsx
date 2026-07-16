"use client";

import {
  Pause,
  Check,
  Tag,
  Receipt,
  Printer,
  Send,
  X,
  ShoppingCart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/lib/components/ui/button";
import { OrderItemRow } from "./OrderItemRow";
import { OrderTotals } from "./OrderTotals";
import { CustomerSearch } from "./CustomerSearch";
import { ORDER_TYPE } from "@/lib/constants/order-status";
import type { Order, OrderItemDetailDto } from "../hooks";
import type { CartItem } from "../types";
import type { Table } from "@/features/tables/hooks";
import type { Customer } from "@/features/customers/hooks";
import type { DeliveryRider } from "@/features/delivery-riders/hooks";

interface OrderPanelProps {
  orderType: string;
  onOrderTypeChange: (type: string) => void;
  selectedTableId: number | null;
  onTableChange: (id: number | null) => void;
  selectedCustomerId: number | null;
  onCustomerChange: (id: number | null) => void;
  selectedRiderId: number | null;
  onRiderChange: (id: number | null) => void;
  activeOrder: Order | null;
  cartItems: CartItem[];
  tables: Table[] | undefined;
  customers: Customer[] | undefined;
  riders: DeliveryRider[] | undefined;
  subtotal: number;
  discount: number;
  discountType: string | null;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  onOpenHoldOrders: () => void;
  onOpenDiscount: () => void;
  onOpenServiceCharge: () => void;
  onOpenPayment: () => void;
  onHoldOrder: () => void;
  onCreateOrder: () => void;
  onCancelOrder: () => void;
  onUpdateCartQty: (index: number, delta: number) => void;
  onRemoveCartItem: (index: number) => void;
  onUpdateOrderItemQty: (itemId: number, newQty: number) => void;
  onRemoveOrderItem: (itemId: number) => void;
  onRemoveDiscount: () => void;
  onRemoveServiceCharge: () => void;
  onOpenItemNotes: (index: number) => void;
  onOpenAddCustomer: () => void;
  holdCount: number;
  isCreating: boolean;
  isUpdatingItem: boolean;
  isRemovingItem: boolean;
}

export function OrderPanel({
  orderType,
  onOrderTypeChange,
  selectedTableId,
  onTableChange,
  selectedCustomerId,
  onCustomerChange,
  selectedRiderId,
  onRiderChange,
  activeOrder,
  cartItems,
  tables,
  customers,
  riders,
  subtotal,
  discount,
  discountType,
  serviceCharge,
  tax,
  grandTotal,
  onOpenHoldOrders,
  onOpenDiscount,
  onOpenServiceCharge,
  onOpenPayment,
  onHoldOrder,
  onCreateOrder,
  onCancelOrder,
  onUpdateCartQty,
  onRemoveCartItem,
  onUpdateOrderItemQty,
  onRemoveOrderItem,
  onRemoveDiscount,
  onRemoveServiceCharge,
  onOpenItemNotes,
  onOpenAddCustomer,
  holdCount,
  isCreating,
  isUpdatingItem,
  isRemovingItem,
}: OrderPanelProps) {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");

  const orderTypes = [
    { value: ORDER_TYPE.DINE_IN, label: t("dineIn") },
    { value: ORDER_TYPE.TAKE_AWAY, label: t("takeAway") },
    { value: ORDER_TYPE.DELIVERY, label: t("delivery") },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {activeOrder ? (
              <>
                <h2 className="font-bold text-base text-gray-900">
                  #{activeOrder.invoiceNumber}
                </h2>
                {activeOrder.status === "Hold" && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    {t("held")}
                  </span>
                )}
              </>
            ) : (
              <h2 className="font-bold text-base text-gray-900">
                {t("newOrder")}
              </h2>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenHoldOrders}
            className="gap-1.5"
          >
            <Pause className="w-3.5 h-3.5" />
            {t("holdCount", { count: holdCount })}
          </Button>
        </div>

        {/* Order Type Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg">
          {orderTypes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onOrderTypeChange(opt.value)}
              disabled={!!activeOrder}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                orderType === opt.value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } ${activeOrder ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Selectors */}
        <div className="flex gap-2 mt-3">
          {orderType === ORDER_TYPE.DINE_IN && (
            <select
              value={selectedTableId || ""}
              onChange={(e) =>
                onTableChange(e.target.value ? Number(e.target.value) : null)
              }
              disabled={!!activeOrder}
              className="flex-1 h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
            >
              <option value="">{t("selectTable")}</option>
              {tables?.map((table) => (
                <option key={table.id} value={table.id}>
                  {t("tableLabel", { number: table.number })}
                  {table.isOccupied ? ` (${tCommon("occupied")})` : ""}
                </option>
              ))}
            </select>
          )}

          {(orderType === ORDER_TYPE.DELIVERY ||
            orderType === ORDER_TYPE.TAKE_AWAY) && (
            <CustomerSearch
              selectedCustomerId={selectedCustomerId}
              customers={customers}
              onCustomerChange={onCustomerChange}
              onOpenAddCustomer={onOpenAddCustomer}
              required={orderType === ORDER_TYPE.DELIVERY}
            />
          )}

          {orderType === ORDER_TYPE.DELIVERY && (
            <select
              value={selectedRiderId || ""}
              onChange={(e) =>
                onRiderChange(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="flex-1 h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
            >
              <option value="">{t("selectRider")}</option>
              {riders?.map((rider) => (
                <option key={rider.id} value={rider.id}>
                  {rider.name} - {rider.phone}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto">
        {activeOrder ? (
          activeOrder.items.length > 0 ? (
            activeOrder.items.map((item: OrderItemDetailDto) => (
              <OrderItemRow
                key={item.id}
                name={item.menuItemName}
                unitPrice={item.unitPrice}
                quantity={item.quantity}
                total={item.total}
                notes={item.notes}
                onIncrease={() =>
                  onUpdateOrderItemQty(item.id, item.quantity + 1)
                }
                onDecrease={() =>
                  onUpdateOrderItemQty(item.id, item.quantity - 1)
                }
                onRemove={() => onRemoveOrderItem(item.id)}
                disabled={isUpdatingItem || isRemovingItem}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p className="text-sm">{t("noItems")}</p>
            </div>
          )
        ) : cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <OrderItemRow
              key={index}
              name={item.menuItemName}
              unitPrice={item.unitPrice}
              quantity={item.quantity}
              total={item.unitPrice * item.quantity}
              notes={item.notes}
              onIncrease={() => onUpdateCartQty(index, 1)}
              onDecrease={() => onUpdateCartQty(index, -1)}
              onRemove={() => onRemoveCartItem(index)}
              onNotes={() => onOpenItemNotes(index)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-12 h-12 mb-2" />
            <p className="text-sm">{t("emptyCart")}</p>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-4 py-3 border-t bg-gray-50 shrink-0">
        <OrderTotals
          subtotal={subtotal}
          discount={discount}
          discountType={discountType}
          serviceCharge={serviceCharge}
          tax={tax}
          grandTotal={grandTotal}
          onRemoveDiscount={activeOrder ? onRemoveDiscount : undefined}
          onRemoveServiceCharge={
            activeOrder ? onRemoveServiceCharge : undefined
          }
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t shrink-0 space-y-2">
        {!activeOrder && cartItems.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-14 text-base font-semibold"
              onClick={onHoldOrder}
              disabled={isCreating}
            >
              <Pause className="w-5 h-5 ml-2" />
              {t("holdButton")}
            </Button>
            <Button
              className="flex-1 h-14 text-base font-semibold bg-green-600 hover:bg-green-700"
              onClick={onCreateOrder}
              disabled={isCreating}
            >
              <Check className="w-5 h-5 ml-2" />
              {t("createOrder")}
            </Button>
          </div>
        )}

        {activeOrder && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={onOpenDiscount}
                disabled={!!activeOrder.discountType}
              >
                <Tag className="w-4 h-4 ml-1" />
                {t("discountButton")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={onOpenServiceCharge}
                disabled={!!activeOrder.serviceCharge}
              >
                <Receipt className="w-4 h-4 ml-1" />
                {t("serviceChargeButton")}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={onHoldOrder}
                disabled={isCreating}
              >
                <Pause className="w-4 h-4 ml-1" />
                {t("holdButton")}
              </Button>
              <Button
                className="flex-1 h-14 text-lg font-bold bg-green-600 hover:bg-green-700"
                onClick={onOpenPayment}
              >
                <Check className="w-5 h-5 ml-2" />
                {t("completeButton")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
