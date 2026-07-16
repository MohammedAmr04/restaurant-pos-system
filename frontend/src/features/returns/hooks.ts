import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ReturnItemDetailDto {
  id: number;
  orderItemId: number;
  menuItemName: string;
  quantity: number;
  refundAmount: number;
}

export interface ReturnDto {
  id: number;
  orderId: number;
  invoiceNumber: string;
  userId: number;
  userName: string;
  totalRefund: number;
  reason: string;
  createdAt: string;
  items: ReturnItemDetailDto[];
}

export interface ReturnItemDto {
  orderItemId: number;
  quantity: number;
}

export interface CreateReturnDto {
  orderId: number;
  reason: string;
  items: ReturnItemDto[];
}

export function useReturns() {
  return useQuery({
    queryKey: QUERY_KEYS.RETURNS,
    queryFn: async () => {
      const response = await apiClient.get<ReturnDto[]>("/returns");
      return response.data;
    },
  });
}

export function useReturn(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.RETURN(id),
    queryFn: async () => {
      const response = await apiClient.get<ReturnDto>(`/returns/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReturnDto) => {
      const response = await apiClient.post<ReturnDto>("/returns", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RETURNS });
    },
  });
}
