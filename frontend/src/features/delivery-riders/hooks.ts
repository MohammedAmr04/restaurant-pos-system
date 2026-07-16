import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface DeliveryRider {
  id: number;
  name: string;
  phone: string;
  notes: string | null;
}

export interface CreateDeliveryRiderDto {
  name: string;
  phone: string;
  notes?: string;
}

export interface UpdateDeliveryRiderDto {
  name: string;
  phone: string;
  notes?: string;
}

export function useDeliveryRiders() {
  return useQuery({
    queryKey: QUERY_KEYS.DELIVERY_RIDERS,
    queryFn: async () => {
      const response = await apiClient.get<DeliveryRider[]>("/delivery-riders");
      return response.data;
    },
  });
}

export function useDeliveryRider(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.DELIVERY_RIDER(id),
    queryFn: async () => {
      const response = await apiClient.get<DeliveryRider>(`/delivery-riders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDeliveryRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDeliveryRiderDto) => {
      const response = await apiClient.post<DeliveryRider>("/delivery-riders", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERY_RIDERS });
    },
  });
}

export function useUpdateDeliveryRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateDeliveryRiderDto }) => {
      const response = await apiClient.put<DeliveryRider>(`/delivery-riders/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERY_RIDERS });
    },
  });
}

export function useDeleteDeliveryRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/delivery-riders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DELIVERY_RIDERS });
    },
  });
}
