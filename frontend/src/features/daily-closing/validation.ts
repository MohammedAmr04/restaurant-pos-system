import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const dailyClosingSchema = (t: TFunction) =>
  z.object({
    actualCash: z.number().min(0, t("minValue", { field: "المبلغ الفعلي", min: 0 })),
    notes: z.string().optional(),
  });

export type DailyClosingFormData = z.infer<ReturnType<typeof dailyClosingSchema>>;
