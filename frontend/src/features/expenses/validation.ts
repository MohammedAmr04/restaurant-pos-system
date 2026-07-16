import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const expenseSchema = (t: TFunction) =>
  z.object({
    title: z
      .string()
      .min(1, t("fieldRequired", { field: "العنوان" }))
      .max(200, t("maxLength", { field: "العنوان", max: 200 })),
    amount: z.number().min(0.01, t("greaterThanZero", { field: "المبلغ" })),
    notes: z.string().optional(),
  });

export type ExpenseFormData = z.infer<ReturnType<typeof expenseSchema>>;
