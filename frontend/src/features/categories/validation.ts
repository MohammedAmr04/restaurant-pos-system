import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const categorySchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("fieldRequired", { field: "الاسم" }))
      .max(100, t("maxLength", { field: "الاسم", max: 100 })),
    image: z.string().optional(),
    displayOrder: z.number().min(0, t("minValue", { field: "الترتيب", min: 0 })),
  });

export type CategoryFormData = z.infer<ReturnType<typeof categorySchema>>;
