import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const menuItemSchema = (t: TFunction) =>
  z.object({
    categoryId: z.number().min(1, t("selectField", { field: "الفئة" })),
    name: z
      .string()
      .min(1, t("fieldRequired", { field: "الاسم" }))
      .max(100, t("maxLength", { field: "الاسم", max: 100 })),
    price: z.number().min(0.01, t("greaterThanZero", { field: "السعر" })),
    image: z.string().optional(),
    notes: z.string().optional(),
    displayOrder: z.number().min(0, t("minValue", { field: "الترتيب", min: 0 })),
  });

export type MenuItemFormData = z.infer<ReturnType<typeof menuItemSchema>>;
