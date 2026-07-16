import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const createOrderItemSchema = (t: TFunction) =>
  z.object({
    menuItemId: z.number().min(1, t("selectField", { field: "الصنف" })),
    quantity: z.number().min(1, t("minValue", { field: "الكمية", min: 1 })),
    notes: z.string().optional(),
  });

export const applyDiscountSchema = (t: TFunction) =>
  z.object({
    discountType: z.enum(["Amount", "Percentage"], {
      required_error: t("fieldRequired", { field: "نوع الخصم" }),
    }),
    discountValue: z.number().min(0.01, t("greaterThanZero", { field: "قيمة الخصم" })),
  });

export const applyServiceChargeSchema = (t: TFunction) =>
  z.object({
    serviceCharge: z.number().min(0, t("minValue", { field: "رسوم الخدمة", min: 0 })),
  });

export const completeOrderSchema = (t: TFunction) =>
  z.object({
    paymentMethod: z.enum(["Cash", "Visa", "Instapay", "Wallet"], {
      required_error: t("fieldRequired", { field: "طريقة الدفع" }),
    }),
    paidAmount: z.number().min(0.01, t("greaterThanZero", { field: "المبلغ المدفوع" })),
  });

export type CreateOrderItemFormData = z.infer<ReturnType<typeof createOrderItemSchema>>;
export type ApplyDiscountFormData = z.infer<ReturnType<typeof applyDiscountSchema>>;
export type ApplyServiceChargeFormData = z.infer<ReturnType<typeof applyServiceChargeSchema>>;
export type CompleteOrderFormData = z.infer<ReturnType<typeof completeOrderSchema>>;
