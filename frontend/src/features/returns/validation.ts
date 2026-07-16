import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const returnItemSchema = (t: TFunction) =>
  z.object({
    orderItemId: z.number().min(1, t("selectField", { field: t("menuItem") })),
    quantity: z.number().min(1, t("minValue", { field: t("quantity"), min: 1 })),
  });

export const createReturnSchema = (t: TFunction) =>
  z.object({
    orderId: z.number().min(1, t("selectField", { field: t("order") })),
    reason: z
      .string()
      .min(1, t("fieldRequired", { field: t("reason") }))
      .max(500, t("maxLength", { field: t("reason"), max: 500 })),
    items: z
      .array(returnItemSchema(t))
      .min(1, t("selectAtLeast", { field: t("oneItem") })),
  });

export type ReturnItemFormData = z.infer<ReturnType<typeof returnItemSchema>>;
export type CreateReturnFormData = z.infer<ReturnType<typeof createReturnSchema>>;
