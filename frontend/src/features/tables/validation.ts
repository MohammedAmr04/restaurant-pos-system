import { z } from "zod";

type TFunction = (key: string, params?: Record<string, string | number>) => string;

export const tableSchema = (t: TFunction) =>
  z.object({
    number: z.number().min(1, t("fieldRequired", { field: "رقم الطاولة" })),
  });

export type TableFormData = z.infer<ReturnType<typeof tableSchema>>;
