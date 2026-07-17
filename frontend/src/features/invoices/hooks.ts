import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Order } from "@/features/orders/hooks";

export type { Order };

export interface InvoiceFilters {
  search?: string;
  orderType?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useInvoices(filters: InvoiceFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.orderType) params.set("orderType", filters.orderType);
  if (filters.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);

  const queryString = params.toString();

  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: async () => {
      const url = `/orders/invoices${queryString ? `?${queryString}` : ""}`;
      const response = await apiClient.get<Order[]>(url);
      return response.data;
    },
  });
}
