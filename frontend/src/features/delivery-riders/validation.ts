import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const deliveryRiderSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("fieldRequired", { field: "الاسم" }))
      .max(100, t("maxLength", { field: "الاسم", max: 100 })),
    phone: z
      .string()
      .min(1, t("fieldRequired", { field: "رقم الهاتف" }))
      .max(20, t("maxLength", { field: "رقم الهاتف", max: 20 })),
    notes: z.string().optional(),
  });

export type DeliveryRiderFormData = z.infer<ReturnType<typeof deliveryRiderSchema>>;
