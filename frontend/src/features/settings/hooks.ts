import { apiClient } from "@/lib/api/client";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface SettingsDto {
  id: number;
  restaurantName: string;
  phone: string;
  address: string;
  logo: string | null;
  taxEnabled: boolean;
  taxPercentage: number;
  serviceChargeEnabled: boolean;
  serviceChargePercentage: number;
  receiptHeader: string;
  receiptFooter: string;
}

export interface UpdateSettingsDto {
  restaurantName: string;
  phone: string;
  address: string;
  logo?: string;
  taxEnabled: boolean;
  taxPercentage: number;
  serviceChargeEnabled: boolean;
  serviceChargePercentage: number;
  receiptHeader?: string;
  receiptFooter?: string;
}

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.SETTINGS,
    queryFn: async () => {
      const response = await apiClient.get<SettingsDto>("/settings");
      return response.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsDto) => {
      const response = await apiClient.put<SettingsDto>("/settings", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SETTINGS });
    },
  });
}
