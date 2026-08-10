import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const settingsSchema = (t: TFunction) =>
  z.object({
    restaurantName: z.string().min(1, t("fieldRequired", { field: "اسم المطعم" })),
    phone: z.string().min(1, t("fieldRequired", { field: "رقم الهاتف" })),
    address: z.string().min(1, t("fieldRequired", { field: "العنوان" })),
    logo: z.string().optional(),
    taxEnabled: z.boolean(),
    taxPercentage: z
      .number()
      .min(0, t("minValue", { field: "نسبة الضريبة", min: 0 }))
      .max(100, t("maxPercent", { field: "نسبة الضريبة" })),
    serviceChargeEnabled: z.boolean(),
    serviceChargePercentage: z
      .number()
      .min(0, t("minValue", { field: "نسبة رسوم الخدمة", min: 0 }))
      .max(100, t("maxPercent", { field: "نسبة رسوم الخدمة" })),
    receiptHeader: z.string().optional(),
    receiptFooter: z.string().optional(),
    shiftStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, t("timeFormat", { field: "بداية الوردية" })),
    shiftEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, t("timeFormat", { field: "نهاية الوردية" })),
  });

export type SettingsFormData = z.infer<ReturnType<typeof settingsSchema>>;
