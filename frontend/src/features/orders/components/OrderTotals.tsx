"use client";

import { useTranslations } from "next-intl";
import { Tag, Receipt, Trash2 } from "lucide-react";

interface OrderTotalsProps {
  subtotal: number;
  discount: number;
  discountType: string | null;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
  onRemoveDiscount?: () => void;
  onRemoveServiceCharge?: () => void;
}

export function OrderTotals({
  subtotal,
  discount,
  discountType,
  serviceCharge,
  tax,
  grandTotal,
  onRemoveDiscount,
  onRemoveServiceCharge,
}: OrderTotalsProps) {
  const t = useTranslations("common");

  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">{t("subtotal")}</span>
        <span className="font-medium text-gray-900">{subtotal.toFixed(2)}</span>
      </div>

      {discountType && discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {t("discount")}
            {onRemoveDiscount && (
              <button
                onClick={onRemoveDiscount}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </span>
          <span>-{discount.toFixed(2)}</span>
        </div>
      )}

      {serviceCharge > 0 && (
        <div className="flex justify-between text-blue-600">
          <span className="flex items-center gap-1">
            <Receipt className="w-3 h-3" />
            {t("serviceCharge")}
            {onRemoveServiceCharge && (
              <button
                onClick={onRemoveServiceCharge}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </span>
          <span>{serviceCharge.toFixed(2)}</span>
        </div>
      )}

      {tax > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-500">{t("tax")}</span>
          <span className="font-medium text-gray-900">{tax.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
        <span className="font-bold text-gray-900">{t("grandTotal")}</span>
        <span className="text-primary font-bold" style={{ fontSize: "32px" }}>
          {grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
